#!/usr/bin/env bun
/**
 * Test script to verify bun-yoga works correctly when compiled with `bun build --compile`
 * 
 * This reproduces the issue where dlopen fails with $bunfs paths in compiled executables.
 * 
 * Usage: bun run scripts/test-compile.ts
 */

import { spawnSync } from "node:child_process"
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"

const rootDir = join(import.meta.dir, "..")
const testDir = join(tmpdir(), "bun-yoga-compile-test")
const pkgCopy = join(testDir, "bun-yoga")
const appDir = join(testDir, "app")
const execPath = join(testDir, "test-exec")

console.log("=== Testing bun-yoga with bun compile ===\n")

// Clean up previous test
rmSync(testDir, { recursive: true, force: true })
mkdirSync(testDir, { recursive: true })

// Copy bun-yoga to temp (simulates installed package)
console.log("1. Copying bun-yoga to temp directory...")
cpSync(rootDir, pkgCopy, { recursive: true })
// Remove .git to avoid issues
rmSync(join(pkgCopy, ".git"), { recursive: true, force: true })
rmSync(join(pkgCopy, "node_modules"), { recursive: true, force: true })

// Create app that depends on the copied bun-yoga
mkdirSync(appDir, { recursive: true })
writeFileSync(join(appDir, "package.json"), JSON.stringify({
  name: "compile-test",
  dependencies: {
    "bun-yoga": `file:${pkgCopy}`
  }
}, null, 2))

// Create test script
writeFileSync(join(appDir, "test.ts"), `
import { Node } from "bun-yoga/src";

const node = Node.create();
node.setWidth(100);
node.setHeight(100);
node.calculateLayout();

const layout = node.getComputedLayout();
if (layout.width !== 100 || layout.height !== 100) {
  console.error("Layout incorrect:", layout);
  process.exit(1);
}

node.free();
console.log("Success! Layout:", layout);
`)

// Install dependencies
console.log("2. Installing dependencies...")
const install = spawnSync("bun", ["install"], { cwd: appDir, stdio: "inherit" })
if (install.status !== 0) {
  console.error("Failed to install dependencies")
  process.exit(1)
}

// Compile (must run from appDir so it finds node_modules)
console.log("\n3. Compiling test script...")
const compile = spawnSync("bun", ["build", "--compile", "./test.ts", "--outfile", execPath], {
  cwd: appDir,
  stdio: "inherit"
})
if (compile.status !== 0) {
  console.error("Failed to compile")
  process.exit(1)
}

// Delete source files to simulate deployment on another machine
// Keep appDir so user can experiment with fixes
console.log("\n4. Removing source files (simulating deployment)...")
rmSync(pkgCopy, { recursive: true, force: true })
rmSync(join(appDir, "node_modules"), { recursive: true, force: true })

// Run the standalone executable (should work without any source files)
console.log("\n5. Running compiled executable...")
const run = spawnSync(execPath, [], { stdio: "pipe" })

if (run.status !== 0) {
  console.error("FAILED: Executable failed without source files")
  console.error("stderr:", run.stderr?.toString())
  console.error("\nThis is the bug - the compiled executable cannot find the native library")
  console.error("when the original source files are not present.")
  console.log("\nTest directory kept for debugging:", testDir)
  process.exit(1)
} else {
  console.log(run.stdout?.toString())
  console.log("PASSED: Executable works without source files!")
  console.log("\nTest directory kept at:", testDir)
}

console.log("\n=== Done ===")
