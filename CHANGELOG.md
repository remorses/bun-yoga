# Changelog

## 0.2.5

### Fixes
- Fixed memory corruption on Linux ("malloc(): unaligned tcache chunk detected") when rapidly freeing and creating nodes with measure functions
- Fixed callback context not being freed before node free, causing use-after-free when Yoga reuses memory
- Changed callback context allocator from Zig's GeneralPurposeAllocator to C allocator for glibc compatibility
- Made thread-local storage variables actually threadlocal to prevent race conditions
- Added context cleanup to `ygNodeFree`, `ygNodeFreeRecursive`, and `ygNodeReset`
- Fixed `freeRecursive()` and `reset()` not cleaning up JSCallback objects, causing memory leaks

### Tests
- Added memory management tests for callback cleanup in `freeRecursive()` and `reset()`
- Added stress tests for rapid free/create cycles with measure functions
- Added tests for interleaved node lifecycle with callbacks

## 0.2.4

- Reduced binary size by stripping debug symbols and using single-threaded mode

## 0.2.3

- Fixed `MeasureFunction` type to use `MeasureMode` instead of `number` for `widthMode` and `heightMode` parameters

## 0.2.2

- Include source files in npm package
- Add `./src` export for direct TypeScript imports

## 0.2.1

### Breaking Changes
- `DirtiedFunction` signature changed to match yoga-layout: `(node: Node) => void` instead of `() => void`

### New Features
- **Value getter methods**: Added all Value getters that return `{unit, value}` like yoga-layout:
  - `getWidth()`, `getHeight()`, `getMinWidth()`, `getMinHeight()`, `getMaxWidth()`, `getMaxHeight()`
  - `getMargin(edge)`, `getPadding(edge)`, `getPosition(edge)`, `getGap(gutter)`
  - `getFlexBasis()`

### Fixes
- **Enum getter return types**: All enum getters now return proper enum types instead of `number`:
  - `getDirection()` returns `Direction` (was `number`)
  - `getFlexDirection()` returns `FlexDirection` (was `number`)
  - `getJustifyContent()` returns `Justify` (was `number`)
  - `getAlignContent()`, `getAlignItems()`, `getAlignSelf()` return `Align` (was `number`)
  - `getPositionType()` returns `PositionType` (was `number`)
  - `getFlexWrap()` returns `Wrap` (was `number`)
  - `getOverflow()` returns `Overflow` (was `number`)
  - `getDisplay()` returns `Display` (was `number`)
- **Setter parameter types**: All enum setters now accept proper enum types instead of `number`

### Internal
- Added Zig packed value helper functions for FFI struct returns
- Added comprehensive tests for Value getters and DirtiedFunction
- Source files now included in npm package with `bun` export condition

## 0.2.0

### Breaking Changes
- Method signatures updated to match yoga-layout exactly (accepts `undefined`)

### New Features
- **Type exports**: All enums now export corresponding TypeScript types (e.g., `Align` works as both value and type)
- **String value support**: Methods now accept percent strings (`"50%"`) and `"auto"` like yoga-layout:
  - `setWidth`, `setHeight`: accept `number | "auto" | \`${number}%\` | undefined`
  - `setMinWidth`, `setMinHeight`, `setMaxWidth`, `setMaxHeight`: accept `number | \`${number}%\` | undefined`
  - `setMargin`: accepts `number | "auto" | \`${number}%\` | undefined`
  - `setPadding`: accepts `number | \`${number}%\` | undefined`
  - `setGap`: accepts `number | \`${number}%\` | undefined`
  - `setPosition`: accepts `number | \`${number}%\` | undefined`
  - `setFlexBasis`: accepts `number | "auto" | \`${number}%\` | undefined`

### New Methods
- `Node.copyStyle(node)`: Copy style from another node
- `Node.setBoxSizing(boxSizing)` / `Node.getBoxSizing()`: Box sizing support
- `Node.setIsReferenceBaseline(isReferenceBaseline)` / `Node.isReferenceBaseline()`: Reference baseline support
- `Node.setAlwaysFormsContainingBlock(alwaysFormsContainingBlock)`: Containing block support
- `Config.setErrata(errata)` / `Config.getErrata()`: Errata configuration
- `Config.setExperimentalFeatureEnabled(feature, enabled)` / `Config.isExperimentalFeatureEnabled(feature)`: Experimental features

### Internal
- Added `Value` type for yoga-layout compatibility
- Added comprehensive tests for string value parsing

## 0.1.3

- Fixed Windows CI: prepare DLL path before running tests
- Fixed publish workflow: explicitly build TypeScript before publishing

## 0.1.2

- Added Windows x64 support
- Added Bun tests to CI for all platforms (Linux, macOS, Windows)

## 0.1.1

- Fixed ARM64 ABI compatibility for callback functions (`setMeasureFunc`, `setBaselineFunc`)
- Implemented trampoline pattern for measure/baseline callbacks to work around Bun FFI limitations on ARM64
- Added `setDirtiedFunc` callback support
- Added callback context management to support multiple callbacks per node
- Fixed tests to account for Yoga's default flex stretch behavior
- Added baseline function test

## 0.1.0

- Initial release with yoga-layout compatible API
- Bun FFI wrapper for Facebook's Yoga layout engine
- Core layout functionality (flex, padding, margin, border, gap)
- Node and Config classes
