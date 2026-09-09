import { resolve } from "node:path";
import { ADAPTERS, loadRecords } from "./adapters.js";
import { auditRecords, atomicWrite, renderMemoryCore, writeJsonl, writeMemoryCore } from "./operations.js";
import { portabilityErrors, preflightPaths } from "./safety.js";
import { RunState } from "./state.js";

const COMMANDS = new Set(["preflight", "normalize", "audit", "render", "run-init", "approve"]);
const VERSION = "0.1.0-rc.1";

function usage() {
  return [
    "Usage: openclaw-memory-migrator <command> [options]",
    "Commands: preflight, normalize, audit, render, run-init, approve",
    "Writes from normalize, audit, and render require --apply, --state, and --approval.",
  ].join("\n");
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!COMMANDS.has(command)) throw new Error(`${usage()}\nUnknown or missing command: ${command || "(none)"}`);
  const options = { input: [], apply: false };
  const booleans = new Set(["apply"]);
  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    if (!argument.startsWith("--")) throw new Error(`unexpected argument: ${argument}`);
    const key = argument.slice(2).replaceAll("-", "_");
    if (booleans.has(key)) {
      options[key] = true;
      continue;
    }
    const value = rest[index + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`${argument} requires a value`);
    index += 1;
    if (key === "input") options.input.push(value);
    else options[key] = value;
  }
  return { command, options };
}

function requireOption(options, name) {
  if (options[name] === undefined || options[name] === null || options[name] === "") {
    throw new Error(`--${name.replaceAll("_", "-")} is required`);
  }
}

function approvalAction(command, output) {
  return `${command}:${resolve(output)}`;
}

async function requireApproval(options, action) {
  requireOption(options, "state");
  requireOption(options, "approval");
  const state = await RunState.load(resolve(options.state));
  await state.consumeApproval(action, options.approval);
  return state;
}

function printJson(value, stdout) {
  stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

export async function main(argv = process.argv.slice(2), {
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  try {
    if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
      stdout.write(`${usage()}\n`);
      return 0;
    }
    if (argv[0] === "--version" || argv[0] === "-V") {
      stdout.write(`${VERSION}\n`);
      return 0;
    }
    const { command, options } = parseArgs(argv);
    if (command === "run-init") {
      requireOption(options, "state");
      const state = await RunState.create(resolve(options.state), options.run_id);
      printJson({ run_id: state.runId, state: resolve(options.state) }, stdout);
      return 0;
    }
    if (command === "approve") {
      requireOption(options, "state");
      requireOption(options, "action");
      const state = await RunState.load(resolve(options.state));
      stdout.write(`${await state.issueApproval(options.action)}\n`);
      return 0;
    }
    if (!options.input.length) throw new Error("--input is required and repeatable");
    const inputs = options.input.map((path) => resolve(path));
    if (command === "preflight") {
      const output = options.output ? resolve(options.output) : null;
      const errors = [...new Set([
        ...options.input.flatMap((path) => portabilityErrors(path, "input")),
        ...(options.output ? portabilityErrors(options.output, "output") : []),
        ...await preflightPaths(inputs, output, { outputKind: options.output_kind || "file" }),
      ])];
      printJson({ ok: errors.length === 0, errors }, stdout);
      return errors.length ? 2 : 0;
    }
    requireOption(options, "adapter");
    if (!ADAPTERS.has(options.adapter)) throw new Error(`unknown adapter: ${options.adapter}`);
    if ((command === "normalize" || command === "render") && !options.output) throw new Error("--output is required");
    const output = options.output ? resolve(options.output) : null;
    const errors = [...new Set([
      ...options.input.flatMap((path) => portabilityErrors(path, "input")),
      ...(options.output ? portabilityErrors(options.output, "output") : []),
      ...await preflightPaths(inputs, output, {
        outputKind: command === "render" ? "directory" : "file",
      }),
    ])];
    if (errors.length) throw new Error(errors.join("; "));
    const records = await loadRecords(options.adapter, inputs);

    if (command === "audit") {
      const approximateThreshold = options.approximate_threshold === undefined ? 0.9 : Number(options.approximate_threshold);
      const maxComparisons = options.max_comparisons === undefined ? 10_000 : Number(options.max_comparisons);
      const report = auditRecords(records, { approximateThreshold, maxComparisons });
      if (output && options.apply) {
        const action = approvalAction("audit", output);
        const state = await requireApproval(options, action);
        await atomicWrite(output, `${JSON.stringify(report, null, 2)}\n`);
        await state.completeStep("audit", { output, records: records.length });
        printJson({ written: output, records: records.length, run_id: state.runId }, stdout);
      } else {
        printJson(report, stdout);
        if (output) stderr.write(`DRY RUN: would write audit report to ${output}\n`);
      }
      return 0;
    }

    const action = approvalAction(command, output);
    if (!options.apply) {
      if (command === "normalize") {
        printJson({ dry_run: true, records: records.length, output, approval_action: action }, stdout);
      } else {
        const rendered = renderMemoryCore(records);
        printJson({
          dry_run: true,
          records: records.length,
          output,
          files: Object.keys(rendered).sort(),
          approval_action: action,
        }, stdout);
      }
      return 0;
    }
    const state = await requireApproval(options, action);
    let files;
    if (command === "normalize") await writeJsonl(records, output);
    else files = await writeMemoryCore(records, output);
    await state.completeStep(command, { output, records: records.length, ...(files ? { files } : {}) });
    printJson({ written: output, records: records.length, run_id: state.runId, ...(files ? { files } : {}) }, stdout);
    return 0;
  } catch (error) {
    stderr.write(`error: ${error.message}\n`);
    return 2;
  }
}
