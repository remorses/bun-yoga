## Goal

Create a Bun FFI wrapper for Facebook's Yoga layout engine, providing a yoga-layout compatible API.

**Why FFI over NAPI?** Benchmarks showed FFI is faster than NAPI for this use case.

## Project Structure

```
bun-yoga/
├── src/
│   ├── yoga_ffi.zig   # Zig FFI exports (C ABI)
│   └── index.ts       # TypeScript FFI bindings + Node/Config classes
├── build.zig          # Zig build configuration
├── build.zig.zon      # Dependencies (yoga from Facebook)
├── bench.ts           # Benchmark vs yoga-layout
├── package.json
└── tsconfig.json
```

## How It Works

1. **Zig layer** (`yoga_ffi.zig`): Uses `@cImport` to import Yoga C headers directly, exports functions with C ABI using `export fn`
2. **TypeScript layer** (`src/index.ts`): Uses `bun:ffi` to load the dynamic library and provides yoga-layout compatible `Node` and `Config` classes

## Build Commands

```bash
# Build the library
zig build                      # Debug build
zig build -Doptimize=ReleaseFast  # Release build

# Run tests
zig build test                 # Zig tests
bun test                       # TypeScript tests

# Run benchmark
bun run bench.ts
```

## API

The API mirrors yoga-layout:

```typescript
import Yoga, { Node, Config, Edge, FlexDirection } from "bun-yoga";

const config = Config.create();
const root = Node.create(config);

root.setFlexDirection(FlexDirection.Column);
root.setWidth(100);
root.setHeight(100);

const child = Node.create(config);
child.setFlexGrow(1);
root.insertChild(child, 0);

root.calculateLayout(100, 100);
console.log(root.getComputedLayout());

root.freeRecursive();
config.free();
```

## Dependencies

- **Zig 0.15+** - Build system and native code
- **Facebook Yoga** - Layout engine (fetched via build.zig.zon)
- **Bun** - JavaScript runtime with FFI support

## Progress Tracking

See `progress.md` for detailed progress and decisions.


## reading github files

do `curl gitchamber.com` to read list, read, search github files
