import { arch, platform } from "os";

function loadNativeModule() {
  // Try development path first
  try {
    return require("../zig-out/lib/yoga.node");
  } catch {}

  // Load platform-specific dist path
  // Using template literal to prevent Bun from static analysis (causes crash on Windows)
  const p = platform();
  const a = arch();
  let target: string;

  if (p === "darwin") target = a === "arm64" ? "darwin-arm64" : "darwin-x64";
  else if (p === "linux") target = a === "arm64" ? "linux-arm64" : "linux-x64";
  else if (p === "win32") target = "windows-x64";
  else throw new Error(`Unsupported platform: ${p}-${a}`);

  // Template literal prevents static analysis but still loads the right binary
  return require(`../dist/${target}/yoga.node`);
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

// Load the native module
const yg = loadNativeModule();

// Native pointer type (opaque object from napigen)
type NativePtr = object;

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
  private ptr: NativePtr;
  private _freed: boolean = false;

  private constructor(ptr: NativePtr) {
    this.ptr = ptr;
  }

  /** Check if the node has been freed */
  isFreed(): boolean {
    return this._freed;
  }

  /** Assert that the node has not been freed, throwing an error if it has */
  private assertNotFreed(): void {
    if (this._freed) {
      throw new Error("Cannot access freed Yoga node");
    }
  }

  static create(config?: Config): Node {
    const ptr = config
      ? yg.nodeNewWithConfig(config["ptr"])
      : yg.nodeNew();
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
    yg.nodeFree(this.ptr);
    this._freed = true;
  }

  freeRecursive(): void {
    if (this._freed) return; // Already freed, no-op
    yg.nodeFreeRecursive(this.ptr);
    this._freed = true;
  }

  reset(): void {
    this.assertNotFreed();
    yg.nodeReset(this.ptr);
  }

  clone(): Node {
    this.assertNotFreed();
    const ptr = yg.nodeClone(this.ptr);
    if (!ptr) throw new Error("Failed to clone node");
    return new Node(ptr);
  }

  copyStyle(node: Node): void {
    this.assertNotFreed();
    yg.nodeCopyStyle(this.ptr, node.ptr);
  }

  setIsReferenceBaseline(isReferenceBaseline: boolean): void {
    this.assertNotFreed();
    yg.nodeSetIsReferenceBaseline(this.ptr, isReferenceBaseline);
  }

  isReferenceBaseline(): boolean {
    this.assertNotFreed();
    return yg.nodeIsReferenceBaseline(this.ptr);
  }

  setAlwaysFormsContainingBlock(alwaysFormsContainingBlock: boolean): void {
    this.assertNotFreed();
    yg.nodeSetAlwaysFormsContainingBlock(this.ptr, alwaysFormsContainingBlock);
  }

  // Hierarchy
  insertChild(child: Node, index: number): void {
    this.assertNotFreed();
    yg.nodeInsertChild(this.ptr, child.ptr, index);
  }

  removeChild(child: Node): void {
    this.assertNotFreed();
    yg.nodeRemoveChild(this.ptr, child.ptr);
  }

  removeAllChildren(): void {
    this.assertNotFreed();
    yg.nodeRemoveAllChildren(this.ptr);
  }

  getChild(index: number): Node | null {
    this.assertNotFreed();
    const ptr = yg.nodeGetChild(this.ptr, index);
    return ptr ? new Node(ptr) : null;
  }

  getChildCount(): number {
    this.assertNotFreed();
    return yg.nodeGetChildCount(this.ptr);
  }

  getParent(): Node | null {
    this.assertNotFreed();
    const ptr = yg.nodeGetParent(this.ptr);
    return ptr ? new Node(ptr) : null;
  }

  // Layout
  calculateLayout(
    width?: number | "auto",
    height?: number | "auto",
    direction: number = Direction.LTR
  ): void {
    this.assertNotFreed();
    const w = width === "auto" || width === undefined ? NaN : width;
    const h = height === "auto" || height === undefined ? NaN : height;
    yg.nodeCalculateLayout(this.ptr, w, h, direction);
  }

  hasNewLayout(): boolean {
    this.assertNotFreed();
    return yg.nodeGetHasNewLayout(this.ptr);
  }

  markLayoutSeen(): void {
    this.assertNotFreed();
    yg.nodeSetHasNewLayout(this.ptr, false);
  }

  markDirty(): void {
    this.assertNotFreed();
    yg.nodeMarkDirty(this.ptr);
  }

  isDirty(): boolean {
    this.assertNotFreed();
    return yg.nodeIsDirty(this.ptr);
  }

  // Layout results
  getComputedLayout() {
    this.assertNotFreed();
    return {
      left: yg.nodeLayoutGetLeft(this.ptr),
      top: yg.nodeLayoutGetTop(this.ptr),
      right: yg.nodeLayoutGetRight(this.ptr),
      bottom: yg.nodeLayoutGetBottom(this.ptr),
      width: yg.nodeLayoutGetWidth(this.ptr),
      height: yg.nodeLayoutGetHeight(this.ptr),
    };
  }

  getComputedLeft(): number {
    this.assertNotFreed();
    return yg.nodeLayoutGetLeft(this.ptr);
  }

  getComputedTop(): number {
    this.assertNotFreed();
    return yg.nodeLayoutGetTop(this.ptr);
  }

  getComputedRight(): number {
    this.assertNotFreed();
    return yg.nodeLayoutGetRight(this.ptr);
  }

  getComputedBottom(): number {
    this.assertNotFreed();
    return yg.nodeLayoutGetBottom(this.ptr);
  }

  getComputedWidth(): number {
    this.assertNotFreed();
    return yg.nodeLayoutGetWidth(this.ptr);
  }

  getComputedHeight(): number {
    this.assertNotFreed();
    return yg.nodeLayoutGetHeight(this.ptr);
  }

  getComputedBorder(edge: number): number {
    this.assertNotFreed();
    return yg.nodeLayoutGetBorder(this.ptr, edge);
  }

  getComputedMargin(edge: number): number {
    this.assertNotFreed();
    return yg.nodeLayoutGetMargin(this.ptr, edge);
  }

  getComputedPadding(edge: number): number {
    this.assertNotFreed();
    return yg.nodeLayoutGetPadding(this.ptr, edge);
  }

  // Style setters
  setDirection(direction: Direction): void {
    this.assertNotFreed();
    yg.nodeStyleSetDirection(this.ptr, direction);
  }

  getDirection(): Direction {
    this.assertNotFreed();
    return yg.nodeStyleGetDirection(this.ptr) as Direction;
  }

  setFlexDirection(flexDirection: FlexDirection): void {
    this.assertNotFreed();
    yg.nodeStyleSetFlexDirection(this.ptr, flexDirection);
  }

  getFlexDirection(): FlexDirection {
    this.assertNotFreed();
    return yg.nodeStyleGetFlexDirection(this.ptr) as FlexDirection;
  }

  setJustifyContent(justifyContent: Justify): void {
    this.assertNotFreed();
    yg.nodeStyleSetJustifyContent(this.ptr, justifyContent);
  }

  getJustifyContent(): Justify {
    this.assertNotFreed();
    return yg.nodeStyleGetJustifyContent(this.ptr) as Justify;
  }

  setAlignContent(alignContent: Align): void {
    this.assertNotFreed();
    yg.nodeStyleSetAlignContent(this.ptr, alignContent);
  }

  getAlignContent(): Align {
    this.assertNotFreed();
    return yg.nodeStyleGetAlignContent(this.ptr) as Align;
  }

  setAlignItems(alignItems: Align): void {
    this.assertNotFreed();
    yg.nodeStyleSetAlignItems(this.ptr, alignItems);
  }

  getAlignItems(): Align {
    this.assertNotFreed();
    return yg.nodeStyleGetAlignItems(this.ptr) as Align;
  }

  setAlignSelf(alignSelf: Align): void {
    this.assertNotFreed();
    yg.nodeStyleSetAlignSelf(this.ptr, alignSelf);
  }

  getAlignSelf(): Align {
    this.assertNotFreed();
    return yg.nodeStyleGetAlignSelf(this.ptr) as Align;
  }

  setPositionType(positionType: PositionType): void {
    this.assertNotFreed();
    yg.nodeStyleSetPositionType(this.ptr, positionType);
  }

  getPositionType(): PositionType {
    this.assertNotFreed();
    return yg.nodeStyleGetPositionType(this.ptr) as PositionType;
  }

  setFlexWrap(flexWrap: Wrap): void {
    this.assertNotFreed();
    yg.nodeStyleSetFlexWrap(this.ptr, flexWrap);
  }

  getFlexWrap(): Wrap {
    this.assertNotFreed();
    return yg.nodeStyleGetFlexWrap(this.ptr) as Wrap;
  }

  setOverflow(overflow: Overflow): void {
    this.assertNotFreed();
    yg.nodeStyleSetOverflow(this.ptr, overflow);
  }

  getOverflow(): Overflow {
    this.assertNotFreed();
    return yg.nodeStyleGetOverflow(this.ptr) as Overflow;
  }

  setDisplay(display: Display): void {
    this.assertNotFreed();
    yg.nodeStyleSetDisplay(this.ptr, display);
  }

  getDisplay(): Display {
    this.assertNotFreed();
    return yg.nodeStyleGetDisplay(this.ptr) as Display;
  }

  setBoxSizing(boxSizing: BoxSizing): void {
    this.assertNotFreed();
    yg.nodeStyleSetBoxSizing(this.ptr, boxSizing);
  }

  getBoxSizing(): BoxSizing {
    this.assertNotFreed();
    return yg.nodeStyleGetBoxSizing(this.ptr) as BoxSizing;
  }

  setFlex(flex: number): void {
    this.assertNotFreed();
    yg.nodeStyleSetFlex(this.ptr, flex);
  }

  getFlex(): number {
    this.assertNotFreed();
    return yg.nodeStyleGetFlex(this.ptr);
  }

  setFlexGrow(flexGrow: number): void {
    this.assertNotFreed();
    yg.nodeStyleSetFlexGrow(this.ptr, flexGrow);
  }

  getFlexGrow(): number {
    this.assertNotFreed();
    return yg.nodeStyleGetFlexGrow(this.ptr);
  }

  setFlexShrink(flexShrink: number): void {
    this.assertNotFreed();
    yg.nodeStyleSetFlexShrink(this.ptr, flexShrink);
  }

  getFlexShrink(): number {
    this.assertNotFreed();
    return yg.nodeStyleGetFlexShrink(this.ptr);
  }

  setFlexBasis(flexBasis: number | "auto" | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(flexBasis);
    if (unit === Unit.Auto) {
      yg.nodeStyleSetFlexBasisAuto(this.ptr);
    } else if (unit === Unit.Percent) {
      yg.nodeStyleSetFlexBasisPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetFlexBasis(this.ptr, asNumber);
    }
  }

  setFlexBasisPercent(flexBasis: number | undefined): void {
    this.assertNotFreed();
    if (flexBasis !== undefined) {
      yg.nodeStyleSetFlexBasisPercent(this.ptr, flexBasis);
    }
  }

  setFlexBasisAuto(): void {
    this.assertNotFreed();
    yg.nodeStyleSetFlexBasisAuto(this.ptr);
  }

  setPosition(edge: Edge, position: number | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(position);
    if (unit === Unit.Percent) {
      yg.nodeStyleSetPositionPercent(this.ptr, edge, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetPosition(this.ptr, edge, asNumber);
    }
  }

  setPositionPercent(edge: Edge, position: number | undefined): void {
    this.assertNotFreed();
    if (position !== undefined) {
      yg.nodeStyleSetPositionPercent(this.ptr, edge, position);
    }
  }

  setPositionAuto(edge: Edge): void {
    this.assertNotFreed();
    yg.nodeStyleSetPositionAuto(this.ptr, edge);
  }

  setMargin(
    edge: Edge,
    margin: number | "auto" | `${number}%` | undefined
  ): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(margin);
    if (unit === Unit.Auto) {
      yg.nodeStyleSetMarginAuto(this.ptr, edge);
    } else if (unit === Unit.Percent) {
      yg.nodeStyleSetMarginPercent(this.ptr, edge, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetMargin(this.ptr, edge, asNumber);
    }
  }

  setMarginPercent(edge: Edge, margin: number | undefined): void {
    this.assertNotFreed();
    if (margin !== undefined) {
      yg.nodeStyleSetMarginPercent(this.ptr, edge, margin);
    }
  }

  setMarginAuto(edge: Edge): void {
    this.assertNotFreed();
    yg.nodeStyleSetMarginAuto(this.ptr, edge);
  }

  setPadding(edge: Edge, padding: number | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(padding);
    if (unit === Unit.Percent) {
      yg.nodeStyleSetPaddingPercent(this.ptr, edge, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetPadding(this.ptr, edge, asNumber);
    }
  }

  setPaddingPercent(edge: Edge, padding: number | undefined): void {
    this.assertNotFreed();
    if (padding !== undefined) {
      yg.nodeStyleSetPaddingPercent(this.ptr, edge, padding);
    }
  }

  setBorder(edge: Edge, border: number | undefined): void {
    this.assertNotFreed();
    if (border !== undefined) {
      yg.nodeStyleSetBorder(this.ptr, edge, border);
    }
  }

  getBorder(edge: Edge): number {
    this.assertNotFreed();
    return yg.nodeStyleGetBorder(this.ptr, edge);
  }

  setGap(gutter: Gutter, gap: number | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(gap);
    if (unit === Unit.Percent) {
      yg.nodeStyleSetGapPercent(this.ptr, gutter, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetGap(this.ptr, gutter, asNumber);
    }
  }

  setGapPercent(gutter: Gutter, gap: number | undefined): void {
    this.assertNotFreed();
    if (gap !== undefined) {
      yg.nodeStyleSetGapPercent(this.ptr, gutter, gap);
    }
  }

  setWidth(width: number | "auto" | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(width);
    if (unit === Unit.Auto) {
      yg.nodeStyleSetWidthAuto(this.ptr);
    } else if (unit === Unit.Percent) {
      yg.nodeStyleSetWidthPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetWidth(this.ptr, asNumber);
    }
  }

  setWidthPercent(width: number | undefined): void {
    this.assertNotFreed();
    if (width !== undefined) {
      yg.nodeStyleSetWidthPercent(this.ptr, width);
    }
  }

  setWidthAuto(): void {
    this.assertNotFreed();
    yg.nodeStyleSetWidthAuto(this.ptr);
  }

  setHeight(height: number | "auto" | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(height);
    if (unit === Unit.Auto) {
      yg.nodeStyleSetHeightAuto(this.ptr);
    } else if (unit === Unit.Percent) {
      yg.nodeStyleSetHeightPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetHeight(this.ptr, asNumber);
    }
  }

  setHeightPercent(height: number | undefined): void {
    this.assertNotFreed();
    if (height !== undefined) {
      yg.nodeStyleSetHeightPercent(this.ptr, height);
    }
  }

  setHeightAuto(): void {
    this.assertNotFreed();
    yg.nodeStyleSetHeightAuto(this.ptr);
  }

  setMinWidth(minWidth: number | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(minWidth);
    if (unit === Unit.Percent) {
      yg.nodeStyleSetMinWidthPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetMinWidth(this.ptr, asNumber);
    }
  }

  setMinWidthPercent(minWidth: number | undefined): void {
    this.assertNotFreed();
    if (minWidth !== undefined) {
      yg.nodeStyleSetMinWidthPercent(this.ptr, minWidth);
    }
  }

  setMinHeight(minHeight: number | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(minHeight);
    if (unit === Unit.Percent) {
      yg.nodeStyleSetMinHeightPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetMinHeight(this.ptr, asNumber);
    }
  }

  setMinHeightPercent(minHeight: number | undefined): void {
    this.assertNotFreed();
    if (minHeight !== undefined) {
      yg.nodeStyleSetMinHeightPercent(this.ptr, minHeight);
    }
  }

  setMaxWidth(maxWidth: number | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(maxWidth);
    if (unit === Unit.Percent) {
      yg.nodeStyleSetMaxWidthPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetMaxWidth(this.ptr, asNumber);
    }
  }

  setMaxWidthPercent(maxWidth: number | undefined): void {
    this.assertNotFreed();
    if (maxWidth !== undefined) {
      yg.nodeStyleSetMaxWidthPercent(this.ptr, maxWidth);
    }
  }

  setMaxHeight(maxHeight: number | `${number}%` | undefined): void {
    this.assertNotFreed();
    const { unit, asNumber } = parseValue(maxHeight);
    if (unit === Unit.Percent) {
      yg.nodeStyleSetMaxHeightPercent(this.ptr, asNumber!);
    } else if (unit === Unit.Point && asNumber !== undefined) {
      yg.nodeStyleSetMaxHeight(this.ptr, asNumber);
    }
  }

  setMaxHeightPercent(maxHeight: number | undefined): void {
    this.assertNotFreed();
    if (maxHeight !== undefined) {
      yg.nodeStyleSetMaxHeightPercent(this.ptr, maxHeight);
    }
  }

  setAspectRatio(aspectRatio: number | undefined): void {
    this.assertNotFreed();
    if (aspectRatio !== undefined) {
      yg.nodeStyleSetAspectRatio(this.ptr, aspectRatio);
    }
  }

  getAspectRatio(): number {
    this.assertNotFreed();
    return yg.nodeStyleGetAspectRatio(this.ptr);
  }

  // Value getters (return {unit, value} like yoga-layout)
  getWidth(): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetWidth(this.ptr);
  }

  getHeight(): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetHeight(this.ptr);
  }

  getMinWidth(): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetMinWidth(this.ptr);
  }

  getMinHeight(): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetMinHeight(this.ptr);
  }

  getMaxWidth(): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetMaxWidth(this.ptr);
  }

  getMaxHeight(): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetMaxHeight(this.ptr);
  }

  getMargin(edge: Edge): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetMargin(this.ptr, edge);
  }

  getPadding(edge: Edge): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetPadding(this.ptr, edge);
  }

  getPosition(edge: Edge): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetPosition(this.ptr, edge);
  }

  getGap(gutter: Gutter): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetGap(this.ptr, gutter);
  }

  getFlexBasis(): Value {
    this.assertNotFreed();
    return yg.nodeStyleGetFlexBasis(this.ptr);
  }

  // Callback functions
  setMeasureFunc(measureFunc: MeasureFunction | null): void {
    this.assertNotFreed();
    if (measureFunc) {
      yg.nodeSetMeasureFunc(this.ptr, measureFunc);
    } else {
      yg.nodeUnsetMeasureFunc(this.ptr);
    }
  }

  unsetMeasureFunc(): void {
    if (this._freed) return;
    yg.nodeUnsetMeasureFunc(this.ptr);
  }

  hasMeasureFunc(): boolean {
    this.assertNotFreed();
    return yg.nodeHasMeasureFunc(this.ptr);
  }

  setBaselineFunc(baselineFunc: BaselineFunction | null): void {
    this.assertNotFreed();
    if (baselineFunc) {
      yg.nodeSetBaselineFunc(this.ptr, baselineFunc);
    } else {
      yg.nodeUnsetBaselineFunc(this.ptr);
    }
  }

  unsetBaselineFunc(): void {
    if (this._freed) return;
    yg.nodeUnsetBaselineFunc(this.ptr);
  }

  hasBaselineFunc(): boolean {
    this.assertNotFreed();
    return yg.nodeHasBaselineFunc(this.ptr);
  }

  setDirtiedFunc(dirtiedFunc: DirtiedFunction | null): void {
    this.assertNotFreed();
    if (dirtiedFunc) {
      // Wrap callback to pass this node instance
      const node = this;
      yg.nodeSetDirtiedFunc(this.ptr, () => dirtiedFunc(node));
    } else {
      yg.nodeUnsetDirtiedFunc(this.ptr);
    }
  }

  unsetDirtiedFunc(): void {
    if (this._freed) return;
    yg.nodeUnsetDirtiedFunc(this.ptr);
  }

  hasDirtiedFunc(): boolean {
    this.assertNotFreed();
    return yg.nodeHasDirtiedFunc(this.ptr);
  }
}

// ============================================================================
// Config class
// ============================================================================

export class Config {
  private ptr: NativePtr;

  private constructor(ptr: NativePtr) {
    this.ptr = ptr;
  }

  static create(): Config {
    const ptr = yg.configNew();
    if (!ptr) throw new Error("Failed to create config");
    return new Config(ptr);
  }

  static destroy(config: Config): void {
    config.free();
  }

  free(): void {
    yg.configFree(this.ptr);
  }

  setUseWebDefaults(useWebDefaults: boolean): void {
    yg.configSetUseWebDefaults(this.ptr, useWebDefaults);
  }

  useWebDefaults(): boolean {
    return yg.configGetUseWebDefaults(this.ptr);
  }

  setPointScaleFactor(pointScaleFactor: number): void {
    yg.configSetPointScaleFactor(this.ptr, pointScaleFactor);
  }

  getPointScaleFactor(): number {
    return yg.configGetPointScaleFactor(this.ptr);
  }

  setErrata(errata: Errata): void {
    yg.configSetErrata(this.ptr, errata);
  }

  getErrata(): Errata {
    return yg.configGetErrata(this.ptr) as Errata;
  }

  setExperimentalFeatureEnabled(
    feature: ExperimentalFeature,
    enabled: boolean
  ): void {
    yg.configSetExperimentalFeatureEnabled(this.ptr, feature, enabled);
  }

  isExperimentalFeatureEnabled(feature: ExperimentalFeature): boolean {
    return yg.configIsExperimentalFeatureEnabled(this.ptr, feature);
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
