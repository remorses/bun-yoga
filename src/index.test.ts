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

describe("Use-after-free protection", () => {
  test("isFreed returns false before free", () => {
    const node = Node.create();
    expect(node.isFreed()).toBe(false);
    node.free();
  });

  test("isFreed returns true after free", () => {
    const node = Node.create();
    node.free();
    expect(node.isFreed()).toBe(true);
  });

  test("isFreed returns true after freeRecursive", () => {
    const root = Node.create();
    root.setWidth(100);
    root.setHeight(100);

    const child = Node.create();
    root.insertChild(child, 0);

    root.freeRecursive();
    expect(root.isFreed()).toBe(true);
  });

  test("methods throw after free", () => {
    const node = Node.create();
    node.setWidth(100);
    node.free();

    expect(() => node.getComputedWidth()).toThrow("Cannot access freed Yoga node");
    expect(() => node.setWidth(50)).toThrow("Cannot access freed Yoga node");
    expect(() => node.calculateLayout()).toThrow("Cannot access freed Yoga node");
    expect(() => node.getFlexDirection()).toThrow("Cannot access freed Yoga node");
  });

  test("double free is safe (no-op)", () => {
    const node = Node.create();
    node.free();
    // Should not throw
    node.free();
    node.free();
    expect(node.isFreed()).toBe(true);
  });

  test("double freeRecursive is safe (no-op)", () => {
    const root = Node.create();
    const child = Node.create();
    root.insertChild(child, 0);
    
    root.freeRecursive();
    // Should not throw
    root.freeRecursive();
    expect(root.isFreed()).toBe(true);
  });

  test("accessing freed node in rapid cycles does not crash", () => {
    // This test verifies the fix for malloc corruption on Linux
    // Note: Only the root node that called freeRecursive() knows it's freed.
    // Child nodes' JS wrappers don't automatically know they were freed.
    const config = Config.create();
    
    for (let i = 0; i < 50; i++) {
      const root = Node.create(config);
      root.setWidth(100);
      root.setFlexDirection(FlexDirection.Column);
      
      const child = Node.create(config);
      child.setAlignSelf(Align.FlexStart);
      child.setMeasureFunc(() => ({ width: 50, height: 50 }));
      root.insertChild(child, 0);
      
      root.calculateLayout();
      root.freeRecursive();
      
      // The root node should throw, not crash
      expect(() => root.getComputedWidth()).toThrow();
      expect(() => root.setWidth(50)).toThrow();
    }
    
    config.free();
  });
});

describe("Memory management", () => {
  test("freeRecursive cleans up callbacks without errors", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(200);
    root.setFlexDirection(FlexDirection.Column);

    // Create a child with measure function (nodes with measure funcs can't have children)
    const child = Node.create();
    child.setAlignSelf(Align.FlexStart);

    let measureCalled = false;
    child.setMeasureFunc(() => {
      measureCalled = true;
      return { width: 100, height: 100 };
    });

    root.insertChild(child, 0);
    root.calculateLayout();
    expect(measureCalled).toBe(true);

    // freeRecursive should clean up callbacks properly
    // This should not throw or cause memory corruption
    root.freeRecursive();
  });

  test("reset cleans up callbacks and allows new ones", () => {
    const node = Node.create();

    // Set measure function (don't set width/height so measure func is called)
    let firstCallbackCalled = false;
    node.setMeasureFunc(() => {
      firstCallbackCalled = true;
      return { width: 50, height: 50 };
    });

    node.calculateLayout();
    expect(firstCallbackCalled).toBe(true);
    expect(node.hasMeasureFunc()).toBe(true);

    // Reset should clean up the callback
    node.reset();

    // After reset, node should not have measure function
    expect(node.hasMeasureFunc()).toBe(false);

    // Should be able to set a new measure function
    let secondCallbackCalled = false;
    node.setMeasureFunc(() => {
      secondCallbackCalled = true;
      return { width: 75, height: 75 };
    });

    expect(node.hasMeasureFunc()).toBe(true);
    node.calculateLayout();
    expect(secondCallbackCalled).toBe(true);

    node.free();
  });

  test("rapid free/create cycles with measure functions", () => {
    // This test verifies that rapid free/create cycles don't cause
    // memory corruption (the original bug on Linux)
    const config = Config.create();

    for (let i = 0; i < 100; i++) {
      const node = Node.create(config);
      // Don't set width/height so measure function is called

      const expectedSize = 10 + i;
      node.setMeasureFunc(() => ({
        width: expectedSize,
        height: expectedSize,
      }));

      node.calculateLayout();

      const width = node.getComputedWidth();
      expect(width).toBe(expectedSize);
      expect(Number.isNaN(width)).toBe(false);

      node.free();
    }

    config.free();
  });

  test("reset followed by free works correctly", () => {
    const node = Node.create();

    node.setMeasureFunc(() => ({ width: 50, height: 50 }));
    node.setBaselineFunc(() => 25);
    node.setDirtiedFunc(() => {});

    node.calculateLayout();

    // Reset clears callbacks
    node.reset();

    // Free should work without double-free
    node.free();
  });

  test("multiple reset calls are safe", () => {
    const node = Node.create();

    node.setMeasureFunc(() => ({ width: 50, height: 50 }));
    node.calculateLayout();

    // Multiple resets should be safe
    node.reset();
    node.reset();
    node.reset();

    node.free();
  });

  test("freeRecursive with nested children with callbacks", () => {
    const root = Node.create();
    root.setWidth(200);
    root.setHeight(200);
    root.setFlexDirection(FlexDirection.Column);

    // Create children with measure functions
    // Note: We can't add children to nodes with measure functions,
    // so we set up the hierarchy first, then add measure func to leaf nodes
    const child1 = Node.create();
    child1.setAlignSelf(Align.FlexStart);
    child1.setMeasureFunc(() => ({ width: 50, height: 50 }));

    const child2 = Node.create();
    child2.setAlignSelf(Align.FlexStart);
    child2.setMeasureFunc(() => ({ width: 60, height: 60 }));

    root.insertChild(child1, 0);
    root.insertChild(child2, 1);

    root.calculateLayout();

    expect(child1.getComputedWidth()).toBe(50);
    expect(child2.getComputedWidth()).toBe(60);

    // freeRecursive should clean up all nodes and their callbacks
    // The native context is cleaned up by Zig's freeContextRecursive
    root.freeRecursive();
  });

  test("interleaved node lifecycle with callbacks", () => {
    const config = Config.create();
    const nodes: Node[] = [];

    // Create several nodes with callbacks
    for (let i = 0; i < 20; i++) {
      const node = Node.create(config);
      node.setMeasureFunc(() => ({ width: 10 + i, height: 10 + i }));
      nodes.push(node);
    }

    // Free some, keep others
    for (let i = 0; i < nodes.length; i += 2) {
      nodes[i]!.free();
    }

    // Calculate remaining nodes
    for (let i = 1; i < nodes.length; i += 2) {
      nodes[i]!.calculateLayout();
      const width = nodes[i]!.getComputedWidth();
      expect(width).toBe(10 + i);
      expect(Number.isNaN(width)).toBe(false);
    }

    // Free remaining
    for (let i = 1; i < nodes.length; i += 2) {
      nodes[i]!.free();
    }

    config.free();
  });
});
