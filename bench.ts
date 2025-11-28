/**
 * Yoga NAPI vs FFI Benchmark
 * 
 * Tests layout performance with flex columns containing many boxes.
 * Compares NAPI vs FFI implementations.
 */

import { dlopen, FFIType, ptr, suffix } from "bun:ffi";

// @ts-ignore - NAPI module
const yoga = require("./zig-out/lib/yoga_napi.node");

// ============================================================================
// FFI Setup
// ============================================================================

const libPath = `./zig-out/lib/libyoga_ffi.${suffix}`;

const ffi = dlopen(libPath, {
  // Node creation/destruction
  yg_node_create: { returns: FFIType.ptr },
  yg_node_free: { args: [FFIType.ptr], returns: FFIType.void },
  yg_node_free_recursive: { args: [FFIType.ptr], returns: FFIType.void },
  yg_node_reset: { args: [FFIType.ptr], returns: FFIType.void },

  // Child management
  yg_node_insert_child: { args: [FFIType.ptr, FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_remove_child: { args: [FFIType.ptr, FFIType.ptr], returns: FFIType.void },
  yg_node_get_child_count: { args: [FFIType.ptr], returns: FFIType.u32 },
  yg_node_get_child: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.ptr },
  yg_node_get_parent: { args: [FFIType.ptr], returns: FFIType.ptr },

  // Layout calculation
  yg_node_calculate_layout: { args: [FFIType.ptr, FFIType.f32, FFIType.f32, FFIType.u32], returns: FFIType.void },

  // Computed layout getters
  yg_node_get_computed_width: { args: [FFIType.ptr], returns: FFIType.f32 },
  yg_node_get_computed_height: { args: [FFIType.ptr], returns: FFIType.f32 },
  yg_node_get_computed_left: { args: [FFIType.ptr], returns: FFIType.f32 },
  yg_node_get_computed_top: { args: [FFIType.ptr], returns: FFIType.f32 },
  yg_node_get_computed_right: { args: [FFIType.ptr], returns: FFIType.f32 },
  yg_node_get_computed_bottom: { args: [FFIType.ptr], returns: FFIType.f32 },
  yg_node_get_computed_border: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.f32 },
  yg_node_get_computed_margin: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.f32 },
  yg_node_get_computed_padding: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.f32 },

  // Dirty state
  yg_node_is_dirty: { args: [FFIType.ptr], returns: FFIType.bool },
  yg_node_mark_dirty: { args: [FFIType.ptr], returns: FFIType.void },

  // Style setters
  yg_node_set_direction: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_flex_direction: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_justify_content: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_align_content: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_align_items: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_align_self: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_position_type: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_flex_wrap: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_overflow: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_display: { args: [FFIType.ptr, FFIType.u32], returns: FFIType.void },
  yg_node_set_flex: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_flex_grow: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_flex_shrink: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_width: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_height: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_min_width: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_min_height: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_max_width: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_max_height: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_aspect_ratio: { args: [FFIType.ptr, FFIType.f32], returns: FFIType.void },
  yg_node_set_margin: { args: [FFIType.ptr, FFIType.u32, FFIType.f32], returns: FFIType.void },
  yg_node_set_padding: { args: [FFIType.ptr, FFIType.u32, FFIType.f32], returns: FFIType.void },
  yg_node_set_border: { args: [FFIType.ptr, FFIType.u32, FFIType.f32], returns: FFIType.void },
  yg_node_set_position: { args: [FFIType.ptr, FFIType.u32, FFIType.f32], returns: FFIType.void },
  yg_node_set_gap: { args: [FFIType.ptr, FFIType.u32, FFIType.f32], returns: FFIType.void },
});

const yogaFFI = ffi.symbols;

// ============================================================================
// Constants (same for both)
// ============================================================================

const DIRECTION_LTR = 1;
const FLEX_DIRECTION_COLUMN = 0;
const FLEX_DIRECTION_ROW = 2;
const JUSTIFY_FLEX_START = 0;
const ALIGN_STRETCH = 4;
const EDGE_ALL = 8;

// ============================================================================
// Benchmark Utils
// ============================================================================

interface BenchResult {
  name: string;
  iterations: number;
  totalMs: number;
  avgMs: number;
  opsPerSec: number;
}

function runBenchmark(
  name: string,
  fn: () => void,
  iterations: number = 1000
): BenchResult {
  // Warmup
  for (let i = 0; i < 10; i++) {
    fn();
  }

  // Actual benchmark
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();

  const totalMs = end - start;
  const avgMs = totalMs / iterations;
  const opsPerSec = 1000 / avgMs;

  return { name, iterations, totalMs, avgMs, opsPerSec };
}

function printResult(result: BenchResult) {
  console.log(`\n${result.name}`);
  console.log(`  Iterations: ${result.iterations}`);
  console.log(`  Total time: ${result.totalMs.toFixed(2)}ms`);
  console.log(`  Avg per op: ${result.avgMs.toFixed(4)}ms`);
  console.log(`  Ops/sec:    ${result.opsPerSec.toFixed(2)}`);
}

function printComparison(napiResult: BenchResult, ffiResult: BenchResult) {
  const speedup = napiResult.avgMs / ffiResult.avgMs;
  const faster = speedup > 1 ? "FFI" : "NAPI";
  const ratio = speedup > 1 ? speedup : 1 / speedup;
  console.log(`  --> ${faster} is ${ratio.toFixed(2)}x faster`);
}

// ============================================================================
// NAPI Benchmarks
// ============================================================================

function createFlexColumnWithBoxes_NAPI(numBoxes: number): void {
  const root = yoga.nodeCreate();
  yoga.nodeSetFlexDirection(root, FLEX_DIRECTION_COLUMN);
  yoga.nodeSetWidth(root, 1000);
  yoga.nodeSetHeight(root, 1000);
  yoga.nodeSetJustifyContent(root, JUSTIFY_FLEX_START);
  yoga.nodeSetAlignItems(root, ALIGN_STRETCH);
  yoga.nodeSetPadding(root, EDGE_ALL, 10);

  const children: any[] = [];
  for (let i = 0; i < numBoxes; i++) {
    const child = yoga.nodeCreate();
    yoga.nodeSetHeight(child, 50);
    yoga.nodeSetMargin(child, EDGE_ALL, 5);
    yoga.nodeSetPadding(child, EDGE_ALL, 10);
    yoga.nodeInsertChild(root, child, i);
    children.push(child);
  }

  yoga.nodeCalculateLayout(root, 1000, 1000, DIRECTION_LTR);

  for (const child of children) {
    yoga.nodeGetComputedLeft(child);
    yoga.nodeGetComputedTop(child);
    yoga.nodeGetComputedWidth(child);
    yoga.nodeGetComputedHeight(child);
  }

  yoga.nodeFreeRecursive(root);
}

function createNestedFlexLayout_NAPI(depth: number, childrenPerLevel: number): void {
  const createLevel = (level: number): any => {
    const node = yoga.nodeCreate();
    yoga.nodeSetFlexDirection(node, level % 2 === 0 ? FLEX_DIRECTION_COLUMN : FLEX_DIRECTION_ROW);
    yoga.nodeSetFlexGrow(node, 1);
    yoga.nodeSetPadding(node, EDGE_ALL, 5);

    if (level < depth) {
      for (let i = 0; i < childrenPerLevel; i++) {
        const child = createLevel(level + 1);
        yoga.nodeInsertChild(node, child, i);
      }
    } else {
      yoga.nodeSetWidth(node, 50);
      yoga.nodeSetHeight(node, 50);
    }

    return node;
  };

  const root = createLevel(0);
  yoga.nodeSetWidth(root, 1000);
  yoga.nodeSetHeight(root, 1000);

  yoga.nodeCalculateLayout(root, 1000, 1000, DIRECTION_LTR);
  yoga.nodeFreeRecursive(root);
}

// ============================================================================
// FFI Benchmarks
// ============================================================================

function createFlexColumnWithBoxes_FFI(numBoxes: number): void {
  const root = yogaFFI.yg_node_create();
  yogaFFI.yg_node_set_flex_direction(root, FLEX_DIRECTION_COLUMN);
  yogaFFI.yg_node_set_width(root, 1000);
  yogaFFI.yg_node_set_height(root, 1000);
  yogaFFI.yg_node_set_justify_content(root, JUSTIFY_FLEX_START);
  yogaFFI.yg_node_set_align_items(root, ALIGN_STRETCH);
  yogaFFI.yg_node_set_padding(root, EDGE_ALL, 10);

  const children: any[] = [];
  for (let i = 0; i < numBoxes; i++) {
    const child = yogaFFI.yg_node_create();
    yogaFFI.yg_node_set_height(child, 50);
    yogaFFI.yg_node_set_margin(child, EDGE_ALL, 5);
    yogaFFI.yg_node_set_padding(child, EDGE_ALL, 10);
    yogaFFI.yg_node_insert_child(root, child, i);
    children.push(child);
  }

  yogaFFI.yg_node_calculate_layout(root, 1000, 1000, DIRECTION_LTR);

  for (const child of children) {
    yogaFFI.yg_node_get_computed_left(child);
    yogaFFI.yg_node_get_computed_top(child);
    yogaFFI.yg_node_get_computed_width(child);
    yogaFFI.yg_node_get_computed_height(child);
  }

  yogaFFI.yg_node_free_recursive(root);
}

function createNestedFlexLayout_FFI(depth: number, childrenPerLevel: number): void {
  const createLevel = (level: number): any => {
    const node = yogaFFI.yg_node_create();
    yogaFFI.yg_node_set_flex_direction(node, level % 2 === 0 ? FLEX_DIRECTION_COLUMN : FLEX_DIRECTION_ROW);
    yogaFFI.yg_node_set_flex_grow(node, 1);
    yogaFFI.yg_node_set_padding(node, EDGE_ALL, 5);

    if (level < depth) {
      for (let i = 0; i < childrenPerLevel; i++) {
        const child = createLevel(level + 1);
        yogaFFI.yg_node_insert_child(node, child, i);
      }
    } else {
      yogaFFI.yg_node_set_width(node, 50);
      yogaFFI.yg_node_set_height(node, 50);
    }

    return node;
  };

  const root = createLevel(0);
  yogaFFI.yg_node_set_width(root, 1000);
  yogaFFI.yg_node_set_height(root, 1000);

  yogaFFI.yg_node_calculate_layout(root, 1000, 1000, DIRECTION_LTR);
  yogaFFI.yg_node_free_recursive(root);
}

// ============================================================================
// Main
// ============================================================================

console.log("=".repeat(70));
console.log("Yoga NAPI vs FFI Benchmark");
console.log("=".repeat(70));

// Benchmark 1: Simple column with many boxes
console.log("\n" + "-".repeat(70));
console.log("Benchmark 1: Column with N boxes");
console.log("-".repeat(70));

const boxCounts = [10, 100, 500, 1000];
const columnResults: { napi: BenchResult; ffi: BenchResult }[] = [];

for (const count of boxCounts) {
  const iterations = count > 100 ? 100 : 500;
  
  const napiResult = runBenchmark(
    `NAPI: Column with ${count} boxes`,
    () => createFlexColumnWithBoxes_NAPI(count),
    iterations
  );
  
  const ffiResult = runBenchmark(
    `FFI:  Column with ${count} boxes`,
    () => createFlexColumnWithBoxes_FFI(count),
    iterations
  );
  
  printResult(napiResult);
  printResult(ffiResult);
  printComparison(napiResult, ffiResult);
  
  columnResults.push({ napi: napiResult, ffi: ffiResult });
}

// Benchmark 2: Nested layout
console.log("\n" + "-".repeat(70));
console.log("Benchmark 2: Nested layout");
console.log("-".repeat(70));

const nestedConfigs = [
  { depth: 3, children: 3 },  // 3^3 = 27 leaf nodes
  { depth: 4, children: 3 },  // 3^4 = 81 leaf nodes
  { depth: 5, children: 2 },  // 2^5 = 32 leaf nodes
  { depth: 4, children: 4 },  // 4^4 = 256 leaf nodes
];

const nestedResults: { napi: BenchResult; ffi: BenchResult }[] = [];

for (const config of nestedConfigs) {
  const totalNodes = Math.pow(config.children, config.depth);
  const iterations = totalNodes > 100 ? 100 : 500;
  
  const napiResult = runBenchmark(
    `NAPI: Nested ${config.depth}x${config.children} (${totalNodes} leaf nodes)`,
    () => createNestedFlexLayout_NAPI(config.depth, config.children),
    iterations
  );
  
  const ffiResult = runBenchmark(
    `FFI:  Nested ${config.depth}x${config.children} (${totalNodes} leaf nodes)`,
    () => createNestedFlexLayout_FFI(config.depth, config.children),
    iterations
  );
  
  printResult(napiResult);
  printResult(ffiResult);
  printComparison(napiResult, ffiResult);
  
  nestedResults.push({ napi: napiResult, ffi: ffiResult });
}

// Summary
console.log("\n" + "=".repeat(70));
console.log("SUMMARY");
console.log("=".repeat(70));

console.log("\nColumn benchmark average speedup:");
let totalSpeedup = 0;
for (let i = 0; i < columnResults.length; i++) {
  const speedup = columnResults[i].napi.avgMs / columnResults[i].ffi.avgMs;
  const faster = speedup > 1 ? "FFI" : "NAPI";
  const ratio = speedup > 1 ? speedup : 1 / speedup;
  console.log(`  ${boxCounts[i]} boxes: ${faster} ${ratio.toFixed(2)}x faster`);
  totalSpeedup += speedup;
}

console.log("\nNested benchmark average speedup:");
for (let i = 0; i < nestedResults.length; i++) {
  const speedup = nestedResults[i].napi.avgMs / nestedResults[i].ffi.avgMs;
  const faster = speedup > 1 ? "FFI" : "NAPI";
  const ratio = speedup > 1 ? speedup : 1 / speedup;
  const config = nestedConfigs[i];
  console.log(`  ${config.depth}x${config.children}: ${faster} ${ratio.toFixed(2)}x faster`);
  totalSpeedup += speedup;
}

const avgSpeedup = totalSpeedup / (columnResults.length + nestedResults.length);
const overallFaster = avgSpeedup > 1 ? "FFI" : "NAPI";
const overallRatio = avgSpeedup > 1 ? avgSpeedup : 1 / avgSpeedup;
console.log(`\nOverall: ${overallFaster} is ${overallRatio.toFixed(2)}x faster on average`);

console.log("\n" + "=".repeat(70));
console.log("Benchmark complete");
console.log("=".repeat(70));
