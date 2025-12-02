# Bun-Yoga Progress

## Project Goal
Create a Bun FFI wrapper for Facebook's Yoga layout engine with a yoga-layout compatible API.

## Technology Stack
- **Zig 0.15** - Build system and native code
- **Facebook Yoga** - Layout engine (direct dependency via build.zig.zon)
- **Bun FFI** - JavaScript to native bridge
- **TypeScript** - API layer

## Completed

### Part 1 & 2 - Initial Setup (NAPI approach)
- Created initial project structure
- Tried using yoga-zig wrapper (had limitations)
- Implemented basic NAPI bindings with napigen

### Part 3 - FFI vs NAPI Benchmark
- Created FFI version alongside NAPI
- Benchmarked both approaches
- **Result: FFI was ~5% faster on average**
- **Decision: Switch to pure FFI approach**

### Part 4 - Pure FFI Implementation (CURRENT)
- Removed NAPI code and napigen dependency
- Added Facebook Yoga directly as dependency (like yoga-zig does)
- Created complete FFI bindings using @cImport
- Created TypeScript API layer with Node and Config classes
- Updated benchmark to compare with yoga-layout (WASM)

## Files

### Source Files
- `src/yoga_ffi.zig` - Zig FFI exports with C ABI
- `src/index.ts` - TypeScript FFI bindings and API

### Build Files
- `build.zig` - Build configuration (compiles Yoga C++ directly)
- `build.zig.zon` - Dependencies (Facebook Yoga)

### Config Files
- `package.json` - npm package config
- `tsconfig.json` - TypeScript config

### Test/Bench Files
- `bench.ts` - Benchmark comparing FFI vs yoga-layout (WASM)

## API Implementation

### Config
- [x] `Config.create()`
- [x] `Config.free()`
- [x] `setUseWebDefaults()` / `useWebDefaults()`
- [x] `setPointScaleFactor()` / `getPointScaleFactor()`

### Node Creation/Destruction
- [x] `Node.create()` / `Node.createWithConfig()`
- [x] `free()` / `freeRecursive()`
- [x] `reset()` / `clone()`

### Child Management
- [x] `insertChild()` / `removeChild()` / `removeAllChildren()`
- [x] `getChild()` / `getChildCount()` / `getParent()`

### Layout
- [x] `calculateLayout()`
- [x] `hasNewLayout()` / `markLayoutSeen()`
- [x] `markDirty()` / `isDirty()`

### Computed Layout
- [x] `getComputedLayout()`
- [x] `getComputedLeft/Top/Right/Bottom/Width/Height()`
- [x] `getComputedBorder/Margin/Padding()`

### Style Setters
- [x] `setDirection()` / `setFlexDirection()`
- [x] `setJustifyContent()` / `setAlignContent()` / `setAlignItems()` / `setAlignSelf()`
- [x] `setPositionType()` / `setFlexWrap()` / `setOverflow()` / `setDisplay()`
- [x] `setFlex()` / `getFlex()` / `setFlexGrow()` / `setFlexShrink()`
- [x] `setFlexBasis()` / `setFlexBasisPercent()` / `setFlexBasisAuto()`
- [x] `setPosition()` / `setPositionPercent()` / `setPositionAuto()`
- [x] `setMargin()` / `setMarginPercent()` / `setMarginAuto()`
- [x] `setPadding()` / `setPaddingPercent()`
- [x] `setBorder()` / `getBorder()`
- [x] `setGap()` / `setGapPercent()`
- [x] `setWidth/Height()` + Percent/Auto variants
- [x] `setMin/MaxWidth/Height()` + Percent variants
- [x] `setAspectRatio()` / `getAspectRatio()`

### Style Getters
- [x] `getDirection()` / `getFlexDirection()`
- [x] `getJustifyContent()` / `getAlignContent()` / `getAlignItems()` / `getAlignSelf()`
- [x] `getPositionType()` / `getFlexWrap()` / `getOverflow()` / `getDisplay()`
- [x] `getFlexGrow()` / `getFlexShrink()`

### Enums/Constants
- [x] All Direction, FlexDirection, Justify, Align values
- [x] All Edge, Wrap, Overflow, Display, PositionType values
- [x] All Gutter, Unit, MeasureMode values

## Not Implemented (Complex/Low Priority)
- [ ] `setMeasureFunc()` - Requires JSCallback for native-to-JS calls
- [ ] `setBaselineFunc()` - Requires JSCallback for native-to-JS calls  
- [ ] `setDirtiedFunc()` - Requires JSCallback for native-to-JS calls
- [ ] Style value getters returning YGValue (would need struct handling)

## OpenTUI Compatibility Analysis

Analyzed [sst/opentui](https://github.com/sst/opentui) to check compatibility with this package.

### Methods OpenTUI Uses (All Implemented ✅)

**Config:**
- `Config.create()` ✅
- `config.setUseWebDefaults()` ✅
- `config.setPointScaleFactor()` ✅

**Node Creation/Destruction:**
- `Node.create(config)` ✅
- `node.free()` ✅

**Child Management:**
- `insertChild()` ✅
- `removeChild()` ✅

**Layout:**
- `calculateLayout()` ✅
- `markDirty()` ✅
- `isDirty()` ✅
- `getComputedLayout()` ✅

**Style Setters (all implemented):**
- `setDisplay()` ✅
- `setFlexDirection()` ✅
- `setFlexWrap()` ✅
- `setFlexGrow()` ✅
- `setFlexShrink()` ✅
- `setFlexBasis()` ✅
- `setAlignItems()` ✅
- `setAlignSelf()` ✅
- `setJustifyContent()` ✅
- `setPositionType()` ✅
- `setPosition()` ✅
- `setPositionAuto()` ✅
- `setOverflow()` ✅
- `setWidth()` / `setHeight()` ✅
- `setMinWidth()` / `setMinHeight()` ✅
- `setMaxWidth()` / `setMaxHeight()` ✅
- `setMargin()` ✅
- `setPadding()` ✅
- `setBorder()` ✅
- `setGap()` ✅

**Style Getters:**
- `getFlexDirection()` ✅

### Critical Missing Method ❌

**`setMeasureFunc()`** - Used by OpenTUI's `TextBufferRenderable` and `EditBufferRenderable` for custom text measurement. This is essential for text nodes that need to calculate their intrinsic dimensions.

**How OpenTUI uses it:**
```typescript
// From TextBufferRenderable.ts
const measureFunc = (
  width: number,
  widthMode: MeasureMode,
  height: number,
  heightMode: MeasureMode,
): { width: number; height: number } => {
  // ... measurement logic
  return { width: measuredWidth, height: measuredHeight }
}
this.yogaNode.setMeasureFunc(measureFunc)
```

**Implementation Challenge:**
- Requires native-to-JS callback support in Bun FFI
- Bun FFI supports `JSCallback` but passing it to Yoga's C API requires careful memory management
- The Zig code already exports `ygNodeSetMeasureFunc()` but TypeScript bindings don't expose it

### Compatibility Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Basic layout | ✅ Ready | All style setters/getters work |
| Child management | ✅ Ready | insert/remove children work |
| Layout calculation | ✅ Ready | calculateLayout + getComputedLayout work |
| Text measurement | ❌ Blocked | Needs `setMeasureFunc()` |

**Verdict:** This package can replace `yoga-layout` for OpenTUI's basic layout needs, but **text components (`TextBufferRenderable`, `EditBufferRenderable`, `Text`, `TextNode`) will not work** until `setMeasureFunc()` is implemented.

## Known Issues

### Windows + Bun NAPI Crash

**Status:** Bun bug, not our code

The native module works correctly with **Node.js on Windows** but crashes with **Bun on Windows**. This is a known Bun NAPI issue:

- **Root cause:** Bun's NAPI implementation on Windows has bugs causing segfaults during module initialization
- **Related issue:** [oven-sh/bun#9292](https://github.com/oven-sh/bun/issues/9292)
- **Workaround:** Use Node.js on Windows until Bun fixes this

**CI Verification:**
```
Node.js: Module loaded successfully, all 110 exports available ✅
Bun: panic(main thread): Segmentation fault at address 0x33BBC37D ❌
```

**Affected platforms:**
- Windows + Bun: ❌ Crashes
- Windows + Node.js: ✅ Works
- macOS + Bun/Node: ✅ Works  
- Linux + Bun/Node: ✅ Works

## Build Commands
```bash
zig build                        # Debug build
zig build -Doptimize=ReleaseFast # Release build
zig build test                   # Run Zig tests
bun test                         # Run TypeScript tests
bun run bench.ts                 # Run benchmark
```

## Output
- `zig-out/lib/yoga.node` - NAPI native addon
