# Yoga NAPI Progress

## Project Goal
Create a NAPI module for Yoga layout engine that can be used from Bun, with the same API as `yoga-layout`.

## Technology Stack
- **Zig 0.15** - Build system and native code
- **napigen** - NAPI bindings generator for Zig
- **yoga-zig** - Zig bindings for Facebook's Yoga layout engine
- **Bun** - JavaScript runtime for testing

## Part 1 - Setup (COMPLETED)

### Completed Tasks
1. Created basic Zig project structure with `build.zig` and `build.zig.zon`
2. Added napigen dependency for NAPI exports
3. Added yoga-zig dependency for Yoga layout functionality
4. Created simple test in Zig to verify yoga works
5. Exposed basic yoga functions via NAPI
6. Wrote Bun test to verify NAPI module works

### Key Decisions
- Using `yoga-zig` as dependency rather than compiling yoga C++ directly
- Separated code into `main.zig` (NAPI exports) and `yoga_wrapper.zig` (testable code)
- Using opaque pointers (`?*anyopaque`) to pass yoga node handles between JS and Zig

## Part 2 - Full API Implementation (COMPLETED)

### Implemented Functions

#### Node Creation/Destruction
- `nodeCreate()` - Create a new yoga node
- `nodeFree(node)` - Free a yoga node
- `nodeFreeRecursive(node)` - Free node and all children
- `nodeReset(node)` - Reset node to default state

#### Child Management
- `nodeInsertChild(parent, child, index)` - Insert child node
- `nodeRemoveChild(parent, child)` - Remove child node
- `nodeGetChild(node, index)` - Get child at index
- `nodeGetChildCount(node)` - Get number of children
- `nodeGetParent(node)` - Get parent node

#### Layout Calculation
- `nodeCalculateLayout(node, width, height, direction)` - Calculate layout

#### Computed Layout Getters
- `nodeGetComputedLayout(node)` - Get computed layout object
- `nodeGetComputedWidth/Height/Left/Top/Right/Bottom(node)`
- `nodeGetComputedBorder/Margin/Padding(node, edge)`

#### Dirty State
- `nodeIsDirty(node)` - Check if node needs layout
- `nodeMarkDirty(node)` - Mark node as dirty
- `nodeIsReferenceBaseline(node)` - Check reference baseline

#### Style Setters
- Direction: `setDirection`, `setFlexDirection`
- Alignment: `setJustifyContent`, `setAlignContent`, `setAlignItems`, `setAlignSelf`
- Positioning: `setPositionType`, `setPosition`, `setPositionPercent`, `setPositionAuto`
- Flex: `setFlex`, `setFlexGrow`, `setFlexShrink`, `setFlexWrap`
- Flex Basis: `setFlexBasisPercent`, `setFlexBasisAuto`
- Dimensions: `setWidth/Height`, `setWidth/HeightPercent`, `setWidth/HeightAuto`
- Min/Max: `setMin/MaxWidth/Height`, `setMin/MaxWidth/HeightPercent`
- Spacing: `setMargin`, `setMarginPercent`, `setMarginAuto`, `setPadding`, `setPaddingPercent`, `setBorder`
- Other: `setOverflow`, `setDisplay`, `setAspectRatio`, `setGap`, `setGapPercent`, `setBoxSizing`, `setAlwaysFormsContainingBlock`

#### Style Getters
- `nodeGetFlexGrow/Shrink(node)`
- `nodeGetAspectRatio(node)`
- `nodeGetBorder(node, edge)`

#### Implemented Constants
- Direction: `DIRECTION_INHERIT`, `DIRECTION_LTR`, `DIRECTION_RTL`
- FlexDirection: `FLEX_DIRECTION_COLUMN`, `_COLUMN_REVERSE`, `_ROW`, `_ROW_REVERSE`
- Justify: `JUSTIFY_FLEX_START`, `_CENTER`, `_FLEX_END`, `_SPACE_BETWEEN`, `_SPACE_AROUND`, `_SPACE_EVENLY`
- Align: `ALIGN_AUTO`, `_FLEX_START`, `_CENTER`, `_FLEX_END`, `_STRETCH`, `_BASELINE`, `_SPACE_BETWEEN`, `_SPACE_AROUND`, `_SPACE_EVENLY`
- Edge: `EDGE_LEFT`, `_TOP`, `_RIGHT`, `_BOTTOM`, `_START`, `_END`, `_HORIZONTAL`, `_VERTICAL`, `_ALL`
- PositionType: `POSITION_TYPE_STATIC`, `_RELATIVE`, `_ABSOLUTE`
- Wrap: `WRAP_NO_WRAP`, `_WRAP`, `_WRAP_REVERSE`
- Overflow: `OVERFLOW_VISIBLE`, `_HIDDEN`, `_SCROLL`
- Display: `DISPLAY_FLEX`, `_NONE`
- Unit: `UNIT_UNDEFINED`, `_POINT`, `_PERCENT`, `_AUTO`
- Gutter: `GUTTER_COLUMN`, `_ROW`, `_ALL`
- BoxSizing: `BOX_SIZING_BORDER_BOX`, `_CONTENT_BOX`
- MeasureMode: `MEASURE_MODE_UNDEFINED`, `_EXACTLY`, `_AT_MOST`

### Not Implemented (yoga-zig limitations)
- Config API (broken in yoga-zig)
- Some style getters (return Value structs that don't map cleanly)
- Measure/Dirtied callbacks

## Part 3 - Benchmarking NAPI vs FFI (COMPLETED)

### What was done
1. Created `bench.ts` - comprehensive benchmark script
2. Created `src/yoga_ffi.zig` - C ABI export library for Bun FFI
3. Updated `build.zig` to build both NAPI and FFI libraries
4. Added FFI bindings using `bun:ffi`

### Output Files
- `zig-out/lib/yoga_napi.node` - NAPI module (Node.js/Bun require)
- `zig-out/lib/libyoga_napi.dylib` - NAPI dynamic library
- `zig-out/lib/libyoga_ffi.dylib` - FFI dynamic library (C ABI)

### Benchmark Results

**Test Setup:**
- Column layouts with 10, 100, 500, 1000 boxes
- Nested layouts with various depths (3x3, 4x3, 5x2, 4x4)

**Results Summary:**
```
Column benchmark:
  10 boxes:   FFI 1.16x faster
  100 boxes:  FFI 1.06x faster
  500 boxes:  FFI 1.06x faster
  1000 boxes: FFI 1.06x faster

Nested benchmark:
  3x3 (27 nodes):  FFI 1.03x faster
  4x3 (81 nodes):  FFI 1.02x faster
  5x2 (32 nodes):  FFI 1.04x faster
  4x4 (256 nodes): FFI 1.02x faster

Overall: FFI is ~5% faster on average
```

### Analysis
- **FFI is slightly faster** (~5% on average) due to less overhead per call
- The difference is more pronounced with smaller workloads (16% faster for 10 boxes)
- For larger workloads, the actual yoga computation dominates, making the call overhead less significant
- **Recommendation**: Use FFI for maximum performance, NAPI for better ergonomics

### API Comparison

**NAPI (require):**
```typescript
const yoga = require("./zig-out/lib/yoga_napi.node");
const node = yoga.nodeCreate();
yoga.nodeSetWidth(node, 100);
```

**FFI (dlopen):**
```typescript
import { dlopen, FFIType, suffix } from "bun:ffi";
const lib = dlopen(`./zig-out/lib/libyoga_ffi.${suffix}`, { ... });
const node = lib.symbols.yg_node_create();
lib.symbols.yg_node_set_width(node, 100);
```

## Build Commands
```bash
# Build both libraries
zig build

# Run Zig tests
zig build test

# Run Bun tests
bun test

# Run benchmark
bun bench.ts
```

## Files

### Source Files
- `src/main.zig` - NAPI module exports
- `src/yoga_wrapper.zig` - Shared yoga wrapper functions (testable)
- `src/yoga_ffi.zig` - FFI C ABI exports

### Build Files
- `build.zig` - Build configuration
- `build.zig.zon` - Dependencies (napigen, yoga-zig)

### Test/Bench Files
- `yoga.test.ts` - Bun tests for NAPI module
- `bench.ts` - NAPI vs FFI benchmark
