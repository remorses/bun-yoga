import { dlopen, suffix, JSCallback, FFIType, type Pointer } from "bun:ffi";
import { join } from "path";
import { existsSync } from "fs";

// Import native libraries with { type: "file" } for bun compile support
// This tells Bun to embed the file and return a real filesystem path
// @ts-ignore
import embeddedLibDarwinArm64 from "../dist/darwin-arm64/libyoga.dylib" with { type: "file" };
// @ts-ignore
import embeddedLibDarwinX64 from "../dist/darwin-x64/libyoga.dylib" with { type: "file" };
// @ts-ignore
import embeddedLibLinuxX64 from "../dist/linux-x64/libyoga.so" with { type: "file" };
// @ts-ignore
import embeddedLibLinuxArm64 from "../dist/linux-arm64/libyoga.so" with { type: "file" };
// @ts-ignore
import embeddedLibWindows from "../dist/windows-x64/yoga.dll" with { type: "file" };

function getEmbeddedLib(): string | undefined {
  if (process.platform === "darwin" && process.arch === "arm64") {
    return embeddedLibDarwinArm64;
  } else if (process.platform === "darwin" && process.arch === "x64") {
    return embeddedLibDarwinX64;
  } else if (process.platform === "linux" && process.arch === "x64") {
    return embeddedLibLinuxX64;
  } else if (process.platform === "linux" && process.arch === "arm64") {
    return embeddedLibLinuxArm64;
  } else if (process.platform === "win32") {
    return embeddedLibWindows;
  }
  return undefined;
}

function getLibPath(): string {
  // Check local development path (zig-out) first for development
  if (process.platform === "win32") {
    if (existsSync(join(__dirname, "..", "zig-out", "lib", `yoga.${suffix}`))) {
      return join(__dirname, "..", "zig-out", "lib", `yoga.${suffix}`);
    }
    if (existsSync(join(__dirname, "..", "zig-out", "bin", `yoga.${suffix}`))) {
      return join(__dirname, "..", "zig-out", "bin", `yoga.${suffix}`);
    }
  } else {
    if (existsSync(join(__dirname, "..", "zig-out", "lib", `libyoga.${suffix}`))) {
      return join(__dirname, "..", "zig-out", "lib", `libyoga.${suffix}`);
    }
  }

  // Check embedded libraries (for bun compile)
  const embedded = getEmbeddedLib();
  if (embedded && existsSync(embedded)) {
    return embedded;
  }

  throw new Error(
    `Could not find native library. ` +
      `Platform: ${process.platform}-${process.arch}\n` +
      `Make sure to run 'zig build' or install the package with binaries.`
  );
}

// Yoga enum definitions
export const Align = {
  Auto: 0,
  FlexStart: 1,
  Center: 2,
  FlexEnd: 3,
  Stretch: 4,
  Baseline: 5,
  SpaceBetween: 6,
  SpaceAround: 7,
  SpaceEvenly: 8,
} as const;
export type Align = (typeof Align)[keyof typeof Align];

export const BoxSizing = {
  BorderBox: 0,
  ContentBox: 1,
} as const;
export type BoxSizing = (typeof BoxSizing)[keyof typeof BoxSizing];

export const Dimension = {
  Width: 0,
  Height: 1,
} as const;
export type Dimension = (typeof Dimension)[keyof typeof Dimension];

export const Direction = {
  Inherit: 0,
  LTR: 1,
  RTL: 2,
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];

export const Display = {
  Flex: 0,
  None: 1,
  Contents: 2,
} as const;
export type Display = (typeof Display)[keyof typeof Display];

export const Edge = {
  Left: 0,
  Top: 1,
  Right: 2,
  Bottom: 3,
  Start: 4,
  End: 5,
  Horizontal: 6,
  Vertical: 7,
  All: 8,
} as const;
export type Edge = (typeof Edge)[keyof typeof Edge];

export const Errata = {
  None: 0,
  StretchFlexBasis: 1,
  AbsolutePositionWithoutInsetsExcludesPadding: 2,
  AbsolutePercentAgainstInnerSize: 4,
  All: 2147483647,
  Classic: 2147483646,
} as const;
export type Errata = (typeof Errata)[keyof typeof Errata];

export const ExperimentalFeature = {
  WebFlexBasis: 0,
} as const;
export type ExperimentalFeature =
  (typeof ExperimentalFeature)[keyof typeof ExperimentalFeature];

export const FlexDirection = {
  Column: 0,
  ColumnReverse: 1,
  Row: 2,
  RowReverse: 3,
} as const;
export type FlexDirection = (typeof FlexDirection)[keyof typeof FlexDirection];

export const Gutter = {
  Column: 0,
  Row: 1,
  All: 2,
} as const;
export type Gutter = (typeof Gutter)[keyof typeof Gutter];

export const Justify = {
  FlexStart: 0,
  Center: 1,
  FlexEnd: 2,
  SpaceBetween: 3,
  SpaceAround: 4,
  SpaceEvenly: 5,
} as const;
export type Justify = (typeof Justify)[keyof typeof Justify];

export const LogLevel = {
  Error: 0,
  Warn: 1,
  Info: 2,
  Debug: 3,
  Verbose: 4,
  Fatal: 5,
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const MeasureMode = {
  Undefined: 0,
  Exactly: 1,
  AtMost: 2,
} as const;
export type MeasureMode = (typeof MeasureMode)[keyof typeof MeasureMode];

export const NodeType = {
  Default: 0,
  Text: 1,
} as const;
export type NodeType = (typeof NodeType)[keyof typeof NodeType];

export const Overflow = {
  Visible: 0,
  Hidden: 1,
  Scroll: 2,
} as const;
export type Overflow = (typeof Overflow)[keyof typeof Overflow];

export const PositionType = {
  Static: 0,
  Relative: 1,
  Absolute: 2,
} as const;
export type PositionType = (typeof PositionType)[keyof typeof PositionType];

export const Unit = {
  Undefined: 0,
  Point: 1,
  Percent: 2,
  Auto: 3,
} as const;
export type Unit = (typeof Unit)[keyof typeof Unit];

export const Wrap = {
  NoWrap: 0,
  Wrap: 1,
  WrapReverse: 2,
} as const;
export type Wrap = (typeof Wrap)[keyof typeof Wrap];

// Constants for yoga-layout compatibility
export const EDGE_LEFT = Edge.Left;
export const EDGE_TOP = Edge.Top;
export const EDGE_RIGHT = Edge.Right;
export const EDGE_BOTTOM = Edge.Bottom;
export const EDGE_START = Edge.Start;
export const EDGE_END = Edge.End;
export const EDGE_HORIZONTAL = Edge.Horizontal;
export const EDGE_VERTICAL = Edge.Vertical;
export const EDGE_ALL = Edge.All;

export const FLEX_DIRECTION_COLUMN = FlexDirection.Column;
export const FLEX_DIRECTION_COLUMN_REVERSE = FlexDirection.ColumnReverse;
export const FLEX_DIRECTION_ROW = FlexDirection.Row;
export const FLEX_DIRECTION_ROW_REVERSE = FlexDirection.RowReverse;

export const JUSTIFY_FLEX_START = Justify.FlexStart;
export const JUSTIFY_CENTER = Justify.Center;
export const JUSTIFY_FLEX_END = Justify.FlexEnd;
export const JUSTIFY_SPACE_BETWEEN = Justify.SpaceBetween;
export const JUSTIFY_SPACE_AROUND = Justify.SpaceAround;
export const JUSTIFY_SPACE_EVENLY = Justify.SpaceEvenly;

export const ALIGN_AUTO = Align.Auto;
export const ALIGN_FLEX_START = Align.FlexStart;
export const ALIGN_CENTER = Align.Center;
export const ALIGN_FLEX_END = Align.FlexEnd;
export const ALIGN_STRETCH = Align.Stretch;
export const ALIGN_BASELINE = Align.Baseline;
export const ALIGN_SPACE_BETWEEN = Align.SpaceBetween;
export const ALIGN_SPACE_AROUND = Align.SpaceAround;
export const ALIGN_SPACE_EVENLY = Align.SpaceEvenly;

export const WRAP_NO_WRAP = Wrap.NoWrap;
export const WRAP_WRAP = Wrap.Wrap;
export const WRAP_WRAP_REVERSE = Wrap.WrapReverse;

export const OVERFLOW_VISIBLE = Overflow.Visible;
export const OVERFLOW_HIDDEN = Overflow.Hidden;
export const OVERFLOW_SCROLL = Overflow.Scroll;

export const DISPLAY_FLEX = Display.Flex;
export const DISPLAY_NONE = Display.None;

export const POSITION_TYPE_STATIC = PositionType.Static;
export const POSITION_TYPE_RELATIVE = PositionType.Relative;
export const POSITION_TYPE_ABSOLUTE = PositionType.Absolute;

export const DIRECTION_INHERIT = Direction.Inherit;
export const DIRECTION_LTR = Direction.LTR;
export const DIRECTION_RTL = Direction.RTL;

// ============================================================================
// Value type for yoga-layout compatibility
// ============================================================================

export type Value = {
  unit: Unit;
  value: number;
};

// Helper to parse value strings like "auto", "50%", or numbers
type ValueInput = number | "auto" | `${number}%` | undefined;
type ValueInputWithAuto = number | "auto" | `${number}%` | undefined;
type ValueInputNoAuto = number | `${number}%` | undefined;

function parseValue(value: ValueInput): {
  unit: Unit;
  asNumber: number | undefined;
} {
  if (value === undefined) {
    return { unit: Unit.Undefined, asNumber: undefined };
  }
  if (value === "auto") {
    return { unit: Unit.Auto, asNumber: undefined };
  }
  if (typeof value === "string" && value.endsWith("%")) {
    return { unit: Unit.Percent, asNumber: parseFloat(value) };
  }
  return { unit: Unit.Point, asNumber: value as number };
}

// Default value for freed nodes (matches yoga-layout behavior)
const UNDEFINED_VALUE: Value = { unit: Unit.Undefined, value: NaN };

// Helper to unpack Value from u64 (lower 32 bits = unit, upper 32 bits = value as f32 bits)
function unpackValue(packed: number | bigint): Value {
  const p = BigInt(packed);
  const unit = Number(p & 0xffffffffn) as Unit;
  const valueBits = Number((p >> 32n) & 0xffffffffn);
  // Convert u32 bits back to f32
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, valueBits, true);
  const value = view.getFloat32(0, true);
  return { unit, value };
}

// Load the library
const lib = dlopen(getLibPath(), {
  // Config functions
  ygConfigNew: { args: [], returns: "ptr" },
  ygConfigFree: { args: ["ptr"], returns: "void" },
  ygConfigGetDefault: { args: [], returns: "ptr" },
  ygConfigSetUseWebDefaults: { args: ["ptr", "bool"], returns: "void" },
  ygConfigGetUseWebDefaults: { args: ["ptr"], returns: "bool" },
  ygConfigSetPointScaleFactor: { args: ["ptr", "f32"], returns: "void" },
  ygConfigGetPointScaleFactor: { args: ["ptr"], returns: "f32" },
  ygConfigSetErrata: { args: ["ptr", "i32"], returns: "void" },
  ygConfigGetErrata: { args: ["ptr"], returns: "i32" },
  ygConfigSetExperimentalFeatureEnabled: {
    args: ["ptr", "i32", "bool"],
    returns: "void",
  },
  ygConfigIsExperimentalFeatureEnabled: {
    args: ["ptr", "i32"],
    returns: "bool",
  },

  // Node creation and management
  ygNodeNew: { args: [], returns: "ptr" },
  ygNodeNewWithConfig: { args: ["ptr"], returns: "ptr" },
  ygNodeClone: { args: ["ptr"], returns: "ptr" },
  ygNodeFree: { args: ["ptr"], returns: "void" },
  ygNodeFreeRecursive: { args: ["ptr"], returns: "void" },
  ygNodeReset: { args: ["ptr"], returns: "void" },
  ygNodeCopyStyle: { args: ["ptr", "ptr"], returns: "void" },
  ygNodeSetIsReferenceBaseline: { args: ["ptr", "bool"], returns: "void" },
  ygNodeIsReferenceBaseline: { args: ["ptr"], returns: "bool" },
  ygNodeSetAlwaysFormsContainingBlock: {
    args: ["ptr", "bool"],
    returns: "void",
  },

  // Node hierarchy management
  ygNodeInsertChild: { args: ["ptr", "ptr", "u64"], returns: "void" },
  ygNodeRemoveChild: { args: ["ptr", "ptr"], returns: "void" },
  ygNodeRemoveAllChildren: { args: ["ptr"], returns: "void" },
  ygNodeGetChild: { args: ["ptr", "u64"], returns: "ptr" },
  ygNodeGetChildCount: { args: ["ptr"], returns: "u64" },
  ygNodeGetParent: { args: ["ptr"], returns: "ptr" },

  // Layout calculation
  ygNodeCalculateLayout: { args: ["ptr", "f32", "f32", "i32"], returns: "void" },
  ygNodeGetHasNewLayout: { args: ["ptr"], returns: "bool" },
  ygNodeSetHasNewLayout: { args: ["ptr", "bool"], returns: "void" },
  ygNodeMarkDirty: { args: ["ptr"], returns: "void" },
  ygNodeIsDirty: { args: ["ptr"], returns: "bool" },

  // Layout result access
  ygNodeLayoutGetLeft: { args: ["ptr"], returns: "f32" },
  ygNodeLayoutGetTop: { args: ["ptr"], returns: "f32" },
  ygNodeLayoutGetRight: { args: ["ptr"], returns: "f32" },
  ygNodeLayoutGetBottom: { args: ["ptr"], returns: "f32" },
  ygNodeLayoutGetWidth: { args: ["ptr"], returns: "f32" },
  ygNodeLayoutGetHeight: { args: ["ptr"], returns: "f32" },
  ygNodeLayoutGetBorder: { args: ["ptr", "i32"], returns: "f32" },
  ygNodeLayoutGetMargin: { args: ["ptr", "i32"], returns: "f32" },
  ygNodeLayoutGetPadding: { args: ["ptr", "i32"], returns: "f32" },

  // Style properties - Layout
  ygNodeStyleSetDirection: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetDirection: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetFlexDirection: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetFlexDirection: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetJustifyContent: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetJustifyContent: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetAlignContent: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetAlignContent: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetAlignItems: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetAlignItems: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetAlignSelf: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetAlignSelf: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetPositionType: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetPositionType: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetFlexWrap: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetFlexWrap: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetOverflow: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetOverflow: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetDisplay: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetDisplay: { args: ["ptr"], returns: "i32" },
  ygNodeStyleSetBoxSizing: { args: ["ptr", "i32"], returns: "void" },
  ygNodeStyleGetBoxSizing: { args: ["ptr"], returns: "i32" },

  // Style properties - Flex
  ygNodeStyleSetFlex: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleGetFlex: { args: ["ptr"], returns: "f32" },
  ygNodeStyleSetFlexGrow: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleGetFlexGrow: { args: ["ptr"], returns: "f32" },
  ygNodeStyleSetFlexShrink: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleGetFlexShrink: { args: ["ptr"], returns: "f32" },
  ygNodeStyleSetFlexBasis: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetFlexBasisPercent: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetFlexBasisAuto: { args: ["ptr"], returns: "void" },

  // Style properties - Position
  ygNodeStyleSetPosition: { args: ["ptr", "i32", "f32"], returns: "void" },
  ygNodeStyleSetPositionPercent: { args: ["ptr", "i32", "f32"], returns: "void" },
  ygNodeStyleSetPositionAuto: { args: ["ptr", "i32"], returns: "void" },

  // Style properties - Margin
  ygNodeStyleSetMargin: { args: ["ptr", "i32", "f32"], returns: "void" },
  ygNodeStyleSetMarginPercent: { args: ["ptr", "i32", "f32"], returns: "void" },
  ygNodeStyleSetMarginAuto: { args: ["ptr", "i32"], returns: "void" },

  // Style properties - Padding
  ygNodeStyleSetPadding: { args: ["ptr", "i32", "f32"], returns: "void" },
  ygNodeStyleSetPaddingPercent: { args: ["ptr", "i32", "f32"], returns: "void" },

  // Style properties - Border
  ygNodeStyleSetBorder: { args: ["ptr", "i32", "f32"], returns: "void" },
  ygNodeStyleGetBorder: { args: ["ptr", "i32"], returns: "f32" },

  // Style properties - Gap
  ygNodeStyleSetGap: { args: ["ptr", "i32", "f32"], returns: "void" },
  ygNodeStyleSetGapPercent: { args: ["ptr", "i32", "f32"], returns: "void" },

  // Style properties - Size
  ygNodeStyleSetWidth: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetWidthPercent: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetWidthAuto: { args: ["ptr"], returns: "void" },
  ygNodeStyleSetHeight: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetHeightPercent: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetHeightAuto: { args: ["ptr"], returns: "void" },
  ygNodeStyleSetMinWidth: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetMinWidthPercent: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetMinHeight: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetMinHeightPercent: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetMaxWidth: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetMaxWidthPercent: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetMaxHeight: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleSetMaxHeightPercent: { args: ["ptr", "f32"], returns: "void" },

  // Style properties - Aspect Ratio
  ygNodeStyleSetAspectRatio: { args: ["ptr", "f32"], returns: "void" },
  ygNodeStyleGetAspectRatio: { args: ["ptr"], returns: "f32" },

  // Node context
  ygNodeSetContext: { args: ["ptr", "ptr"], returns: "void" },
  ygNodeGetContext: { args: ["ptr"], returns: "ptr" },

  // Callback functions
  ygNodeSetMeasureFunc: { args: ["ptr", "ptr"], returns: "void" },
  ygNodeUnsetMeasureFunc: { args: ["ptr"], returns: "void" },
  ygNodeHasMeasureFunc: { args: ["ptr"], returns: "bool" },
  ygNodeSetBaselineFunc: { args: ["ptr", "ptr"], returns: "void" },
  ygNodeUnsetBaselineFunc: { args: ["ptr"], returns: "void" },
  ygNodeHasBaselineFunc: { args: ["ptr"], returns: "bool" },
  ygNodeSetDirtiedFunc: { args: ["ptr", "ptr"], returns: "void" },
  ygNodeUnsetDirtiedFunc: { args: ["ptr"], returns: "void" },
  ygNodeGetDirtiedFunc: { args: ["ptr"], returns: "ptr" },

  // Callback helper functions
  ygCreateSize: { args: ["f32", "f32"], returns: "u64" },
  ygStoreMeasureResult: { args: ["f32", "f32"], returns: "void" },
  ygStoreBaselineResult: { args: ["f32"], returns: "void" },
  ygNodeSetMeasureFuncTrampoline: { args: ["ptr", "ptr"], returns: "void" },
  ygNodeUnsetMeasureFuncTrampoline: { args: ["ptr"], returns: "void" },
  ygNodeSetBaselineFuncTrampoline: { args: ["ptr", "ptr"], returns: "void" },
  ygNodeUnsetBaselineFuncTrampoline: { args: ["ptr"], returns: "void" },
  ygNodeFreeCallbacks: { args: ["ptr"], returns: "void" },

  // Value getters (packed: lower 32 bits = unit, upper 32 bits = value)
  ygNodeStyleGetWidthPacked: { args: ["ptr"], returns: "u64" },
  ygNodeStyleGetHeightPacked: { args: ["ptr"], returns: "u64" },
  ygNodeStyleGetMinWidthPacked: { args: ["ptr"], returns: "u64" },
  ygNodeStyleGetMinHeightPacked: { args: ["ptr"], returns: "u64" },
  ygNodeStyleGetMaxWidthPacked: { args: ["ptr"], returns: "u64" },
  ygNodeStyleGetMaxHeightPacked: { args: ["ptr"], returns: "u64" },
  ygNodeStyleGetMarginPacked: { args: ["ptr", "i32"], returns: "u64" },
  ygNodeStyleGetPaddingPacked: { args: ["ptr", "i32"], returns: "u64" },
  ygNodeStyleGetPositionPacked: { args: ["ptr", "i32"], returns: "u64" },
  ygNodeStyleGetGapPacked: { args: ["ptr", "i32"], returns: "u64" },
  ygNodeStyleGetFlexBasisPacked: { args: ["ptr"], returns: "u64" },
});

const yg = lib.symbols;

// ============================================================================
// Callback function types
// ============================================================================

export type MeasureFunction = (
  width: number,
  widthMode: MeasureMode,
  height: number,
  heightMode: MeasureMode
) => { width: number; height: number };

export type BaselineFunction = (width: number, height: number) => number;

export type DirtiedFunction = (node: Node) => void;

// ============================================================================
// Node class - yoga-layout compatible API
// ============================================================================

export class Node {
  private ptr: Pointer;
  private _freed: boolean = false;
  private measureCallback: InstanceType<typeof JSCallback> | null = null;
  private baselineCallback: InstanceType<typeof JSCallback> | null = null;
  private dirtiedCallback: InstanceType<typeof JSCallback> | null = null;

  private constructor(ptr: Pointer) {
    this.ptr = ptr;
  }

  /** Check if the node has been freed */
  isFreed(): boolean {
    return this._freed;
  }

  static create(config?: Config): Node {
    const ptr = config
      ? yg.ygNodeNewWithConfig(config["ptr"])
      : yg.ygNodeNew();
    if (!ptr) throw new Error("Failed to create node");
    return new Node(ptr);
  }

  static createDefault(): Node {
    return Node.create();
  }

  static createWithConfig(config: Config): Node {
    return Node.create(config);
  }

  static destroy(node: Node): void {
    node.free();
  }

  free(): void {
    if (this._freed) return; // Already freed, no-op
    // Clean up callbacks before freeing the node
    this.unsetMeasureFunc();
    this.unsetBaselineFunc();
    this.unsetDirtiedFunc();
    yg.ygNodeFree(this.ptr);
    this._freed = true;
  }

  freeRecursive(): void {
    if (this._freed) return; // Already freed, no-op
    // Clean up this node's callbacks before freeing
    // Note: Child nodes' JSCallback objects are not tracked here - if you have
    // references to child Node objects, their callbacks become invalid after this call
    this.cleanupCallbacks();
    yg.ygNodeFreeRecursive(this.ptr);
    this._freed = true;
  }

  reset(): void {
    if (this._freed) return;
    // Clean up callbacks before reset since reset clears all state
    this.cleanupCallbacks();
    yg.ygNodeReset(this.ptr);
  }

  /** Internal helper to close JSCallback objects without calling native unset functions */
  private cleanupCallbacks(): void {
    if (this.measureCallback) {
      this.measureCallback.close();
      this.measureCallback = null;
    }
    if (this.baselineCallback) {
      this.baselineCallback.close();
      this.baselineCallback = null;
    }
    if (this.dirtiedCallback) {
      this.dirtiedCallback.close();
      this.dirtiedCallback = null;
    }
  }

  clone(): Node {
    if (this._freed) throw new Error("Cannot clone freed node");
    const ptr = yg.ygNodeClone(this.ptr);
    if (!ptr) throw new Error("Failed to clone node");
    return new Node(ptr);
  }

  copyStyle(node: Node): void {
    if (this._freed) return;
    yg.ygNodeCopyStyle(this.ptr, node.ptr);
  }

  setIsReferenceBaseline(isReferenceBaseline: boolean): void {
    if (this._freed) return;
    yg.ygNodeSetIsReferenceBaseline(this.ptr, isReferenceBaseline);
  }

  isReferenceBaseline(): boolean {
    if (this._freed) return false;
    return yg.ygNodeIsReferenceBaseline(this.ptr);
  }

  setAlwaysFormsContainingBlock(alwaysFormsContainingBlock: boolean): void {
    if (this._freed) return;
    yg.ygNodeSetAlwaysFormsContainingBlock(this.ptr, alwaysFormsContainingBlock);
  }

  // Hierarchy
  insertChild(child: Node, index: number): void {
    if (this._freed) return;
    yg.ygNodeInsertChild(this.ptr, child.ptr, index);
  }

  removeChild(child: Node): void {
    if (this._freed) return;
    yg.ygNodeRemoveChild(this.ptr, child.ptr);
  }

  removeAllChildren(): void {
    if (this._freed) return;
    yg.ygNodeRemoveAllChildren(this.ptr);
  }

  getChild(index: number): Node | null {
    if (this._freed) return null;
    const ptr = yg.ygNodeGetChild(this.ptr, index);
    return ptr ? new Node(ptr) : null;
  }

  getChildCount(): number {
    if (this._freed) return 0;
    return Number(yg.ygNodeGetChildCount(this.ptr));
  }

  getParent(): Node | null {
    if (this._freed) return null;
    const ptr = yg.ygNodeGetParent(this.ptr);
    return ptr ? new Node(ptr) : null;
  }

  // Layout
  calculateLayout(
    width?: number | "auto",
    height?: number | "auto",
    direction: number = Direction.LTR
  ): void {
    if (this._freed) return;
    const w = width === "auto" || width === undefined ? NaN : width;
    const h = height === "auto" || height === undefined ? NaN : height;
    yg.ygNodeCalculateLayout(this.ptr, w, h, direction);
  }

  hasNewLayout(): boolean {
    if (this._freed) return false;
    return yg.ygNodeGetHasNewLayout(this.ptr);
  }

  markLayoutSeen(): void {
    if (this._freed) return;
    yg.ygNodeSetHasNewLayout(this.ptr, false);
  }

  markDirty(): void {
    if (this._freed) return;
    yg.ygNodeMarkDirty(this.ptr);
  }

  isDirty(): boolean {
    if (this._freed) return true; // yoga-layout returns true for freed nodes
    return yg.ygNodeIsDirty(this.ptr);
  }

  // Layout results
  getComputedLayout() {
    if (this._freed) return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    return {
      left: yg.ygNodeLayoutGetLeft(this.ptr),
      top: yg.ygNodeLayoutGetTop(this.ptr),
      right: yg.ygNodeLayoutGetRight(this.ptr),
      bottom: yg.ygNodeLayoutGetBottom(this.ptr),
      width: yg.ygNodeLayoutGetWidth(this.ptr),
      height: yg.ygNodeLayoutGetHeight(this.ptr),
    };
  }

  getComputedLeft(): number {
    if (this._freed) return 0;
    return yg.ygNodeLayoutGetLeft(this.ptr);
  }

  getComputedTop(): number {
    if (this._freed) return 0;
    return yg.ygNodeLayoutGetTop(this.ptr);
  }

  getComputedRight(): number {
    if (this._freed) return 0;
    return yg.ygNodeLayoutGetRight(this.ptr);
  }

  getComputedBottom(): number {
    if (this._freed) return 0;
    return yg.ygNodeLayoutGetBottom(this.ptr);
  }

  getComputedWidth(): number {
    if (this._freed) return 0;
    return yg.ygNodeLayoutGetWidth(this.ptr);
  }

  getComputedHeight(): number {
    if (this._freed) return 0;
    return yg.ygNodeLayoutGetHeight(this.ptr);
  }

  getComputedBorder(edge: number): number {
    if (this._freed) return 0;
    return yg.ygNodeLayoutGetBorder(this.ptr, edge);
  }

  getComputedMargin(edge: number): number {
    if (this._freed) return 0;
    return yg.ygNodeLayoutGetMargin(this.ptr, edge);
  }

  getComputedPadding(edge: number): number {
    if (this._freed) return 0;
    return yg.ygNodeLayoutGetPadding(this.ptr, edge);
  }

  // Style setters
  setDirection(direction: Direction): void {
    if (this._freed) return;
    yg.ygNodeStyleSetDirection(this.ptr, direction);
  }

  getDirection(): Direction {
    if (this._freed) return Direction.Inherit;
    return yg.ygNodeStyleGetDirection(this.ptr) as Direction;
  }

  setFlexDirection(flexDirection: FlexDirection): void {
    if (this._freed) return;
    yg.ygNodeStyleSetFlexDirection(this.ptr, flexDirection);
  }

  getFlexDirection(): FlexDirection {
    if (this._freed) return FlexDirection.Column;
    return yg.ygNodeStyleGetFlexDirection(this.ptr) as FlexDirection;
  }

  setJustifyContent(justifyContent: Justify): void {
    if (this._freed) return;
    yg.ygNodeStyleSetJustifyContent(this.ptr, justifyContent);
  }

  getJustifyContent(): Justify {
    if (this._freed) return Justify.FlexStart;
    return yg.ygNodeStyleGetJustifyContent(this.ptr) as Justify;
  }

  setAlignContent(alignContent: Align): void {
    if (this._freed) return;
    yg.ygNodeStyleSetAlignContent(this.ptr, alignContent);
  }

  getAlignContent(): Align {
    if (this._freed) return Align.Auto;
    return yg.ygNodeStyleGetAlignContent(this.ptr) as Align;
  }

  setAlignItems(alignItems: Align): void {
    if (this._freed) return;
    yg.ygNodeStyleSetAlignItems(this.ptr, alignItems);
  }

  getAlignItems(): Align {
    if (this._freed) return Align.Auto;
    return yg.ygNodeStyleGetAlignItems(this.ptr) as Align;
  }

  setAlignSelf(alignSelf: Align): void {
    if (this._freed) return;
    yg.ygNodeStyleSetAlignSelf(this.ptr, alignSelf);
  }

  getAlignSelf(): Align {
    if (this._freed) return Align.Auto;
    return yg.ygNodeStyleGetAlignSelf(this.ptr) as Align;
  }

  setPositionType(positionType: PositionType): void {
    if (this._freed) return;
    yg.ygNodeStyleSetPositionType(this.ptr, positionType);
  }

  getPositionType(): PositionType {
    if (this._freed) return PositionType.Static;
    return yg.ygNodeStyleGetPositionType(this.ptr) as PositionType;
  }

  setFlexWrap(flexWrap: Wrap): void {
    if (this._freed) return;
    yg.ygNodeStyleSetFlexWrap(this.ptr, flexWrap);
  }

  getFlexWrap(): Wrap {
    if (this._freed) return Wrap.NoWrap;
    return yg.ygNodeStyleGetFlexWrap(this.ptr) as Wrap;
  }

  setOverflow(overflow: Overflow): void {
    if (this._freed) return;
    yg.ygNodeStyleSetOverflow(this.ptr, overflow);
  }

  getOverflow(): Overflow {
    if (this._freed) return Overflow.Visible;
    return yg.ygNodeStyleGetOverflow(this.ptr) as Overflow;
  }

  setDisplay(display: Display): void {
    if (this._freed) return;
    yg.ygNodeStyleSetDisplay(this.ptr, display);
  }

  getDisplay(): Display {
    if (this._freed) return Display.Flex;
    return yg.ygNodeStyleGetDisplay(this.ptr) as Display;
  }

  setBoxSizing(boxSizing: BoxSizing): void {
    if (this._freed) return;
    yg.ygNodeStyleSetBoxSizing(this.ptr, boxSizing);
  }

  getBoxSizing(): BoxSizing {
    if (this._freed) return BoxSizing.BorderBox;
    return yg.ygNodeStyleGetBoxSizing(this.ptr) as BoxSizing;
  }

  setFlex(flex: number): void {
    if (this._freed) return;
    yg.ygNodeStyleSetFlex(this.ptr, flex);
  }

  getFlex(): number {
    if (this._freed) return NaN;
    return yg.ygNodeStyleGetFlex(this.ptr);
  }

  setFlexGrow(flexGrow: number): void {
    if (this._freed) return;
    yg.ygNodeStyleSetFlexGrow(this.ptr, flexGrow);
  }

  getFlexGrow(): number {
    if (this._freed) return NaN;
    return yg.ygNodeStyleGetFlexGrow(this.ptr);
  }

  setFlexShrink(flexShrink: number): void {
    if (this._freed) return;
    yg.ygNodeStyleSetFlexShrink(this.ptr, flexShrink);
  }

  getFlexShrink(): number {
    if (this._freed) return NaN;
    return yg.ygNodeStyleGetFlexShrink(this.ptr);
  }

  setFlexBasis(flexBasis: number | "auto" | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(flexBasis);
    if (unit === Unit.Auto) {
      yg.ygNodeStyleSetFlexBasisAuto(this.ptr);
    } else if (unit === Unit.Percent) {
      yg.ygNodeStyleSetFlexBasisPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetFlexBasis(this.ptr, asNumber);
    }
  }

  setFlexBasisPercent(flexBasis: number | undefined): void {
    if (this._freed) return;
    if (flexBasis !== undefined) {
      yg.ygNodeStyleSetFlexBasisPercent(this.ptr, flexBasis);
    }
  }

  setFlexBasisAuto(): void {
    if (this._freed) return;
    yg.ygNodeStyleSetFlexBasisAuto(this.ptr);
  }

  setPosition(edge: Edge, position: number | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(position);
    if (unit === Unit.Percent) {
      yg.ygNodeStyleSetPositionPercent(this.ptr, edge, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetPosition(this.ptr, edge, asNumber);
    }
  }

  setPositionPercent(edge: Edge, position: number | undefined): void {
    if (this._freed) return;
    if (position !== undefined) {
      yg.ygNodeStyleSetPositionPercent(this.ptr, edge, position);
    }
  }

  setPositionAuto(edge: Edge): void {
    if (this._freed) return;
    yg.ygNodeStyleSetPositionAuto(this.ptr, edge);
  }

  setMargin(
    edge: Edge,
    margin: number | "auto" | `${number}%` | undefined
  ): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(margin);
    if (unit === Unit.Auto) {
      yg.ygNodeStyleSetMarginAuto(this.ptr, edge);
    } else if (unit === Unit.Percent) {
      yg.ygNodeStyleSetMarginPercent(this.ptr, edge, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetMargin(this.ptr, edge, asNumber);
    }
  }

  setMarginPercent(edge: Edge, margin: number | undefined): void {
    if (this._freed) return;
    if (margin !== undefined) {
      yg.ygNodeStyleSetMarginPercent(this.ptr, edge, margin);
    }
  }

  setMarginAuto(edge: Edge): void {
    if (this._freed) return;
    yg.ygNodeStyleSetMarginAuto(this.ptr, edge);
  }

  setPadding(edge: Edge, padding: number | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(padding);
    if (unit === Unit.Percent) {
      yg.ygNodeStyleSetPaddingPercent(this.ptr, edge, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetPadding(this.ptr, edge, asNumber);
    }
  }

  setPaddingPercent(edge: Edge, padding: number | undefined): void {
    if (this._freed) return;
    if (padding !== undefined) {
      yg.ygNodeStyleSetPaddingPercent(this.ptr, edge, padding);
    }
  }

  setBorder(edge: Edge, border: number | undefined): void {
    if (this._freed) return;
    if (border !== undefined) {
      yg.ygNodeStyleSetBorder(this.ptr, edge, border);
    }
  }

  getBorder(edge: Edge): number {
    if (this._freed) return NaN;
    return yg.ygNodeStyleGetBorder(this.ptr, edge);
  }

  setGap(gutter: Gutter, gap: number | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(gap);
    if (unit === Unit.Percent) {
      yg.ygNodeStyleSetGapPercent(this.ptr, gutter, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetGap(this.ptr, gutter, asNumber);
    }
  }

  setGapPercent(gutter: Gutter, gap: number | undefined): void {
    if (this._freed) return;
    if (gap !== undefined) {
      yg.ygNodeStyleSetGapPercent(this.ptr, gutter, gap);
    }
  }

  setWidth(width: number | "auto" | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(width);
    if (unit === Unit.Auto) {
      yg.ygNodeStyleSetWidthAuto(this.ptr);
    } else if (unit === Unit.Percent) {
      yg.ygNodeStyleSetWidthPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetWidth(this.ptr, asNumber);
    }
  }

  setWidthPercent(width: number | undefined): void {
    if (this._freed) return;
    if (width !== undefined) {
      yg.ygNodeStyleSetWidthPercent(this.ptr, width);
    }
  }

  setWidthAuto(): void {
    if (this._freed) return;
    yg.ygNodeStyleSetWidthAuto(this.ptr);
  }

  setHeight(height: number | "auto" | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(height);
    if (unit === Unit.Auto) {
      yg.ygNodeStyleSetHeightAuto(this.ptr);
    } else if (unit === Unit.Percent) {
      yg.ygNodeStyleSetHeightPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetHeight(this.ptr, asNumber);
    }
  }

  setHeightPercent(height: number | undefined): void {
    if (this._freed) return;
    if (height !== undefined) {
      yg.ygNodeStyleSetHeightPercent(this.ptr, height);
    }
  }

  setHeightAuto(): void {
    if (this._freed) return;
    yg.ygNodeStyleSetHeightAuto(this.ptr);
  }

  setMinWidth(minWidth: number | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(minWidth);
    if (unit === Unit.Percent) {
      yg.ygNodeStyleSetMinWidthPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetMinWidth(this.ptr, asNumber);
    }
  }

  setMinWidthPercent(minWidth: number | undefined): void {
    if (this._freed) return;
    if (minWidth !== undefined) {
      yg.ygNodeStyleSetMinWidthPercent(this.ptr, minWidth);
    }
  }

  setMinHeight(minHeight: number | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(minHeight);
    if (unit === Unit.Percent) {
      yg.ygNodeStyleSetMinHeightPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetMinHeight(this.ptr, asNumber);
    }
  }

  setMinHeightPercent(minHeight: number | undefined): void {
    if (this._freed) return;
    if (minHeight !== undefined) {
      yg.ygNodeStyleSetMinHeightPercent(this.ptr, minHeight);
    }
  }

  setMaxWidth(maxWidth: number | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(maxWidth);
    if (unit === Unit.Percent) {
      yg.ygNodeStyleSetMaxWidthPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetMaxWidth(this.ptr, asNumber);
    }
  }

  setMaxWidthPercent(maxWidth: number | undefined): void {
    if (this._freed) return;
    if (maxWidth !== undefined) {
      yg.ygNodeStyleSetMaxWidthPercent(this.ptr, maxWidth);
    }
  }

  setMaxHeight(maxHeight: number | `${number}%` | undefined): void {
    if (this._freed) return;
    const { unit, asNumber } = parseValue(maxHeight);
    if (unit === Unit.Percent) {
      yg.ygNodeStyleSetMaxHeightPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.ygNodeStyleSetMaxHeight(this.ptr, asNumber);
    }
  }

  setMaxHeightPercent(maxHeight: number | undefined): void {
    if (this._freed) return;
    if (maxHeight !== undefined) {
      yg.ygNodeStyleSetMaxHeightPercent(this.ptr, maxHeight);
    }
  }

  setAspectRatio(aspectRatio: number | undefined): void {
    if (this._freed) return;
    if (aspectRatio !== undefined) {
      yg.ygNodeStyleSetAspectRatio(this.ptr, aspectRatio);
    }
  }

  getAspectRatio(): number {
    if (this._freed) return NaN;
    return yg.ygNodeStyleGetAspectRatio(this.ptr);
  }

  // Value getters (return {unit, value} like yoga-layout)
  getWidth(): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetWidthPacked(this.ptr));
  }

  getHeight(): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetHeightPacked(this.ptr));
  }

  getMinWidth(): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetMinWidthPacked(this.ptr));
  }

  getMinHeight(): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetMinHeightPacked(this.ptr));
  }

  getMaxWidth(): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetMaxWidthPacked(this.ptr));
  }

  getMaxHeight(): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetMaxHeightPacked(this.ptr));
  }

  getMargin(edge: Edge): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetMarginPacked(this.ptr, edge));
  }

  getPadding(edge: Edge): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetPaddingPacked(this.ptr, edge));
  }

  getPosition(edge: Edge): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetPositionPacked(this.ptr, edge));
  }

  getGap(gutter: Gutter): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetGapPacked(this.ptr, gutter));
  }

  getFlexBasis(): Value {
    if (this._freed) return UNDEFINED_VALUE;
    return unpackValue(yg.ygNodeStyleGetFlexBasisPacked(this.ptr));
  }

  // Callback functions
  setMeasureFunc(measureFunc: MeasureFunction | null): void {
    if (this._freed) return;
    this.unsetMeasureFunc(); // Clean up existing callback

    if (measureFunc) {
      // Use trampoline approach to work around ARM64 ABI limitations
      // The trampoline doesn't return the result directly - instead it stores
      // the result via ygStoreMeasureResult, and our Zig wrapper reads it
      this.measureCallback = new JSCallback(
        (
          nodePtr: Pointer,
          width: number,
          widthMode: number,
          height: number,
          heightMode: number
        ) => {
          const result = measureFunc(width, widthMode as MeasureMode, height, heightMode as MeasureMode);
          // Store the result for the Zig wrapper to read
          yg.ygStoreMeasureResult(result.width, result.height);
        },
        {
          args: [
            FFIType.ptr,
            FFIType.f32,
            FFIType.u32,
            FFIType.f32,
            FFIType.u32,
          ],
          returns: FFIType.void,
        }
      );

      if (this.measureCallback.ptr) {
        yg.ygNodeSetMeasureFuncTrampoline(this.ptr, this.measureCallback.ptr);
      }
    }
  }

  unsetMeasureFunc(): void {
    if (this._freed) return; // Skip if already freed
    if (this.measureCallback) {
      this.measureCallback.close();
      this.measureCallback = null;
    }
    yg.ygNodeUnsetMeasureFuncTrampoline(this.ptr);
  }

  hasMeasureFunc(): boolean {
    if (this._freed) return false;
    return yg.ygNodeHasMeasureFunc(this.ptr);
  }

  setBaselineFunc(baselineFunc: BaselineFunction | null): void {
    if (this._freed) return;
    this.unsetBaselineFunc(); // Clean up existing callback

    if (baselineFunc) {
      // Use trampoline approach to work around ARM64 ABI limitations
      // The trampoline stores the result via ygStoreBaselineResult
      this.baselineCallback = new JSCallback(
        (nodePtr: Pointer, width: number, height: number) => {
          const result = baselineFunc(width, height);
          yg.ygStoreBaselineResult(result);
        },
        {
          args: [FFIType.ptr, FFIType.f32, FFIType.f32],
          returns: FFIType.void,
        }
      );

      if (this.baselineCallback.ptr) {
        yg.ygNodeSetBaselineFuncTrampoline(this.ptr, this.baselineCallback.ptr);
      }
    }
  }

  unsetBaselineFunc(): void {
    if (this._freed) return; // Skip if already freed
    if (this.baselineCallback) {
      this.baselineCallback.close();
      this.baselineCallback = null;
    }
    yg.ygNodeUnsetBaselineFuncTrampoline(this.ptr);
  }

  hasBaselineFunc(): boolean {
    if (this._freed) return false;
    return yg.ygNodeHasBaselineFunc(this.ptr);
  }

  setDirtiedFunc(dirtiedFunc: DirtiedFunction | null): void {
    if (this._freed) return;
    this.unsetDirtiedFunc(); // Clean up existing callback

    if (dirtiedFunc) {
      // Capture this node instance for the callback
      const node = this;
      // Create a JSCallback that matches Yoga's expected dirtied function signature
      this.dirtiedCallback = new JSCallback(
        (nodePtr: Pointer) => {
          dirtiedFunc(node);
        },
        {
          args: [FFIType.ptr],
          returns: FFIType.void,
        }
      );

      if (this.dirtiedCallback.ptr) {
        yg.ygNodeSetDirtiedFunc(this.ptr, this.dirtiedCallback.ptr);
      }
    }
  }

  unsetDirtiedFunc(): void {
    if (this._freed) return; // Skip if already freed
    if (this.dirtiedCallback) {
      this.dirtiedCallback.close();
      this.dirtiedCallback = null;
    }
    yg.ygNodeUnsetDirtiedFunc(this.ptr);
  }

  hasDirtiedFunc(): boolean {
    if (this._freed) return false;
    return yg.ygNodeGetDirtiedFunc(this.ptr) !== null;
  }
}

// ============================================================================
// Config class
// ============================================================================

export class Config {
  private ptr: Pointer;

  private constructor(ptr: Pointer) {
    this.ptr = ptr;
  }

  static create(): Config {
    const ptr = yg.ygConfigNew();
    if (!ptr) throw new Error("Failed to create config");
    return new Config(ptr);
  }

  static destroy(config: Config): void {
    config.free();
  }

  free(): void {
    yg.ygConfigFree(this.ptr);
  }

  setUseWebDefaults(useWebDefaults: boolean): void {
    yg.ygConfigSetUseWebDefaults(this.ptr, useWebDefaults);
  }

  useWebDefaults(): boolean {
    return yg.ygConfigGetUseWebDefaults(this.ptr);
  }

  setPointScaleFactor(pointScaleFactor: number): void {
    yg.ygConfigSetPointScaleFactor(this.ptr, pointScaleFactor);
  }

  getPointScaleFactor(): number {
    return yg.ygConfigGetPointScaleFactor(this.ptr);
  }

  setErrata(errata: Errata): void {
    yg.ygConfigSetErrata(this.ptr, errata);
  }

  getErrata(): Errata {
    return yg.ygConfigGetErrata(this.ptr) as Errata;
  }

  setExperimentalFeatureEnabled(
    feature: ExperimentalFeature,
    enabled: boolean
  ): void {
    yg.ygConfigSetExperimentalFeatureEnabled(this.ptr, feature, enabled);
  }

  isExperimentalFeatureEnabled(feature: ExperimentalFeature): boolean {
    return yg.ygConfigIsExperimentalFeatureEnabled(this.ptr, feature);
  }
}

// Default export for yoga-layout compatibility
export default {
  Node,
  Config,
  // Enums
  Align,
  BoxSizing,
  Dimension,
  Direction,
  Display,
  Edge,
  Errata,
  ExperimentalFeature,
  FlexDirection,
  Gutter,
  Justify,
  LogLevel,
  MeasureMode,
  NodeType,
  Overflow,
  PositionType,
  Unit,
  Wrap,
  // Constants
  EDGE_LEFT,
  EDGE_TOP,
  EDGE_RIGHT,
  EDGE_BOTTOM,
  EDGE_START,
  EDGE_END,
  EDGE_HORIZONTAL,
  EDGE_VERTICAL,
  EDGE_ALL,
  FLEX_DIRECTION_COLUMN,
  FLEX_DIRECTION_COLUMN_REVERSE,
  FLEX_DIRECTION_ROW,
  FLEX_DIRECTION_ROW_REVERSE,
  JUSTIFY_FLEX_START,
  JUSTIFY_CENTER,
  JUSTIFY_FLEX_END,
  JUSTIFY_SPACE_BETWEEN,
  JUSTIFY_SPACE_AROUND,
  JUSTIFY_SPACE_EVENLY,
  ALIGN_AUTO,
  ALIGN_FLEX_START,
  ALIGN_CENTER,
  ALIGN_FLEX_END,
  ALIGN_STRETCH,
  ALIGN_BASELINE,
  ALIGN_SPACE_BETWEEN,
  ALIGN_SPACE_AROUND,
  ALIGN_SPACE_EVENLY,
  WRAP_NO_WRAP,
  WRAP_WRAP,
  WRAP_WRAP_REVERSE,
  OVERFLOW_VISIBLE,
  OVERFLOW_HIDDEN,
  OVERFLOW_SCROLL,
  DISPLAY_FLEX,
  DISPLAY_NONE,
  POSITION_TYPE_STATIC,
  POSITION_TYPE_RELATIVE,
  POSITION_TYPE_ABSOLUTE,
  DIRECTION_INHERIT,
  DIRECTION_LTR,
  DIRECTION_RTL,
};
