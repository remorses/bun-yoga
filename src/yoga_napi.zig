const std = @import("std");
const napigen = @import("napigen");

// Import C headers from Yoga
const c = @cImport({
    @cInclude("yoga/Yoga.h");
});

// Re-export Yoga types
pub const YGNodeRef = c.YGNodeRef;
pub const YGNodeConstRef = c.YGNodeConstRef;
pub const YGConfigRef = c.YGConfigRef;
pub const YGConfigConstRef = c.YGConfigConstRef;
pub const YGValue = c.YGValue;
pub const YGSize = c.YGSize;

//=============================================================================
// CONFIG FUNCTIONS
//=============================================================================

fn configNew() *anyopaque {
    return @ptrCast(c.YGConfigNew());
}

fn configFree(config: *anyopaque) void {
    c.YGConfigFree(@ptrCast(@alignCast(config)));
}

fn configSetUseWebDefaults(config: *anyopaque, enabled: bool) void {
    c.YGConfigSetUseWebDefaults(@ptrCast(@alignCast(config)), enabled);
}

fn configGetUseWebDefaults(config: *anyopaque) bool {
    return c.YGConfigGetUseWebDefaults(@ptrCast(@alignCast(config)));
}

fn configSetPointScaleFactor(config: *anyopaque, pixelsInPoint: f32) void {
    c.YGConfigSetPointScaleFactor(@ptrCast(@alignCast(config)), pixelsInPoint);
}

fn configGetPointScaleFactor(config: *anyopaque) f32 {
    return c.YGConfigGetPointScaleFactor(@ptrCast(@alignCast(config)));
}

fn configSetErrata(config: *anyopaque, errata: u32) void {
    c.YGConfigSetErrata(@ptrCast(@alignCast(config)), errata);
}

fn configGetErrata(config: *anyopaque) u32 {
    return c.YGConfigGetErrata(@ptrCast(@alignCast(config)));
}

fn configSetExperimentalFeatureEnabled(config: *anyopaque, feature: u32, enabled: bool) void {
    c.YGConfigSetExperimentalFeatureEnabled(@ptrCast(@alignCast(config)), feature, enabled);
}

fn configIsExperimentalFeatureEnabled(config: *anyopaque, feature: u32) bool {
    return c.YGConfigIsExperimentalFeatureEnabled(@ptrCast(@alignCast(config)), feature);
}

//=============================================================================
// NODE CREATION AND MANAGEMENT
//=============================================================================

fn nodeNew() *anyopaque {
    return @ptrCast(c.YGNodeNew());
}

fn nodeNewWithConfig(config: *anyopaque) *anyopaque {
    return @ptrCast(c.YGNodeNewWithConfig(@ptrCast(@alignCast(config))));
}

fn nodeClone(node: *anyopaque) *anyopaque {
    return @ptrCast(c.YGNodeClone(@ptrCast(@alignCast(node))));
}

fn nodeFree(js: *napigen.JsContext, node: *anyopaque) void {
    const yg_node: c.YGNodeRef = @ptrCast(@alignCast(node));
    // Set current_env for cleanup operations
    current_env = js.env;
    defer current_env = null;
    freeContext(yg_node);
    c.YGNodeFree(yg_node);
}

fn nodeFreeRecursive(js: *napigen.JsContext, node: *anyopaque) void {
    const yg_node: c.YGNodeRef = @ptrCast(@alignCast(node));
    // Set current_env for cleanup operations
    current_env = js.env;
    defer current_env = null;
    // Free contexts for all children recursively
    freeContextRecursive(yg_node);
    c.YGNodeFreeRecursive(yg_node);
}

fn freeContextRecursive(node: c.YGNodeRef) void {
    const childCount = c.YGNodeGetChildCount(node);
    var i: usize = 0;
    while (i < childCount) : (i += 1) {
        const child = c.YGNodeGetChild(node, i);
        if (child) |ch| {
            freeContextRecursive(ch);
        }
    }
    freeContext(node);
}

fn nodeReset(js: *napigen.JsContext, node: *anyopaque) void {
    const yg_node: c.YGNodeRef = @ptrCast(@alignCast(node));
    // Set current_env for cleanup operations
    current_env = js.env;
    defer current_env = null;
    freeContext(yg_node);
    c.YGNodeReset(yg_node);
}

//=============================================================================
// NODE HIERARCHY MANAGEMENT
//=============================================================================

fn nodeInsertChild(node: *anyopaque, child: *anyopaque, index: u32) void {
    c.YGNodeInsertChild(@ptrCast(@alignCast(node)), @ptrCast(@alignCast(child)), index);
}

fn nodeRemoveChild(node: *anyopaque, child: *anyopaque) void {
    c.YGNodeRemoveChild(@ptrCast(@alignCast(node)), @ptrCast(@alignCast(child)));
}

fn nodeRemoveAllChildren(node: *anyopaque) void {
    c.YGNodeRemoveAllChildren(@ptrCast(@alignCast(node)));
}

fn nodeGetChild(node: *anyopaque, index: u32) ?*anyopaque {
    const child = c.YGNodeGetChild(@ptrCast(@alignCast(node)), index);
    return if (child != null) @ptrCast(child) else null;
}

fn nodeGetChildCount(node: *anyopaque) u32 {
    return @intCast(c.YGNodeGetChildCount(@ptrCast(@alignCast(node))));
}

fn nodeGetParent(node: *anyopaque) ?*anyopaque {
    const parent = c.YGNodeGetParent(@ptrCast(@alignCast(node)));
    return if (parent != null) @ptrCast(parent) else null;
}

//=============================================================================
// LAYOUT CALCULATION
//=============================================================================

fn nodeCalculateLayout(js: *napigen.JsContext, node: *anyopaque, availableWidth: f32, availableHeight: f32, ownerDirection: u32) void {
    // Set current env for callbacks during layout calculation
    current_env = js.env;
    defer current_env = null;

    c.YGNodeCalculateLayout(@ptrCast(@alignCast(node)), availableWidth, availableHeight, ownerDirection);
}

fn nodeGetHasNewLayout(node: *anyopaque) bool {
    return c.YGNodeGetHasNewLayout(@ptrCast(@alignCast(node)));
}

fn nodeSetHasNewLayout(node: *anyopaque, hasNewLayout: bool) void {
    c.YGNodeSetHasNewLayout(@ptrCast(@alignCast(node)), hasNewLayout);
}

fn nodeIsDirty(node: *anyopaque) bool {
    return c.YGNodeIsDirty(@ptrCast(@alignCast(node)));
}

fn nodeMarkDirty(js: *napigen.JsContext, node: *anyopaque) void {
    // Set current env for dirtied callback
    current_env = js.env;
    defer current_env = null;

    c.YGNodeMarkDirty(@ptrCast(@alignCast(node)));
}

//=============================================================================
// LAYOUT RESULTS ACCESS
//=============================================================================

fn nodeLayoutGetLeft(node: *anyopaque) f32 {
    return c.YGNodeLayoutGetLeft(@ptrCast(@alignCast(node)));
}

fn nodeLayoutGetTop(node: *anyopaque) f32 {
    return c.YGNodeLayoutGetTop(@ptrCast(@alignCast(node)));
}

fn nodeLayoutGetRight(node: *anyopaque) f32 {
    return c.YGNodeLayoutGetRight(@ptrCast(@alignCast(node)));
}

fn nodeLayoutGetBottom(node: *anyopaque) f32 {
    return c.YGNodeLayoutGetBottom(@ptrCast(@alignCast(node)));
}

fn nodeLayoutGetWidth(node: *anyopaque) f32 {
    return c.YGNodeLayoutGetWidth(@ptrCast(@alignCast(node)));
}

fn nodeLayoutGetHeight(node: *anyopaque) f32 {
    return c.YGNodeLayoutGetHeight(@ptrCast(@alignCast(node)));
}

fn nodeLayoutGetMargin(node: *anyopaque, edge: u32) f32 {
    return c.YGNodeLayoutGetMargin(@ptrCast(@alignCast(node)), edge);
}

fn nodeLayoutGetBorder(node: *anyopaque, edge: u32) f32 {
    return c.YGNodeLayoutGetBorder(@ptrCast(@alignCast(node)), edge);
}

fn nodeLayoutGetPadding(node: *anyopaque, edge: u32) f32 {
    return c.YGNodeLayoutGetPadding(@ptrCast(@alignCast(node)), edge);
}

//=============================================================================
// STYLE - LAYOUT PROPERTIES
//=============================================================================

fn nodeCopyStyle(dstNode: *anyopaque, srcNode: *anyopaque) void {
    c.YGNodeCopyStyle(@ptrCast(@alignCast(dstNode)), @ptrCast(@alignCast(srcNode)));
}

fn nodeStyleSetDirection(node: *anyopaque, direction: u32) void {
    c.YGNodeStyleSetDirection(@ptrCast(@alignCast(node)), direction);
}

fn nodeStyleGetDirection(node: *anyopaque) u32 {
    return c.YGNodeStyleGetDirection(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetFlexDirection(node: *anyopaque, flexDirection: u32) void {
    c.YGNodeStyleSetFlexDirection(@ptrCast(@alignCast(node)), flexDirection);
}

fn nodeStyleGetFlexDirection(node: *anyopaque) u32 {
    return c.YGNodeStyleGetFlexDirection(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetJustifyContent(node: *anyopaque, justifyContent: u32) void {
    c.YGNodeStyleSetJustifyContent(@ptrCast(@alignCast(node)), justifyContent);
}

fn nodeStyleGetJustifyContent(node: *anyopaque) u32 {
    return c.YGNodeStyleGetJustifyContent(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetAlignContent(node: *anyopaque, alignContent: u32) void {
    c.YGNodeStyleSetAlignContent(@ptrCast(@alignCast(node)), alignContent);
}

fn nodeStyleGetAlignContent(node: *anyopaque) u32 {
    return c.YGNodeStyleGetAlignContent(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetAlignItems(node: *anyopaque, alignItems: u32) void {
    c.YGNodeStyleSetAlignItems(@ptrCast(@alignCast(node)), alignItems);
}

fn nodeStyleGetAlignItems(node: *anyopaque) u32 {
    return c.YGNodeStyleGetAlignItems(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetAlignSelf(node: *anyopaque, alignSelf: u32) void {
    c.YGNodeStyleSetAlignSelf(@ptrCast(@alignCast(node)), alignSelf);
}

fn nodeStyleGetAlignSelf(node: *anyopaque) u32 {
    return c.YGNodeStyleGetAlignSelf(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetPositionType(node: *anyopaque, positionType: u32) void {
    c.YGNodeStyleSetPositionType(@ptrCast(@alignCast(node)), positionType);
}

fn nodeStyleGetPositionType(node: *anyopaque) u32 {
    return c.YGNodeStyleGetPositionType(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetFlexWrap(node: *anyopaque, flexWrap: u32) void {
    c.YGNodeStyleSetFlexWrap(@ptrCast(@alignCast(node)), flexWrap);
}

fn nodeStyleGetFlexWrap(node: *anyopaque) u32 {
    return c.YGNodeStyleGetFlexWrap(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetOverflow(node: *anyopaque, overflow: u32) void {
    c.YGNodeStyleSetOverflow(@ptrCast(@alignCast(node)), overflow);
}

fn nodeStyleGetOverflow(node: *anyopaque) u32 {
    return c.YGNodeStyleGetOverflow(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetDisplay(node: *anyopaque, display: u32) void {
    c.YGNodeStyleSetDisplay(@ptrCast(@alignCast(node)), display);
}

fn nodeStyleGetDisplay(node: *anyopaque) u32 {
    return c.YGNodeStyleGetDisplay(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetBoxSizing(node: *anyopaque, boxSizing: u32) void {
    c.YGNodeStyleSetBoxSizing(@ptrCast(@alignCast(node)), boxSizing);
}

fn nodeStyleGetBoxSizing(node: *anyopaque) u32 {
    return c.YGNodeStyleGetBoxSizing(@ptrCast(@alignCast(node)));
}

//=============================================================================
// STYLE - FLEX PROPERTIES
//=============================================================================

fn nodeStyleSetFlex(node: *anyopaque, flex: f32) void {
    c.YGNodeStyleSetFlex(@ptrCast(@alignCast(node)), flex);
}

fn nodeStyleGetFlex(node: *anyopaque) f32 {
    return c.YGNodeStyleGetFlex(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetFlexGrow(node: *anyopaque, flexGrow: f32) void {
    c.YGNodeStyleSetFlexGrow(@ptrCast(@alignCast(node)), flexGrow);
}

fn nodeStyleGetFlexGrow(node: *anyopaque) f32 {
    return c.YGNodeStyleGetFlexGrow(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetFlexShrink(node: *anyopaque, flexShrink: f32) void {
    c.YGNodeStyleSetFlexShrink(@ptrCast(@alignCast(node)), flexShrink);
}

fn nodeStyleGetFlexShrink(node: *anyopaque) f32 {
    return c.YGNodeStyleGetFlexShrink(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetFlexBasis(node: *anyopaque, flexBasis: f32) void {
    c.YGNodeStyleSetFlexBasis(@ptrCast(@alignCast(node)), flexBasis);
}

fn nodeStyleSetFlexBasisPercent(node: *anyopaque, flexBasis: f32) void {
    c.YGNodeStyleSetFlexBasisPercent(@ptrCast(@alignCast(node)), flexBasis);
}

fn nodeStyleSetFlexBasisAuto(node: *anyopaque) void {
    c.YGNodeStyleSetFlexBasisAuto(@ptrCast(@alignCast(node)));
}

//=============================================================================
// STYLE - POSITION PROPERTIES
//=============================================================================

fn nodeStyleSetPosition(node: *anyopaque, edge: u32, position: f32) void {
    c.YGNodeStyleSetPosition(@ptrCast(@alignCast(node)), edge, position);
}

fn nodeStyleSetPositionPercent(node: *anyopaque, edge: u32, position: f32) void {
    c.YGNodeStyleSetPositionPercent(@ptrCast(@alignCast(node)), edge, position);
}

fn nodeStyleSetPositionAuto(node: *anyopaque, edge: u32) void {
    c.YGNodeStyleSetPositionAuto(@ptrCast(@alignCast(node)), edge);
}

//=============================================================================
// STYLE - MARGIN PROPERTIES
//=============================================================================

fn nodeStyleSetMargin(node: *anyopaque, edge: u32, margin: f32) void {
    c.YGNodeStyleSetMargin(@ptrCast(@alignCast(node)), edge, margin);
}

fn nodeStyleSetMarginPercent(node: *anyopaque, edge: u32, margin: f32) void {
    c.YGNodeStyleSetMarginPercent(@ptrCast(@alignCast(node)), edge, margin);
}

fn nodeStyleSetMarginAuto(node: *anyopaque, edge: u32) void {
    c.YGNodeStyleSetMarginAuto(@ptrCast(@alignCast(node)), edge);
}

//=============================================================================
// STYLE - PADDING PROPERTIES
//=============================================================================

fn nodeStyleSetPadding(node: *anyopaque, edge: u32, padding: f32) void {
    c.YGNodeStyleSetPadding(@ptrCast(@alignCast(node)), edge, padding);
}

fn nodeStyleSetPaddingPercent(node: *anyopaque, edge: u32, padding: f32) void {
    c.YGNodeStyleSetPaddingPercent(@ptrCast(@alignCast(node)), edge, padding);
}

//=============================================================================
// STYLE - BORDER PROPERTIES
//=============================================================================

fn nodeStyleSetBorder(node: *anyopaque, edge: u32, border: f32) void {
    c.YGNodeStyleSetBorder(@ptrCast(@alignCast(node)), edge, border);
}

fn nodeStyleGetBorder(node: *anyopaque, edge: u32) f32 {
    return c.YGNodeStyleGetBorder(@ptrCast(@alignCast(node)), edge);
}

//=============================================================================
// STYLE - GAP PROPERTIES
//=============================================================================

fn nodeStyleSetGap(node: *anyopaque, gutter: u32, gapLength: f32) void {
    c.YGNodeStyleSetGap(@ptrCast(@alignCast(node)), gutter, gapLength);
}

fn nodeStyleSetGapPercent(node: *anyopaque, gutter: u32, gapLength: f32) void {
    c.YGNodeStyleSetGapPercent(@ptrCast(@alignCast(node)), gutter, gapLength);
}

//=============================================================================
// STYLE - SIZE PROPERTIES
//=============================================================================

fn nodeStyleSetWidth(node: *anyopaque, width: f32) void {
    c.YGNodeStyleSetWidth(@ptrCast(@alignCast(node)), width);
}

fn nodeStyleSetWidthPercent(node: *anyopaque, width: f32) void {
    c.YGNodeStyleSetWidthPercent(@ptrCast(@alignCast(node)), width);
}

fn nodeStyleSetWidthAuto(node: *anyopaque) void {
    c.YGNodeStyleSetWidthAuto(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetHeight(node: *anyopaque, height: f32) void {
    c.YGNodeStyleSetHeight(@ptrCast(@alignCast(node)), height);
}

fn nodeStyleSetHeightPercent(node: *anyopaque, height: f32) void {
    c.YGNodeStyleSetHeightPercent(@ptrCast(@alignCast(node)), height);
}

fn nodeStyleSetHeightAuto(node: *anyopaque) void {
    c.YGNodeStyleSetHeightAuto(@ptrCast(@alignCast(node)));
}

fn nodeStyleSetMinWidth(node: *anyopaque, minWidth: f32) void {
    c.YGNodeStyleSetMinWidth(@ptrCast(@alignCast(node)), minWidth);
}

fn nodeStyleSetMinWidthPercent(node: *anyopaque, minWidth: f32) void {
    c.YGNodeStyleSetMinWidthPercent(@ptrCast(@alignCast(node)), minWidth);
}

fn nodeStyleSetMinHeight(node: *anyopaque, minHeight: f32) void {
    c.YGNodeStyleSetMinHeight(@ptrCast(@alignCast(node)), minHeight);
}

fn nodeStyleSetMinHeightPercent(node: *anyopaque, minHeight: f32) void {
    c.YGNodeStyleSetMinHeightPercent(@ptrCast(@alignCast(node)), minHeight);
}

fn nodeStyleSetMaxWidth(node: *anyopaque, maxWidth: f32) void {
    c.YGNodeStyleSetMaxWidth(@ptrCast(@alignCast(node)), maxWidth);
}

fn nodeStyleSetMaxWidthPercent(node: *anyopaque, maxWidth: f32) void {
    c.YGNodeStyleSetMaxWidthPercent(@ptrCast(@alignCast(node)), maxWidth);
}

fn nodeStyleSetMaxHeight(node: *anyopaque, maxHeight: f32) void {
    c.YGNodeStyleSetMaxHeight(@ptrCast(@alignCast(node)), maxHeight);
}

fn nodeStyleSetMaxHeightPercent(node: *anyopaque, maxHeight: f32) void {
    c.YGNodeStyleSetMaxHeightPercent(@ptrCast(@alignCast(node)), maxHeight);
}

//=============================================================================
// STYLE - ASPECT RATIO
//=============================================================================

fn nodeStyleSetAspectRatio(node: *anyopaque, aspectRatio: f32) void {
    c.YGNodeStyleSetAspectRatio(@ptrCast(@alignCast(node)), aspectRatio);
}

fn nodeStyleGetAspectRatio(node: *anyopaque) f32 {
    return c.YGNodeStyleGetAspectRatio(@ptrCast(@alignCast(node)));
}

//=============================================================================
// NODE CONFIGURATION AND CONTEXT
//=============================================================================

fn nodeSetIsReferenceBaseline(node: *anyopaque, isReferenceBaseline: bool) void {
    c.YGNodeSetIsReferenceBaseline(@ptrCast(@alignCast(node)), isReferenceBaseline);
}

fn nodeIsReferenceBaseline(node: *anyopaque) bool {
    return c.YGNodeIsReferenceBaseline(@ptrCast(@alignCast(node)));
}

fn nodeSetAlwaysFormsContainingBlock(node: *anyopaque, alwaysFormsContainingBlock: bool) void {
    c.YGNodeSetAlwaysFormsContainingBlock(@ptrCast(@alignCast(node)), alwaysFormsContainingBlock);
}

//=============================================================================
// CALLBACK SUPPORT
//=============================================================================

/// Context struct stored on each node that has callbacks
const CallbackContext = struct {
    measure_func: ?napigen.napi_ref = null,
    baseline_func: ?napigen.napi_ref = null,
    dirtied_func: ?napigen.napi_ref = null,
};

const callback_allocator = std.heap.c_allocator;

/// Thread-local storage for the current napi_env during layout calculation
/// This is set before calling YGNodeCalculateLayout and cleared after
/// Callbacks read from here instead of stored env (which may be stale on Windows)
threadlocal var current_env: ?napigen.napi_env = null;

/// Get or create callback context for a node
fn getOrCreateContext(node: c.YGNodeRef) *CallbackContext {
    const existing = c.YGNodeGetContext(node);
    if (existing) |ptr| {
        return @ptrCast(@alignCast(ptr));
    }
    const ctx = callback_allocator.create(CallbackContext) catch @panic("Failed to allocate callback context");
    ctx.* = CallbackContext{};
    c.YGNodeSetContext(node, ctx);
    return ctx;
}

/// Get callback context for a node (may return null)
fn getContext(node: c.YGNodeConstRef) ?*CallbackContext {
    const existing = c.YGNodeGetContext(node);
    if (existing) |ptr| {
        return @ptrCast(@alignCast(ptr));
    }
    return null;
}

/// Free callback context and release refs
/// Note: On Windows, napi_delete_reference can crash if env is stale.
/// We use the thread-local current_env which is set during NAPI calls.
fn freeContext(node: c.YGNodeRef) void {
    const existing = c.YGNodeGetContext(node);
    if (existing) |ptr| {
        const ctx: *CallbackContext = @ptrCast(@alignCast(ptr));
        // Only release refs if we have a valid current_env (set during NAPI calls)
        // This avoids crashes on Windows when env becomes stale
        if (current_env) |env| {
            if (ctx.measure_func) |ref| {
                _ = napigen.napi.napi_delete_reference(env, ref);
            }
            if (ctx.baseline_func) |ref| {
                _ = napigen.napi.napi_delete_reference(env, ref);
            }
            if (ctx.dirtied_func) |ref| {
                _ = napigen.napi.napi_delete_reference(env, ref);
            }
        }
        // Note: If current_env is null, we leak the refs. This is better than crashing.
        callback_allocator.destroy(ctx);
        c.YGNodeSetContext(node, null);
    }
}

/// Internal measure function called by Yoga
fn internalMeasureFunc(
    node: c.YGNodeConstRef,
    width: f32,
    widthMode: c_uint,
    height: f32,
    heightMode: c_uint,
) callconv(.c) YGSize {
    const ctx = getContext(node) orelse return YGSize{ .width = 0, .height = 0 };
    const measure_ref = ctx.measure_func orelse return YGSize{ .width = 0, .height = 0 };

    // Use the thread-local current_env set during calculateLayout
    const env = current_env orelse return YGSize{ .width = 0, .height = 0 };

    // Get the JS function from ref
    var js_func: napigen.napi_value = undefined;
    if (napigen.napi.napi_get_reference_value(env, measure_ref, &js_func) != napigen.napi.napi_ok) {
        return YGSize{ .width = 0, .height = 0 };
    }

    // Get undefined for 'this'
    var undefined_val: napigen.napi_value = undefined;
    _ = napigen.napi.napi_get_undefined(env, &undefined_val);

    // Create arguments
    var args: [4]napigen.napi_value = undefined;
    _ = napigen.napi.napi_create_double(env, width, &args[0]);
    _ = napigen.napi.napi_create_uint32(env, widthMode, &args[1]);
    _ = napigen.napi.napi_create_double(env, height, &args[2]);
    _ = napigen.napi.napi_create_uint32(env, heightMode, &args[3]);

    // Call the JS function
    var result: napigen.napi_value = undefined;
    if (napigen.napi.napi_call_function(env, undefined_val, js_func, 4, &args, &result) != napigen.napi.napi_ok) {
        return YGSize{ .width = 0, .height = 0 };
    }

    // Extract width and height from result object
    var width_val: napigen.napi_value = undefined;
    var height_val: napigen.napi_value = undefined;
    _ = napigen.napi.napi_get_named_property(env, result, "width", &width_val);
    _ = napigen.napi.napi_get_named_property(env, result, "height", &height_val);

    var result_width: f64 = 0;
    var result_height: f64 = 0;
    _ = napigen.napi.napi_get_value_double(env, width_val, &result_width);
    _ = napigen.napi.napi_get_value_double(env, height_val, &result_height);

    return YGSize{ .width = @floatCast(result_width), .height = @floatCast(result_height) };
}

/// Internal baseline function called by Yoga
fn internalBaselineFunc(
    node: c.YGNodeConstRef,
    width: f32,
    height: f32,
) callconv(.c) f32 {
    const ctx = getContext(node) orelse return 0;
    const baseline_ref = ctx.baseline_func orelse return 0;

    // Use the thread-local current_env set during calculateLayout
    const env = current_env orelse return 0;

    // Get the JS function from ref
    var js_func: napigen.napi_value = undefined;
    if (napigen.napi.napi_get_reference_value(env, baseline_ref, &js_func) != napigen.napi.napi_ok) {
        return 0;
    }

    // Get undefined for 'this'
    var undefined_val: napigen.napi_value = undefined;
    _ = napigen.napi.napi_get_undefined(env, &undefined_val);

    // Create arguments
    var args: [2]napigen.napi_value = undefined;
    _ = napigen.napi.napi_create_double(env, width, &args[0]);
    _ = napigen.napi.napi_create_double(env, height, &args[1]);

    // Call the JS function
    var result: napigen.napi_value = undefined;
    if (napigen.napi.napi_call_function(env, undefined_val, js_func, 2, &args, &result) != napigen.napi.napi_ok) {
        return 0;
    }

    var result_val: f64 = 0;
    _ = napigen.napi.napi_get_value_double(env, result, &result_val);

    return @floatCast(result_val);
}

/// Internal dirtied function called by Yoga
fn internalDirtiedFunc(node: c.YGNodeConstRef) callconv(.c) void {
    const ctx = getContext(node) orelse return;
    const dirtied_ref = ctx.dirtied_func orelse return;

    // Use the thread-local current_env set during markDirty
    const env = current_env orelse return;

    // Get the JS function from ref
    var js_func: napigen.napi_value = undefined;
    if (napigen.napi.napi_get_reference_value(env, dirtied_ref, &js_func) != napigen.napi.napi_ok) {
        return;
    }

    // Get undefined for 'this'
    var undefined_val: napigen.napi_value = undefined;
    _ = napigen.napi.napi_get_undefined(env, &undefined_val);

    // Call with no arguments
    var result: napigen.napi_value = undefined;
    _ = napigen.napi.napi_call_function(env, undefined_val, js_func, 0, null, &result);
}

/// Set measure function from JS
fn nodeSetMeasureFunc(js: *napigen.JsContext, node: *anyopaque, func: napigen.napi_value) !void {
    const yg_node: c.YGNodeRef = @ptrCast(@alignCast(node));
    const ctx = getOrCreateContext(yg_node);

    // Delete old ref if exists
    if (ctx.measure_func) |old_ref| {
        _ = napigen.napi.napi_delete_reference(js.env, old_ref);
        ctx.measure_func = null;
    }

    // Check if func is null/undefined
    var value_type: napigen.napi_valuetype = undefined;
    _ = napigen.napi.napi_typeof(js.env, func, &value_type);
    if (value_type == napigen.napi.napi_null or value_type == napigen.napi.napi_undefined) {
        c.YGNodeSetMeasureFunc(yg_node, null);
        return;
    }

    // Create a reference to the function
    var ref: napigen.napi_ref = undefined;
    try napigen.check(napigen.napi.napi_create_reference(js.env, func, 1, &ref));
    ctx.measure_func = ref;

    // Set the internal measure func
    c.YGNodeSetMeasureFunc(yg_node, &internalMeasureFunc);
}

/// Unset measure function
fn nodeUnsetMeasureFunc(js: *napigen.JsContext, node: *anyopaque) void {
    const yg_node: c.YGNodeRef = @ptrCast(@alignCast(node));
    c.YGNodeSetMeasureFunc(yg_node, null);

    if (getContext(yg_node)) |ctx| {
        if (ctx.measure_func) |ref| {
            _ = napigen.napi.napi_delete_reference(js.env, ref);
            ctx.measure_func = null;
        }
    }
}

/// Check if node has measure func
fn nodeHasMeasureFunc(node: *anyopaque) bool {
    return c.YGNodeHasMeasureFunc(@ptrCast(@alignCast(node)));
}

/// Set baseline function from JS
fn nodeSetBaselineFunc(js: *napigen.JsContext, node: *anyopaque, func: napigen.napi_value) !void {
    const yg_node: c.YGNodeRef = @ptrCast(@alignCast(node));
    const ctx = getOrCreateContext(yg_node);

    // Delete old ref if exists
    if (ctx.baseline_func) |old_ref| {
        _ = napigen.napi.napi_delete_reference(js.env, old_ref);
        ctx.baseline_func = null;
    }

    // Check if func is null/undefined
    var value_type: napigen.napi_valuetype = undefined;
    _ = napigen.napi.napi_typeof(js.env, func, &value_type);
    if (value_type == napigen.napi.napi_null or value_type == napigen.napi.napi_undefined) {
        c.YGNodeSetBaselineFunc(yg_node, null);
        return;
    }

    // Create a reference to the function
    var ref: napigen.napi_ref = undefined;
    try napigen.check(napigen.napi.napi_create_reference(js.env, func, 1, &ref));
    ctx.baseline_func = ref;

    // Set the internal baseline func
    c.YGNodeSetBaselineFunc(yg_node, &internalBaselineFunc);
}

/// Unset baseline function
fn nodeUnsetBaselineFunc(js: *napigen.JsContext, node: *anyopaque) void {
    const yg_node: c.YGNodeRef = @ptrCast(@alignCast(node));
    c.YGNodeSetBaselineFunc(yg_node, null);

    if (getContext(yg_node)) |ctx| {
        if (ctx.baseline_func) |ref| {
            _ = napigen.napi.napi_delete_reference(js.env, ref);
            ctx.baseline_func = null;
        }
    }
}

/// Check if node has baseline func
fn nodeHasBaselineFunc(node: *anyopaque) bool {
    return c.YGNodeHasBaselineFunc(@ptrCast(@alignCast(node)));
}

/// Set dirtied function from JS
fn nodeSetDirtiedFunc(js: *napigen.JsContext, node: *anyopaque, func: napigen.napi_value) !void {
    const yg_node: c.YGNodeRef = @ptrCast(@alignCast(node));
    const ctx = getOrCreateContext(yg_node);

    // Delete old ref if exists
    if (ctx.dirtied_func) |old_ref| {
        _ = napigen.napi.napi_delete_reference(js.env, old_ref);
        ctx.dirtied_func = null;
    }

    // Check if func is null/undefined
    var value_type: napigen.napi_valuetype = undefined;
    _ = napigen.napi.napi_typeof(js.env, func, &value_type);
    if (value_type == napigen.napi.napi_null or value_type == napigen.napi.napi_undefined) {
        c.YGNodeSetDirtiedFunc(yg_node, null);
        return;
    }

    // Create a reference to the function
    var ref: napigen.napi_ref = undefined;
    try napigen.check(napigen.napi.napi_create_reference(js.env, func, 1, &ref));
    ctx.dirtied_func = ref;

    // Set the internal dirtied func
    c.YGNodeSetDirtiedFunc(yg_node, &internalDirtiedFunc);
}

/// Unset dirtied function
fn nodeUnsetDirtiedFunc(js: *napigen.JsContext, node: *anyopaque) void {
    const yg_node: c.YGNodeRef = @ptrCast(@alignCast(node));
    c.YGNodeSetDirtiedFunc(yg_node, null);

    if (getContext(yg_node)) |ctx| {
        if (ctx.dirtied_func) |ref| {
            _ = napigen.napi.napi_delete_reference(js.env, ref);
            ctx.dirtied_func = null;
        }
    }
}

/// Check if node has dirtied func
fn nodeHasDirtiedFunc(node: *anyopaque) bool {
    return c.YGNodeGetDirtiedFunc(@ptrCast(@alignCast(node))) != null;
}

//=============================================================================
// VALUE GETTERS (return struct {unit, value})
//=============================================================================

const ValueResult = struct {
    unit: u32,
    value: f32,
};

fn convertValue(val: YGValue) ValueResult {
    return .{
        .unit = val.unit,
        .value = val.value,
    };
}

fn nodeStyleGetWidth(node: *anyopaque) ValueResult {
    return convertValue(c.YGNodeStyleGetWidth(@ptrCast(@alignCast(node))));
}

fn nodeStyleGetHeight(node: *anyopaque) ValueResult {
    return convertValue(c.YGNodeStyleGetHeight(@ptrCast(@alignCast(node))));
}

fn nodeStyleGetMinWidth(node: *anyopaque) ValueResult {
    return convertValue(c.YGNodeStyleGetMinWidth(@ptrCast(@alignCast(node))));
}

fn nodeStyleGetMinHeight(node: *anyopaque) ValueResult {
    return convertValue(c.YGNodeStyleGetMinHeight(@ptrCast(@alignCast(node))));
}

fn nodeStyleGetMaxWidth(node: *anyopaque) ValueResult {
    return convertValue(c.YGNodeStyleGetMaxWidth(@ptrCast(@alignCast(node))));
}

fn nodeStyleGetMaxHeight(node: *anyopaque) ValueResult {
    return convertValue(c.YGNodeStyleGetMaxHeight(@ptrCast(@alignCast(node))));
}

fn nodeStyleGetMargin(node: *anyopaque, edge: u32) ValueResult {
    return convertValue(c.YGNodeStyleGetMargin(@ptrCast(@alignCast(node)), edge));
}

fn nodeStyleGetPadding(node: *anyopaque, edge: u32) ValueResult {
    return convertValue(c.YGNodeStyleGetPadding(@ptrCast(@alignCast(node)), edge));
}

fn nodeStyleGetPosition(node: *anyopaque, edge: u32) ValueResult {
    return convertValue(c.YGNodeStyleGetPosition(@ptrCast(@alignCast(node)), edge));
}

fn nodeStyleGetGap(node: *anyopaque, gutter: u32) ValueResult {
    return convertValue(c.YGNodeStyleGetGap(@ptrCast(@alignCast(node)), gutter));
}

fn nodeStyleGetFlexBasis(node: *anyopaque) ValueResult {
    return convertValue(c.YGNodeStyleGetFlexBasis(@ptrCast(@alignCast(node))));
}

//=============================================================================
// NAPI MODULE DEFINITION
//=============================================================================

comptime {
    napigen.defineModule(initModule);
}

fn initModule(js: *napigen.JsContext, exports: napigen.napi_value) !napigen.napi_value {
    // Config functions
    try js.setNamedProperty(exports, "configNew", try js.createFunction(configNew));
    try js.setNamedProperty(exports, "configFree", try js.createFunction(configFree));
    try js.setNamedProperty(exports, "configSetUseWebDefaults", try js.createFunction(configSetUseWebDefaults));
    try js.setNamedProperty(exports, "configGetUseWebDefaults", try js.createFunction(configGetUseWebDefaults));
    try js.setNamedProperty(exports, "configSetPointScaleFactor", try js.createFunction(configSetPointScaleFactor));
    try js.setNamedProperty(exports, "configGetPointScaleFactor", try js.createFunction(configGetPointScaleFactor));
    try js.setNamedProperty(exports, "configSetErrata", try js.createFunction(configSetErrata));
    try js.setNamedProperty(exports, "configGetErrata", try js.createFunction(configGetErrata));
    try js.setNamedProperty(exports, "configSetExperimentalFeatureEnabled", try js.createFunction(configSetExperimentalFeatureEnabled));
    try js.setNamedProperty(exports, "configIsExperimentalFeatureEnabled", try js.createFunction(configIsExperimentalFeatureEnabled));

    // Node creation and management
    try js.setNamedProperty(exports, "nodeNew", try js.createFunction(nodeNew));
    try js.setNamedProperty(exports, "nodeNewWithConfig", try js.createFunction(nodeNewWithConfig));
    try js.setNamedProperty(exports, "nodeClone", try js.createFunction(nodeClone));
    try js.setNamedProperty(exports, "nodeFree", try js.createFunction(nodeFree));
    try js.setNamedProperty(exports, "nodeFreeRecursive", try js.createFunction(nodeFreeRecursive));
    try js.setNamedProperty(exports, "nodeReset", try js.createFunction(nodeReset));
    try js.setNamedProperty(exports, "nodeCopyStyle", try js.createFunction(nodeCopyStyle));
    try js.setNamedProperty(exports, "nodeSetIsReferenceBaseline", try js.createFunction(nodeSetIsReferenceBaseline));
    try js.setNamedProperty(exports, "nodeIsReferenceBaseline", try js.createFunction(nodeIsReferenceBaseline));
    try js.setNamedProperty(exports, "nodeSetAlwaysFormsContainingBlock", try js.createFunction(nodeSetAlwaysFormsContainingBlock));

    // Node hierarchy management
    try js.setNamedProperty(exports, "nodeInsertChild", try js.createFunction(nodeInsertChild));
    try js.setNamedProperty(exports, "nodeRemoveChild", try js.createFunction(nodeRemoveChild));
    try js.setNamedProperty(exports, "nodeRemoveAllChildren", try js.createFunction(nodeRemoveAllChildren));
    try js.setNamedProperty(exports, "nodeGetChild", try js.createFunction(nodeGetChild));
    try js.setNamedProperty(exports, "nodeGetChildCount", try js.createFunction(nodeGetChildCount));
    try js.setNamedProperty(exports, "nodeGetParent", try js.createFunction(nodeGetParent));

    // Layout calculation
    try js.setNamedProperty(exports, "nodeCalculateLayout", try js.createFunction(nodeCalculateLayout));
    try js.setNamedProperty(exports, "nodeGetHasNewLayout", try js.createFunction(nodeGetHasNewLayout));
    try js.setNamedProperty(exports, "nodeSetHasNewLayout", try js.createFunction(nodeSetHasNewLayout));
    try js.setNamedProperty(exports, "nodeMarkDirty", try js.createFunction(nodeMarkDirty));
    try js.setNamedProperty(exports, "nodeIsDirty", try js.createFunction(nodeIsDirty));

    // Layout result access
    try js.setNamedProperty(exports, "nodeLayoutGetLeft", try js.createFunction(nodeLayoutGetLeft));
    try js.setNamedProperty(exports, "nodeLayoutGetTop", try js.createFunction(nodeLayoutGetTop));
    try js.setNamedProperty(exports, "nodeLayoutGetRight", try js.createFunction(nodeLayoutGetRight));
    try js.setNamedProperty(exports, "nodeLayoutGetBottom", try js.createFunction(nodeLayoutGetBottom));
    try js.setNamedProperty(exports, "nodeLayoutGetWidth", try js.createFunction(nodeLayoutGetWidth));
    try js.setNamedProperty(exports, "nodeLayoutGetHeight", try js.createFunction(nodeLayoutGetHeight));
    try js.setNamedProperty(exports, "nodeLayoutGetBorder", try js.createFunction(nodeLayoutGetBorder));
    try js.setNamedProperty(exports, "nodeLayoutGetMargin", try js.createFunction(nodeLayoutGetMargin));
    try js.setNamedProperty(exports, "nodeLayoutGetPadding", try js.createFunction(nodeLayoutGetPadding));

    // Style properties - Layout
    try js.setNamedProperty(exports, "nodeStyleSetDirection", try js.createFunction(nodeStyleSetDirection));
    try js.setNamedProperty(exports, "nodeStyleGetDirection", try js.createFunction(nodeStyleGetDirection));
    try js.setNamedProperty(exports, "nodeStyleSetFlexDirection", try js.createFunction(nodeStyleSetFlexDirection));
    try js.setNamedProperty(exports, "nodeStyleGetFlexDirection", try js.createFunction(nodeStyleGetFlexDirection));
    try js.setNamedProperty(exports, "nodeStyleSetJustifyContent", try js.createFunction(nodeStyleSetJustifyContent));
    try js.setNamedProperty(exports, "nodeStyleGetJustifyContent", try js.createFunction(nodeStyleGetJustifyContent));
    try js.setNamedProperty(exports, "nodeStyleSetAlignContent", try js.createFunction(nodeStyleSetAlignContent));
    try js.setNamedProperty(exports, "nodeStyleGetAlignContent", try js.createFunction(nodeStyleGetAlignContent));
    try js.setNamedProperty(exports, "nodeStyleSetAlignItems", try js.createFunction(nodeStyleSetAlignItems));
    try js.setNamedProperty(exports, "nodeStyleGetAlignItems", try js.createFunction(nodeStyleGetAlignItems));
    try js.setNamedProperty(exports, "nodeStyleSetAlignSelf", try js.createFunction(nodeStyleSetAlignSelf));
    try js.setNamedProperty(exports, "nodeStyleGetAlignSelf", try js.createFunction(nodeStyleGetAlignSelf));
    try js.setNamedProperty(exports, "nodeStyleSetPositionType", try js.createFunction(nodeStyleSetPositionType));
    try js.setNamedProperty(exports, "nodeStyleGetPositionType", try js.createFunction(nodeStyleGetPositionType));
    try js.setNamedProperty(exports, "nodeStyleSetFlexWrap", try js.createFunction(nodeStyleSetFlexWrap));
    try js.setNamedProperty(exports, "nodeStyleGetFlexWrap", try js.createFunction(nodeStyleGetFlexWrap));
    try js.setNamedProperty(exports, "nodeStyleSetOverflow", try js.createFunction(nodeStyleSetOverflow));
    try js.setNamedProperty(exports, "nodeStyleGetOverflow", try js.createFunction(nodeStyleGetOverflow));
    try js.setNamedProperty(exports, "nodeStyleSetDisplay", try js.createFunction(nodeStyleSetDisplay));
    try js.setNamedProperty(exports, "nodeStyleGetDisplay", try js.createFunction(nodeStyleGetDisplay));
    try js.setNamedProperty(exports, "nodeStyleSetBoxSizing", try js.createFunction(nodeStyleSetBoxSizing));
    try js.setNamedProperty(exports, "nodeStyleGetBoxSizing", try js.createFunction(nodeStyleGetBoxSizing));

    // Style properties - Flex
    try js.setNamedProperty(exports, "nodeStyleSetFlex", try js.createFunction(nodeStyleSetFlex));
    try js.setNamedProperty(exports, "nodeStyleGetFlex", try js.createFunction(nodeStyleGetFlex));
    try js.setNamedProperty(exports, "nodeStyleSetFlexGrow", try js.createFunction(nodeStyleSetFlexGrow));
    try js.setNamedProperty(exports, "nodeStyleGetFlexGrow", try js.createFunction(nodeStyleGetFlexGrow));
    try js.setNamedProperty(exports, "nodeStyleSetFlexShrink", try js.createFunction(nodeStyleSetFlexShrink));
    try js.setNamedProperty(exports, "nodeStyleGetFlexShrink", try js.createFunction(nodeStyleGetFlexShrink));
    try js.setNamedProperty(exports, "nodeStyleSetFlexBasis", try js.createFunction(nodeStyleSetFlexBasis));
    try js.setNamedProperty(exports, "nodeStyleSetFlexBasisPercent", try js.createFunction(nodeStyleSetFlexBasisPercent));
    try js.setNamedProperty(exports, "nodeStyleSetFlexBasisAuto", try js.createFunction(nodeStyleSetFlexBasisAuto));

    // Style properties - Position
    try js.setNamedProperty(exports, "nodeStyleSetPosition", try js.createFunction(nodeStyleSetPosition));
    try js.setNamedProperty(exports, "nodeStyleSetPositionPercent", try js.createFunction(nodeStyleSetPositionPercent));
    try js.setNamedProperty(exports, "nodeStyleSetPositionAuto", try js.createFunction(nodeStyleSetPositionAuto));

    // Style properties - Margin
    try js.setNamedProperty(exports, "nodeStyleSetMargin", try js.createFunction(nodeStyleSetMargin));
    try js.setNamedProperty(exports, "nodeStyleSetMarginPercent", try js.createFunction(nodeStyleSetMarginPercent));
    try js.setNamedProperty(exports, "nodeStyleSetMarginAuto", try js.createFunction(nodeStyleSetMarginAuto));

    // Style properties - Padding
    try js.setNamedProperty(exports, "nodeStyleSetPadding", try js.createFunction(nodeStyleSetPadding));
    try js.setNamedProperty(exports, "nodeStyleSetPaddingPercent", try js.createFunction(nodeStyleSetPaddingPercent));

    // Style properties - Border
    try js.setNamedProperty(exports, "nodeStyleSetBorder", try js.createFunction(nodeStyleSetBorder));
    try js.setNamedProperty(exports, "nodeStyleGetBorder", try js.createFunction(nodeStyleGetBorder));

    // Style properties - Gap
    try js.setNamedProperty(exports, "nodeStyleSetGap", try js.createFunction(nodeStyleSetGap));
    try js.setNamedProperty(exports, "nodeStyleSetGapPercent", try js.createFunction(nodeStyleSetGapPercent));

    // Style properties - Size
    try js.setNamedProperty(exports, "nodeStyleSetWidth", try js.createFunction(nodeStyleSetWidth));
    try js.setNamedProperty(exports, "nodeStyleSetWidthPercent", try js.createFunction(nodeStyleSetWidthPercent));
    try js.setNamedProperty(exports, "nodeStyleSetWidthAuto", try js.createFunction(nodeStyleSetWidthAuto));
    try js.setNamedProperty(exports, "nodeStyleSetHeight", try js.createFunction(nodeStyleSetHeight));
    try js.setNamedProperty(exports, "nodeStyleSetHeightPercent", try js.createFunction(nodeStyleSetHeightPercent));
    try js.setNamedProperty(exports, "nodeStyleSetHeightAuto", try js.createFunction(nodeStyleSetHeightAuto));
    try js.setNamedProperty(exports, "nodeStyleSetMinWidth", try js.createFunction(nodeStyleSetMinWidth));
    try js.setNamedProperty(exports, "nodeStyleSetMinWidthPercent", try js.createFunction(nodeStyleSetMinWidthPercent));
    try js.setNamedProperty(exports, "nodeStyleSetMinHeight", try js.createFunction(nodeStyleSetMinHeight));
    try js.setNamedProperty(exports, "nodeStyleSetMinHeightPercent", try js.createFunction(nodeStyleSetMinHeightPercent));
    try js.setNamedProperty(exports, "nodeStyleSetMaxWidth", try js.createFunction(nodeStyleSetMaxWidth));
    try js.setNamedProperty(exports, "nodeStyleSetMaxWidthPercent", try js.createFunction(nodeStyleSetMaxWidthPercent));
    try js.setNamedProperty(exports, "nodeStyleSetMaxHeight", try js.createFunction(nodeStyleSetMaxHeight));
    try js.setNamedProperty(exports, "nodeStyleSetMaxHeightPercent", try js.createFunction(nodeStyleSetMaxHeightPercent));

    // Style properties - Aspect Ratio
    try js.setNamedProperty(exports, "nodeStyleSetAspectRatio", try js.createFunction(nodeStyleSetAspectRatio));
    try js.setNamedProperty(exports, "nodeStyleGetAspectRatio", try js.createFunction(nodeStyleGetAspectRatio));

    // Value getters (return {unit, value})
    try js.setNamedProperty(exports, "nodeStyleGetWidth", try js.createFunction(nodeStyleGetWidth));
    try js.setNamedProperty(exports, "nodeStyleGetHeight", try js.createFunction(nodeStyleGetHeight));
    try js.setNamedProperty(exports, "nodeStyleGetMinWidth", try js.createFunction(nodeStyleGetMinWidth));
    try js.setNamedProperty(exports, "nodeStyleGetMinHeight", try js.createFunction(nodeStyleGetMinHeight));
    try js.setNamedProperty(exports, "nodeStyleGetMaxWidth", try js.createFunction(nodeStyleGetMaxWidth));
    try js.setNamedProperty(exports, "nodeStyleGetMaxHeight", try js.createFunction(nodeStyleGetMaxHeight));
    try js.setNamedProperty(exports, "nodeStyleGetMargin", try js.createFunction(nodeStyleGetMargin));
    try js.setNamedProperty(exports, "nodeStyleGetPadding", try js.createFunction(nodeStyleGetPadding));
    try js.setNamedProperty(exports, "nodeStyleGetPosition", try js.createFunction(nodeStyleGetPosition));
    try js.setNamedProperty(exports, "nodeStyleGetGap", try js.createFunction(nodeStyleGetGap));
    try js.setNamedProperty(exports, "nodeStyleGetFlexBasis", try js.createFunction(nodeStyleGetFlexBasis));

    // Callback functions
    try js.setNamedProperty(exports, "nodeSetMeasureFunc", try js.createFunction(nodeSetMeasureFunc));
    try js.setNamedProperty(exports, "nodeUnsetMeasureFunc", try js.createFunction(nodeUnsetMeasureFunc));
    try js.setNamedProperty(exports, "nodeHasMeasureFunc", try js.createFunction(nodeHasMeasureFunc));
    try js.setNamedProperty(exports, "nodeSetBaselineFunc", try js.createFunction(nodeSetBaselineFunc));
    try js.setNamedProperty(exports, "nodeUnsetBaselineFunc", try js.createFunction(nodeUnsetBaselineFunc));
    try js.setNamedProperty(exports, "nodeHasBaselineFunc", try js.createFunction(nodeHasBaselineFunc));
    try js.setNamedProperty(exports, "nodeSetDirtiedFunc", try js.createFunction(nodeSetDirtiedFunc));
    try js.setNamedProperty(exports, "nodeUnsetDirtiedFunc", try js.createFunction(nodeUnsetDirtiedFunc));
    try js.setNamedProperty(exports, "nodeHasDirtiedFunc", try js.createFunction(nodeHasDirtiedFunc));

    return exports;
}

//=============================================================================
// TESTS
//=============================================================================

test "basic yoga test" {
    const root = c.YGNodeNew();
    defer c.YGNodeFree(root);

    c.YGNodeStyleSetFlexDirection(root, c.YGFlexDirectionRow);
    c.YGNodeStyleSetWidth(root, 100);
    c.YGNodeStyleSetHeight(root, 100);

    const child0 = c.YGNodeNew();
    defer c.YGNodeFree(child0);
    c.YGNodeStyleSetFlexGrow(child0, 1);
    c.YGNodeStyleSetMargin(child0, c.YGEdgeRight, 10);
    c.YGNodeInsertChild(root, child0, 0);

    const child1 = c.YGNodeNew();
    defer c.YGNodeFree(child1);
    c.YGNodeStyleSetFlexGrow(child1, 1);
    c.YGNodeInsertChild(root, child1, 1);

    c.YGNodeCalculateLayout(root, c.YGUndefined, c.YGUndefined, c.YGDirectionLTR);

    const child0Width = c.YGNodeLayoutGetWidth(child0);
    const child1Width = c.YGNodeLayoutGetWidth(child1);

    // With flex grow 1 each and 10px margin, children should split 90px (100-10)
    try std.testing.expectApproxEqAbs(@as(f32, 45), child0Width, 0.1);
    try std.testing.expectApproxEqAbs(@as(f32, 45), child1Width, 0.1);
}
