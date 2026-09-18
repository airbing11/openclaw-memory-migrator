import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const temporary = await mkdtemp(join(tmpdir(), "openclaw-migrator-package-"));

async function javascriptFiles(path) {
  const result = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) result.push(...await javascriptFiles(child));
    else if (entry.isFile() && entry.name.endsWith(".js")) result.push(child);
  }
  return result;
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

try {
  const npmArguments = ["pack", "--json", "--pack-destination", temporary];
  const npmExecutable = process.env.npm_execpath ? process.execPath : "npm";
  const packed = JSON.parse(execFileSync(
    npmExecutable,
    process.env.npm_execpath ? [process.env.npm_execpath, ...npmArguments] : npmArguments,
    { cwd: root, encoding: "utf8" },
  ));
  if (!Array.isArray(packed) || packed.length !== 1 || !packed[0].filename) {
    throw new Error("npm pack did not return exactly one package");
  }

  const archive = join(temporary, basename(packed[0].filename));
  const extracted = join(temporary, "extracted");
  await mkdir(extracted);
  execFileSync("tar", ["-xf", archive, "-C", extracted], { cwd: root, stdio: "pipe" });

  const sourceFiles = [
    ...await javascriptFiles(join(root, "bin")),
    ...await javascriptFiles(join(root, "lib")),
  ];
  for (const sourcePath of sourceFiles) {
    const packagePath = join(extracted, "package", relative(root, sourcePath));
    const [source, packaged] = await Promise.all([readFile(sourcePath), readFile(packagePath)]);
    if (digest(source) !== digest(packaged)) {
      throw new Error(`packaged JavaScript differs from repository source: ${relative(root, sourcePath)}`);
    }
    const text = source.toString("utf8");
    if (text.split(/\r?\n/u).length < 3 || text.split(/\r?\n/u).some((line) => line.length > 500)) {
      throw new Error(`JavaScript source is not reviewable: ${relative(root, sourcePath)}`);
    }
  }

  process.stdout.write(`verified ${sourceFiles.length} reviewable JavaScript files against package bytes\n`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
