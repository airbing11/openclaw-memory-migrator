#!/usr/bin/env node

import { main } from "../lib/cli.js";

const major = Number(process.versions.node.split(".", 1)[0]);
if (major < 22) {
  process.stderr.write("error: openclaw-memory-migrator requires Node.js >=22\n");
  process.exitCode = 2;
} else {
  process.exitCode = await main();
}
