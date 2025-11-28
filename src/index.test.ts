import { expect, test, describe } from "bun:test";
import Yoga, {
  Node,
  Config,
  MeasureMode,
  Direction,
  FlexDirection,
  Edge,
  Align,
  BoxSizing,
  Errata,
  ExperimentalFeature,
  Gutter,
} from "./index";

describe("Node", () => {
  test("create and free", () => {
    const node = Node.create();
    expect(node).toBeDefined();
    node.free();
  });

  test("create with config", () => {
    const config = Config.create();
    const node = Node.create(config);
    expect(node).toBeDefined();
    node.free();
    config.free();
  });

  test("basic layout", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(100);
    root.setFlexDirection(FlexDirection.Row);

    const child1 = Node.create();
    child1.setFlexGrow(1);
    root.insertChild(child1, 0);

    const child2 = Node.create();
    child2.setFlexGrow(1);
    root.insertChild(child2, 1);

    root.calculateLayout(100, 100, Direction.LTR);

    const layout = root.getComputedLayout();
    expect(layout.width).toBe(100);
    expect(layout.height).toBe(100);

    expect(child1.getComputedWidth()).toBe(50);
    expect(child2.getComputedWidth()).toBe(50);

    root.freeRecursive();
  });
});

describe("MeasureFunc", () => {
  test("setMeasureFunc and hasMeasureFunc", () => {
    const node = Node.create();

    expect(node.hasMeasureFunc()).toBe(false);

    node.setMeasureFunc((width, widthMode, height, heightMode) => {
      return { width: 100, height: 50 };
    });

    expect(node.hasMeasureFunc()).toBe(true);

    node.unsetMeasureFunc();
    expect(node.hasMeasureFunc()).toBe(false);

    node.free();
  });

  test("measure function is called during layout", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(200);

    const child = Node.create();
    // Prevent default stretch behavior so child uses measured size
    child.setAlignSelf(Align.FlexStart);
    let measureCalled = false;

    child.setMeasureFunc((width, widthMode, height, heightMode) => {
      measureCalled = true;
      return { width: 50, height: 25 };
    });

    root.insertChild(child, 0);
    root.calculateLayout(200, 200, Direction.LTR);

    expect(measureCalled).toBe(true);
    expect(child.getComputedWidth()).toBe(50);
    expect(child.getComputedHeight()).toBe(25);

    root.freeRecursive();
  });

  test("measure function receives correct modes", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setFlexDirection(FlexDirection.Row);

    const child = Node.create();
    // Don't use flexGrow - let child determine its own size via measure
    child.setAlignSelf(Align.FlexStart);

    let receivedWidthMode = -1;
    let receivedHeightMode = -1;

    child.setMeasureFunc((width, widthMode, height, heightMode) => {
      receivedWidthMode = widthMode;
      receivedHeightMode = heightMode;
      return { width: 50, height: 30 };
    });

    root.insertChild(child, 0);
    root.calculateLayout(100, undefined, Direction.LTR);

    // Width should be AtMost because parent has fixed width
    expect(receivedWidthMode).toBe(MeasureMode.AtMost);
    // Height should be Undefined because no height constraint
    expect(receivedHeightMode).toBe(MeasureMode.Undefined);

    root.freeRecursive();
  });
});

describe("DirtiedFunc", () => {
  test("setDirtiedFunc callback is called", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(100);

    let dirtiedCalled = false;

    // Only nodes with measure function can be marked dirty
    root.setMeasureFunc(() => ({ width: 100, height: 100 }));
    
    // Must calculate layout first so node becomes "clean"
    // Dirtied callback only fires when transitioning from clean to dirty
    root.calculateLayout(100, 100, Direction.LTR);
    
    root.setDirtiedFunc(() => {
      dirtiedCalled = true;
    });

    root.markDirty();

    expect(dirtiedCalled).toBe(true);

    root.free();
  });
});

describe("Margins, Padding, Border", () => {
  test("margins affect layout", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(100);
    root.setFlexDirection(FlexDirection.Column);

    const child = Node.create();
    child.setWidth(50);
    child.setHeight(50);
    child.setMargin(Edge.Left, 10);
    child.setMargin(Edge.Top, 5);

    root.insertChild(child, 0);
    root.calculateLayout(100, 100, Direction.LTR);

    expect(child.getComputedLeft()).toBe(10);
    expect(child.getComputedTop()).toBe(5);

    root.freeRecursive();
  });

  test("padding affects children", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(100);
    root.setPadding(Edge.All, 10);

    const child = Node.create();
    child.setWidth(50);
    child.setHeight(50);

    root.insertChild(child, 0);
    root.calculateLayout(100, 100, Direction.LTR);

    expect(child.getComputedLeft()).toBe(10);
    expect(child.getComputedTop()).toBe(10);

    root.freeRecursive();
  });

  test("border affects layout", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(100);
    root.setBorder(Edge.All, 5);

    const child = Node.create();
    child.setFlexGrow(1);

    root.insertChild(child, 0);
    root.calculateLayout(100, 100, Direction.LTR);

    // Child should be offset by border
    expect(child.getComputedLeft()).toBe(5);
    expect(child.getComputedTop()).toBe(5);
    // Child should be smaller due to borders
    expect(child.getComputedWidth()).toBe(90);
    expect(child.getComputedHeight()).toBe(90);

    root.freeRecursive();
  });
});

describe("BaselineFunc", () => {
  test("setBaselineFunc callback affects layout", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(100);
    root.setFlexDirection(FlexDirection.Row);
    root.setAlignItems(Align.Baseline);

    const child1 = Node.create();
    child1.setWidth(50);
    child1.setHeight(40);
    let baselineCalled = false;
    child1.setBaselineFunc((width, height) => {
      baselineCalled = true;
      return 30; // baseline at 30px from top
    });

    const child2 = Node.create();
    child2.setWidth(50);
    child2.setHeight(60);

    root.insertChild(child1, 0);
    root.insertChild(child2, 1);
    root.calculateLayout(200, 100, Direction.LTR);

    expect(baselineCalled).toBe(true);
    // child1 should be offset down to align its baseline (30px) with child2's baseline
    expect(child1.getComputedTop()).toBe(30);
    expect(child2.getComputedTop()).toBe(0);

    root.freeRecursive();
  });
});

describe("Gap", () => {
  test("row gap", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(100);
    root.setFlexDirection(FlexDirection.Column);
    root.setGap(Gutter.Row, 10);

    const child1 = Node.create();
    child1.setHeight(20);
    root.insertChild(child1, 0);

    const child2 = Node.create();
    child2.setHeight(20);
    root.insertChild(child2, 1);

    root.calculateLayout(100, 100, Direction.LTR);

    expect(child1.getComputedTop()).toBe(0);
    expect(child2.getComputedTop()).toBe(30); // 20 + 10 gap

    root.freeRecursive();
  });
});

describe("Percent values", () => {
  test("setWidth with percent string", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(100);

    const child = Node.create();
    child.setWidth("50%");
    child.setHeight(50);

    root.insertChild(child, 0);
    root.calculateLayout(200, 100, Direction.LTR);

    expect(child.getComputedWidth()).toBe(100); // 50% of 200

    root.freeRecursive();
  });

  test("setHeight with percent string", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(200);

    const child = Node.create();
    child.setWidth(50);
    child.setHeight("25%");

    root.insertChild(child, 0);
    root.calculateLayout(100, 200, Direction.LTR);

    expect(child.getComputedHeight()).toBe(50); // 25% of 200

    root.freeRecursive();
  });

  test("setMargin with auto", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(100);
    root.setFlexDirection(FlexDirection.Row);
    root.setJustifyContent(Yoga.Justify.FlexStart);

    const child = Node.create();
    child.setWidth(50);
    child.setHeight(50);
    child.setMargin(Edge.Left, "auto");

    root.insertChild(child, 0);
    root.calculateLayout(200, 100, Direction.LTR);

    // With auto margin, child should be pushed to the right
    expect(child.getComputedLeft()).toBe(150); // 200 - 50

    root.freeRecursive();
  });

  test("setMargin with percent string", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(100);

    const child = Node.create();
    child.setWidth(50);
    child.setHeight(50);
    child.setMargin(Edge.Left, "10%");

    root.insertChild(child, 0);
    root.calculateLayout(200, 100, Direction.LTR);

    expect(child.getComputedLeft()).toBe(20); // 10% of 200

    root.freeRecursive();
  });

  test("setPadding with percent string", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(100);
    root.setPadding(Edge.All, "10%");

    const child = Node.create();
    child.setFlexGrow(1);

    root.insertChild(child, 0);
    root.calculateLayout(200, 100, Direction.LTR);

    // Padding percent is based on width dimension in CSS/Yoga
    // 10% of 200 = 20 on all sides
    expect(child.getComputedLeft()).toBe(20);
    expect(child.getComputedTop()).toBe(20);
    expect(child.getComputedWidth()).toBe(160); // 200 - 20 - 20
    expect(child.getComputedHeight()).toBe(60); // 100 - 20 - 20

    root.freeRecursive();
  });

  test("setFlexBasis with percent string", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(100);
    root.setFlexDirection(FlexDirection.Row);

    const child = Node.create();
    child.setFlexBasis("50%");

    root.insertChild(child, 0);
    root.calculateLayout(200, 100, Direction.LTR);

    expect(child.getComputedWidth()).toBe(100); // 50% of 200

    root.freeRecursive();
  });

  test("setGap with percent string", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(200);
    root.setFlexDirection(FlexDirection.Column);
    root.setGap(Gutter.Row, "10%");

    const child1 = Node.create();
    child1.setHeight(50);
    root.insertChild(child1, 0);

    const child2 = Node.create();
    child2.setHeight(50);
    root.insertChild(child2, 1);

    root.calculateLayout(100, 200, Direction.LTR);

    expect(child1.getComputedTop()).toBe(0);
    expect(child2.getComputedTop()).toBe(70); // 50 + 10% of 200 = 50 + 20

    root.freeRecursive();
  });

  test("setMinWidth and setMaxWidth with percent", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(100);

    const child = Node.create();
    child.setMinWidth("25%");
    child.setMaxWidth("75%");
    child.setWidth("100%");
    child.setHeight(50);

    root.insertChild(child, 0);
    root.calculateLayout(200, 100, Direction.LTR);

    // Width should be capped at maxWidth (75% of 200 = 150)
    expect(child.getComputedWidth()).toBe(150);

    root.freeRecursive();
  });
});

describe("New API methods", () => {
  test("copyStyle", () => {
    const node1 = Node.create();
    node1.setWidth(100);
    node1.setHeight(200);
    node1.setFlexDirection(FlexDirection.Row);

    const node2 = Node.create();
    node2.copyStyle(node1);

    expect(node2.getFlexDirection()).toBe(FlexDirection.Row);

    node1.free();
    node2.free();
  });

  test("setBoxSizing and getBoxSizing", () => {
    const node = Node.create();

    node.setBoxSizing(BoxSizing.ContentBox);
    expect(node.getBoxSizing()).toBe(BoxSizing.ContentBox);

    node.setBoxSizing(BoxSizing.BorderBox);
    expect(node.getBoxSizing()).toBe(BoxSizing.BorderBox);

    node.free();
  });

  test("setIsReferenceBaseline and isReferenceBaseline", () => {
    const node = Node.create();

    expect(node.isReferenceBaseline()).toBe(false);

    node.setIsReferenceBaseline(true);
    expect(node.isReferenceBaseline()).toBe(true);

    node.setIsReferenceBaseline(false);
    expect(node.isReferenceBaseline()).toBe(false);

    node.free();
  });

  test("setAlwaysFormsContainingBlock", () => {
    const node = Node.create();
    // Just verify it doesn't throw
    node.setAlwaysFormsContainingBlock(true);
    node.setAlwaysFormsContainingBlock(false);
    node.free();
  });
});

describe("Value getters", () => {
  test("getWidth returns Value with unit and value", () => {
    const node = Node.create();

    node.setWidth(100);
    const width = node.getWidth();
    expect(width.unit).toBe(Yoga.Unit.Point);
    expect(width.value).toBe(100);

    node.setWidth("50%");
    const widthPercent = node.getWidth();
    expect(widthPercent.unit).toBe(Yoga.Unit.Percent);
    expect(widthPercent.value).toBe(50);

    node.setWidth("auto");
    const widthAuto = node.getWidth();
    expect(widthAuto.unit).toBe(Yoga.Unit.Auto);

    node.free();
  });

  test("getMargin returns Value with unit and value", () => {
    const node = Node.create();

    node.setMargin(Edge.Left, 20);
    const margin = node.getMargin(Edge.Left);
    expect(margin.unit).toBe(Yoga.Unit.Point);
    expect(margin.value).toBe(20);

    node.setMargin(Edge.Top, "10%");
    const marginPercent = node.getMargin(Edge.Top);
    expect(marginPercent.unit).toBe(Yoga.Unit.Percent);
    expect(marginPercent.value).toBe(10);

    node.free();
  });

  test("getFlexBasis returns Value", () => {
    const node = Node.create();

    node.setFlexBasis(50);
    const basis = node.getFlexBasis();
    expect(basis.unit).toBe(Yoga.Unit.Point);
    expect(basis.value).toBe(50);

    node.setFlexBasis("auto");
    const basisAuto = node.getFlexBasis();
    expect(basisAuto.unit).toBe(Yoga.Unit.Auto);

    node.free();
  });
});

describe("DirtiedFunction signature", () => {
  test("dirtiedFunc receives node as parameter", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(100);

    let receivedNode: Node | undefined = undefined;

    root.setMeasureFunc(() => ({ width: 100, height: 100 }));
    root.calculateLayout(100, 100, Direction.LTR);

    root.setDirtiedFunc((node) => {
      receivedNode = node;
    });

    root.markDirty();

    expect(receivedNode).toBeDefined();
    expect(receivedNode === root).toBe(true);

    root.free();
  });
});

describe("Config", () => {
  test("errata settings", () => {
    const config = Config.create();

    config.setErrata(Errata.Classic);
    expect(config.getErrata()).toBe(Errata.Classic);

    config.setErrata(Errata.None);
    expect(config.getErrata()).toBe(Errata.None);

    config.free();
  });

  test("experimental features", () => {
    const config = Config.create();

    expect(config.isExperimentalFeatureEnabled(ExperimentalFeature.WebFlexBasis)).toBe(false);

    config.setExperimentalFeatureEnabled(ExperimentalFeature.WebFlexBasis, true);
    expect(config.isExperimentalFeatureEnabled(ExperimentalFeature.WebFlexBasis)).toBe(true);

    config.setExperimentalFeatureEnabled(ExperimentalFeature.WebFlexBasis, false);
    expect(config.isExperimentalFeatureEnabled(ExperimentalFeature.WebFlexBasis)).toBe(false);

    config.free();
  });
});

describe("Type exports", () => {
  test("enum types can be used as types", () => {
    // This test verifies that the type exports work correctly
    // If the types weren't exported, this wouldn't compile
    const align: Align = Align.Center;
    const direction: Direction = Direction.LTR;
    const edge: Edge = Edge.All;
    const flexDir: FlexDirection = FlexDirection.Row;
    const boxSizing: BoxSizing = BoxSizing.BorderBox;
    const errata: Errata = Errata.None;

    expect(align).toBe(2);
    expect(direction).toBe(1);
    expect(edge).toBe(8);
    expect(flexDir).toBe(2);
    expect(boxSizing).toBe(0);
    expect(errata).toBe(0);
  });
});
