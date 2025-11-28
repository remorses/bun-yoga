import { dlopen, type Pointer, suffix, JSCallback, FFIType } from "bun:ffi";
import { join } from "path";
import { existsSync } from "fs";
import { arch, platform } from "os";

// Embed native libraries for bun compile (type: "file" embeds them in the binary)
// @ts-ignore - import attribute for embedding binary files
import embeddedDarwinArm64 from "../dist/darwin-arm64/libyoga.dylib" with { type: "file" };
// @ts-ignore - import attribute for embedding binary files
import embeddedDarwinX64 from "../dist/darwin-x64/libyoga.dylib" with { type: "file" };
// @ts-ignore - import attribute for embedding binary files
import embeddedLinuxX64 from "../dist/linux-x64/libyoga.so" with { type: "file" };
// @ts-ignore - import attribute for embedding binary files
import embeddedLinuxArm64 from "../dist/linux-arm64/libyoga.so" with { type: "file" };

// Platform detection
function getPlatformTarget(): string {
  const p = platform();
  const a = arch();

  if (p === "darwin") {
    return a === "arm64" ? "darwin-arm64" : "darwin-x64";
  } else if (p === "linux") {
    return a === "arm64" ? "linux-arm64" : "linux-x64";
  }
  throw new Error(`Unsupported platform: ${p}-${a}`);
}

function getEmbeddedLib(): string | undefined {
  const target = getPlatformTarget();
  const libs: Record<string, string> = {
    "darwin-arm64": embeddedDarwinArm64,
    "darwin-x64": embeddedDarwinX64,
    "linux-x64": embeddedLinuxX64,
    "linux-arm64": embeddedLinuxArm64,
  };
  return libs[target];
}

function getLibPath(): string {
  const libName = `libyoga.${suffix}`;
  const target = getPlatformTarget();

  // Check local development path (zig-out) first for development
  const devPath = join(import.meta.dir, "..", "zig-out", "lib", libName);
  if (existsSync(devPath)) {
    return devPath;
  }

  // Check embedded libraries (for bun compile)
  const embedded = getEmbeddedLib();
  if (embedded && existsSync(embedded)) {
    return embedded;
  }

  // Check npm package dist paths
  const distPath = join(import.meta.dir, "..", "dist", target, libName);
  if (existsSync(distPath)) {
    return distPath;
  }

  throw new Error(
    `Could not find native library ${libName}. ` +
      `Looked in:\n  - ${devPath}\n  - ${distPath}\n` +
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

export const BoxSizing = {
  BorderBox: 0,
  ContentBox: 1,
} as const;

export const Dimension = {
  Width: 0,
  Height: 1,
} as const;

export const Direction = {
  Inherit: 0,
  LTR: 1,
  RTL: 2,
} as const;

export const Display = {
  Flex: 0,
  None: 1,
  Contents: 2,
} as const;

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

export const Errata = {
  None: 0,
  StretchFlexBasis: 1,
  AbsolutePositionWithoutInsetsExcludesPadding: 2,
  AbsolutePercentAgainstInnerSize: 4,
  All: 2147483647,
  Classic: 2147483646,
} as const;

export const ExperimentalFeature = {
  WebFlexBasis: 0,
} as const;

export const FlexDirection = {
  Column: 0,
  ColumnReverse: 1,
  Row: 2,
  RowReverse: 3,
} as const;

export const Gutter = {
  Column: 0,
  Row: 1,
  All: 2,
} as const;

export const Justify = {
  FlexStart: 0,
  Center: 1,
  FlexEnd: 2,
  SpaceBetween: 3,
  SpaceAround: 4,
  SpaceEvenly: 5,
} as const;

export const LogLevel = {
  Error: 0,
  Warn: 1,
  Info: 2,
  Debug: 3,
  Verbose: 4,
  Fatal: 5,
} as const;

export const MeasureMode = {
  Undefined: 0,
  Exactly: 1,
  AtMost: 2,
} as const;

export const NodeType = {
  Default: 0,
  Text: 1,
} as const;

export const Overflow = {
  Visible: 0,
  Hidden: 1,
  Scroll: 2,
} as const;

export const PositionType = {
  Static: 0,
  Relative: 1,
  Absolute: 2,
} as const;

export const Unit = {
  Undefined: 0,
  Point: 1,
  Percent: 2,
  Auto: 3,
} as const;

export const Wrap = {
  NoWrap: 0,
  Wrap: 1,
  WrapReverse: 2,
} as const;

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

  // Node creation and management
  ygNodeNew: { args: [], returns: "ptr" },
  ygNodeNewWithConfig: { args: ["ptr"], returns: "ptr" },
  ygNodeClone: { args: ["ptr"], returns: "ptr" },
  ygNodeFree: { args: ["ptr"], returns: "void" },
  ygNodeFreeRecursive: { args: ["ptr"], returns: "void" },
  ygNodeReset: { args: ["ptr"], returns: "void" },

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
  ygNodeSetMeasureFuncTrampoline: { args: ["ptr", "ptr"], returns: "void" },
  ygNodeUnsetMeasureFuncTrampoline: { args: ["ptr"], returns: "void" },
});

const yg = lib.symbols;

// ============================================================================
// Callback function types
// ============================================================================

export type MeasureFunction = (
  width: number,
  widthMode: number,
  height: number,
  heightMode: number
) => { width: number; height: number };

export type BaselineFunction = (width: number, height: number) => number;

export type DirtiedFunction = () => void;

// ============================================================================
// Node class - yoga-layout compatible API
// ============================================================================

export class Node {
  private ptr: Pointer;
  private measureCallback: JSCallback | null = null;
  private baselineCallback: JSCallback | null = null;
  private dirtiedCallback: JSCallback | null = null;

  private constructor(ptr: Pointer) {
    this.ptr = ptr;
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
    // Clean up callbacks before freeing the node
    this.unsetMeasureFunc();
    this.unsetBaselineFunc();
    this.unsetDirtiedFunc();
    yg.ygNodeFree(this.ptr);
  }

  freeRecursive(): void {
    yg.ygNodeFreeRecursive(this.ptr);
  }

  reset(): void {
    yg.ygNodeReset(this.ptr);
  }

  clone(): Node {
    const ptr = yg.ygNodeClone(this.ptr);
    if (!ptr) throw new Error("Failed to clone node");
    return new Node(ptr);
  }

  // Hierarchy
  insertChild(child: Node, index: number): void {
    yg.ygNodeInsertChild(this.ptr, child.ptr, index);
  }

  removeChild(child: Node): void {
    yg.ygNodeRemoveChild(this.ptr, child.ptr);
  }

  removeAllChildren(): void {
    yg.ygNodeRemoveAllChildren(this.ptr);
  }

  getChild(index: number): Node | null {
    const ptr = yg.ygNodeGetChild(this.ptr, index);
    return ptr ? new Node(ptr) : null;
  }

  getChildCount(): number {
    return Number(yg.ygNodeGetChildCount(this.ptr));
  }

  getParent(): Node | null {
    const ptr = yg.ygNodeGetParent(this.ptr);
    return ptr ? new Node(ptr) : null;
  }

  // Layout
  calculateLayout(
    width?: number | "auto",
    height?: number | "auto",
    direction: number = Direction.LTR
  ): void {
    const w = width === "auto" || width === undefined ? NaN : width;
    const h = height === "auto" || height === undefined ? NaN : height;
    yg.ygNodeCalculateLayout(this.ptr, w, h, direction);
  }

  hasNewLayout(): boolean {
    return yg.ygNodeGetHasNewLayout(this.ptr);
  }

  markLayoutSeen(): void {
    yg.ygNodeSetHasNewLayout(this.ptr, false);
  }

  markDirty(): void {
    yg.ygNodeMarkDirty(this.ptr);
  }

  isDirty(): boolean {
    return yg.ygNodeIsDirty(this.ptr);
  }

  // Layout results
  getComputedLayout() {
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
    return yg.ygNodeLayoutGetLeft(this.ptr);
  }

  getComputedTop(): number {
    return yg.ygNodeLayoutGetTop(this.ptr);
  }

  getComputedRight(): number {
    return yg.ygNodeLayoutGetRight(this.ptr);
  }

  getComputedBottom(): number {
    return yg.ygNodeLayoutGetBottom(this.ptr);
  }

  getComputedWidth(): number {
    return yg.ygNodeLayoutGetWidth(this.ptr);
  }

  getComputedHeight(): number {
    return yg.ygNodeLayoutGetHeight(this.ptr);
  }

  getComputedBorder(edge: number): number {
    return yg.ygNodeLayoutGetBorder(this.ptr, edge);
  }

  getComputedMargin(edge: number): number {
    return yg.ygNodeLayoutGetMargin(this.ptr, edge);
  }

  getComputedPadding(edge: number): number {
    return yg.ygNodeLayoutGetPadding(this.ptr, edge);
  }

  // Style setters
  setDirection(direction: number): void {
    yg.ygNodeStyleSetDirection(this.ptr, direction);
  }

  getDirection(): number {
    return yg.ygNodeStyleGetDirection(this.ptr);
  }

  setFlexDirection(flexDirection: number): void {
    yg.ygNodeStyleSetFlexDirection(this.ptr, flexDirection);
  }

  getFlexDirection(): number {
    return yg.ygNodeStyleGetFlexDirection(this.ptr);
  }

  setJustifyContent(justifyContent: number): void {
    yg.ygNodeStyleSetJustifyContent(this.ptr, justifyContent);
  }

  getJustifyContent(): number {
    return yg.ygNodeStyleGetJustifyContent(this.ptr);
  }

  setAlignContent(alignContent: number): void {
    yg.ygNodeStyleSetAlignContent(this.ptr, alignContent);
  }

  getAlignContent(): number {
    return yg.ygNodeStyleGetAlignContent(this.ptr);
  }

  setAlignItems(alignItems: number): void {
    yg.ygNodeStyleSetAlignItems(this.ptr, alignItems);
  }

  getAlignItems(): number {
    return yg.ygNodeStyleGetAlignItems(this.ptr);
  }

  setAlignSelf(alignSelf: number): void {
    yg.ygNodeStyleSetAlignSelf(this.ptr, alignSelf);
  }

  getAlignSelf(): number {
    return yg.ygNodeStyleGetAlignSelf(this.ptr);
  }

  setPositionType(positionType: number): void {
    yg.ygNodeStyleSetPositionType(this.ptr, positionType);
  }

  getPositionType(): number {
    return yg.ygNodeStyleGetPositionType(this.ptr);
  }

  setFlexWrap(flexWrap: number): void {
    yg.ygNodeStyleSetFlexWrap(this.ptr, flexWrap);
  }

  getFlexWrap(): number {
    return yg.ygNodeStyleGetFlexWrap(this.ptr);
  }

  setOverflow(overflow: number): void {
    yg.ygNodeStyleSetOverflow(this.ptr, overflow);
  }

  getOverflow(): number {
    return yg.ygNodeStyleGetOverflow(this.ptr);
  }

  setDisplay(display: number): void {
    yg.ygNodeStyleSetDisplay(this.ptr, display);
  }

  getDisplay(): number {
    return yg.ygNodeStyleGetDisplay(this.ptr);
  }

  setFlex(flex: number): void {
    yg.ygNodeStyleSetFlex(this.ptr, flex);
  }

  getFlex(): number {
    return yg.ygNodeStyleGetFlex(this.ptr);
  }

  setFlexGrow(flexGrow: number): void {
    yg.ygNodeStyleSetFlexGrow(this.ptr, flexGrow);
  }

  getFlexGrow(): number {
    return yg.ygNodeStyleGetFlexGrow(this.ptr);
  }

  setFlexShrink(flexShrink: number): void {
    yg.ygNodeStyleSetFlexShrink(this.ptr, flexShrink);
  }

  getFlexShrink(): number {
    return yg.ygNodeStyleGetFlexShrink(this.ptr);
  }

  setFlexBasis(flexBasis: number | "auto"): void {
    if (flexBasis === "auto") {
      yg.ygNodeStyleSetFlexBasisAuto(this.ptr);
    } else {
      yg.ygNodeStyleSetFlexBasis(this.ptr, flexBasis);
    }
  }

  setFlexBasisPercent(flexBasis: number): void {
    yg.ygNodeStyleSetFlexBasisPercent(this.ptr, flexBasis);
  }

  setFlexBasisAuto(): void {
    yg.ygNodeStyleSetFlexBasisAuto(this.ptr);
  }

  setPosition(edge: number, position: number): void {
    yg.ygNodeStyleSetPosition(this.ptr, edge, position);
  }

  setPositionPercent(edge: number, position: number): void {
    yg.ygNodeStyleSetPositionPercent(this.ptr, edge, position);
  }

  setPositionAuto(edge: number): void {
    yg.ygNodeStyleSetPositionAuto(this.ptr, edge);
  }

  setMargin(edge: number, margin: number): void {
    yg.ygNodeStyleSetMargin(this.ptr, edge, margin);
  }

  setMarginPercent(edge: number, margin: number): void {
    yg.ygNodeStyleSetMarginPercent(this.ptr, edge, margin);
  }

  setMarginAuto(edge: number): void {
    yg.ygNodeStyleSetMarginAuto(this.ptr, edge);
  }

  setPadding(edge: number, padding: number): void {
    yg.ygNodeStyleSetPadding(this.ptr, edge, padding);
  }

  setPaddingPercent(edge: number, padding: number): void {
    yg.ygNodeStyleSetPaddingPercent(this.ptr, edge, padding);
  }

  setBorder(edge: number, border: number): void {
    yg.ygNodeStyleSetBorder(this.ptr, edge, border);
  }

  getBorder(edge: number): number {
    return yg.ygNodeStyleGetBorder(this.ptr, edge);
  }

  setGap(gutter: number, gap: number): void {
    yg.ygNodeStyleSetGap(this.ptr, gutter, gap);
  }

  setGapPercent(gutter: number, gap: number): void {
    yg.ygNodeStyleSetGapPercent(this.ptr, gutter, gap);
  }

  setWidth(width: number | "auto"): void {
    if (width === "auto") {
      yg.ygNodeStyleSetWidthAuto(this.ptr);
    } else {
      yg.ygNodeStyleSetWidth(this.ptr, width);
    }
  }

  setWidthPercent(width: number): void {
    yg.ygNodeStyleSetWidthPercent(this.ptr, width);
  }

  setWidthAuto(): void {
    yg.ygNodeStyleSetWidthAuto(this.ptr);
  }

  setHeight(height: number | "auto"): void {
    if (height === "auto") {
      yg.ygNodeStyleSetHeightAuto(this.ptr);
    } else {
      yg.ygNodeStyleSetHeight(this.ptr, height);
    }
  }

  setHeightPercent(height: number): void {
    yg.ygNodeStyleSetHeightPercent(this.ptr, height);
  }

  setHeightAuto(): void {
    yg.ygNodeStyleSetHeightAuto(this.ptr);
  }

  setMinWidth(minWidth: number): void {
    yg.ygNodeStyleSetMinWidth(this.ptr, minWidth);
  }

  setMinWidthPercent(minWidth: number): void {
    yg.ygNodeStyleSetMinWidthPercent(this.ptr, minWidth);
  }

  setMinHeight(minHeight: number): void {
    yg.ygNodeStyleSetMinHeight(this.ptr, minHeight);
  }

  setMinHeightPercent(minHeight: number): void {
    yg.ygNodeStyleSetMinHeightPercent(this.ptr, minHeight);
  }

  setMaxWidth(maxWidth: number): void {
    yg.ygNodeStyleSetMaxWidth(this.ptr, maxWidth);
  }

  setMaxWidthPercent(maxWidth: number): void {
    yg.ygNodeStyleSetMaxWidthPercent(this.ptr, maxWidth);
  }

  setMaxHeight(maxHeight: number): void {
    yg.ygNodeStyleSetMaxHeight(this.ptr, maxHeight);
  }

  setMaxHeightPercent(maxHeight: number): void {
    yg.ygNodeStyleSetMaxHeightPercent(this.ptr, maxHeight);
  }

  setAspectRatio(aspectRatio: number): void {
    yg.ygNodeStyleSetAspectRatio(this.ptr, aspectRatio);
  }

  getAspectRatio(): number {
    return yg.ygNodeStyleGetAspectRatio(this.ptr);
  }

  // Callback functions
  setMeasureFunc(measureFunc: MeasureFunction | null): void {
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
          const result = measureFunc(width, widthMode, height, heightMode);
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
    if (this.measureCallback) {
      this.measureCallback.close();
      this.measureCallback = null;
    }
    yg.ygNodeUnsetMeasureFuncTrampoline(this.ptr);
  }

  hasMeasureFunc(): boolean {
    return yg.ygNodeHasMeasureFunc(this.ptr);
  }

  setBaselineFunc(baselineFunc: BaselineFunction | null): void {
    this.unsetBaselineFunc(); // Clean up existing callback

    if (baselineFunc) {
      // Create a JSCallback that matches Yoga's expected baseline function signature
      this.baselineCallback = new JSCallback(
        (nodePtr: Pointer, width: number, height: number) => {
          return baselineFunc(width, height);
        },
        {
          args: [FFIType.ptr, FFIType.f32, FFIType.f32],
          returns: FFIType.f32,
        }
      );

      if (this.baselineCallback.ptr) {
        yg.ygNodeSetBaselineFunc(this.ptr, this.baselineCallback.ptr);
      }
    }
  }

  unsetBaselineFunc(): void {
    if (this.baselineCallback) {
      this.baselineCallback.close();
      this.baselineCallback = null;
    }
    yg.ygNodeUnsetBaselineFunc(this.ptr);
  }

  hasBaselineFunc(): boolean {
    return yg.ygNodeHasBaselineFunc(this.ptr);
  }

  setDirtiedFunc(dirtiedFunc: DirtiedFunction | null): void {
    this.unsetDirtiedFunc(); // Clean up existing callback

    if (dirtiedFunc) {
      // Create a JSCallback that matches Yoga's expected dirtied function signature
      this.dirtiedCallback = new JSCallback(
        (nodePtr: Pointer) => {
          dirtiedFunc();
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
    if (this.dirtiedCallback) {
      this.dirtiedCallback.close();
      this.dirtiedCallback = null;
    }
    yg.ygNodeUnsetDirtiedFunc(this.ptr);
  }

  hasDirtiedFunc(): boolean {
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
