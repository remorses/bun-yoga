const std = @import("std");
const yoga = @import("yoga-zig");

// Re-export types
const Node = yoga.Node;
const enums = yoga.enums;

// Opaque pointer type for C ABI
pub const YGNodeRef = ?*anyopaque;

// ============================================================================
// Node Creation/Destruction
// ============================================================================

export fn yg_node_create() YGNodeRef {
    const node = Node.new();
    return @ptrCast(node.handle);
}

export fn yg_node_free(ptr: YGNodeRef) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.free();
    }
}

export fn yg_node_free_recursive(ptr: YGNodeRef) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.freeRecursive();
    }
}

export fn yg_node_reset(ptr: YGNodeRef) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.reset();
    }
}

// ============================================================================
// Child Management
// ============================================================================

export fn yg_node_insert_child(parent_ptr: YGNodeRef, child_ptr: YGNodeRef, index: u32) void {
    if (parent_ptr) |pp| {
        if (child_ptr) |cp| {
            const parent = Node{ .handle = @ptrCast(pp) };
            const child = Node{ .handle = @ptrCast(cp) };
            parent.insertChild(child, index);
        }
    }
}

export fn yg_node_remove_child(parent_ptr: YGNodeRef, child_ptr: YGNodeRef) void {
    if (parent_ptr) |pp| {
        if (child_ptr) |cp| {
            const parent = Node{ .handle = @ptrCast(pp) };
            const child = Node{ .handle = @ptrCast(cp) };
            parent.removeChild(child);
        }
    }
}

export fn yg_node_get_child_count(ptr: YGNodeRef) u32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return @intCast(node.getChildCount());
    }
    return 0;
}

export fn yg_node_get_child(ptr: YGNodeRef, index: u32) YGNodeRef {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        const child = node.getChild(index);
        return @ptrCast(child.handle);
    }
    return null;
}

export fn yg_node_get_parent(ptr: YGNodeRef) YGNodeRef {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        if (node.getParent()) |parent| {
            return @ptrCast(parent.handle);
        }
    }
    return null;
}

// ============================================================================
// Layout Calculation
// ============================================================================

export fn yg_node_calculate_layout(ptr: YGNodeRef, width: f32, height: f32, direction: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        const w: ?f32 = if (width < 0) null else width;
        const h: ?f32 = if (height < 0) null else height;
        node.calculateLayout(w, h, @enumFromInt(direction));
    }
}

// ============================================================================
// Computed Layout Getters
// ============================================================================

export fn yg_node_get_computed_width(ptr: YGNodeRef) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedWidth();
    }
    return 0;
}

export fn yg_node_get_computed_height(ptr: YGNodeRef) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedHeight();
    }
    return 0;
}

export fn yg_node_get_computed_left(ptr: YGNodeRef) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedLeft();
    }
    return 0;
}

export fn yg_node_get_computed_top(ptr: YGNodeRef) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedTop();
    }
    return 0;
}

export fn yg_node_get_computed_right(ptr: YGNodeRef) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedRight();
    }
    return 0;
}

export fn yg_node_get_computed_bottom(ptr: YGNodeRef) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedBottom();
    }
    return 0;
}

export fn yg_node_get_computed_border(ptr: YGNodeRef, edge: u32) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedBorder(@enumFromInt(edge));
    }
    return 0;
}

export fn yg_node_get_computed_margin(ptr: YGNodeRef, edge: u32) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedMargin(@enumFromInt(edge));
    }
    return 0;
}

export fn yg_node_get_computed_padding(ptr: YGNodeRef, edge: u32) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedPadding(@enumFromInt(edge));
    }
    return 0;
}

// ============================================================================
// Dirty State
// ============================================================================

export fn yg_node_is_dirty(ptr: YGNodeRef) bool {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.isDirty();
    }
    return false;
}

export fn yg_node_mark_dirty(ptr: YGNodeRef) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.markDirty();
    }
}

// ============================================================================
// Style Setters
// ============================================================================

export fn yg_node_set_direction(ptr: YGNodeRef, direction: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setDirection(@enumFromInt(direction));
    }
}

export fn yg_node_set_flex_direction(ptr: YGNodeRef, direction: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexDirection(@enumFromInt(direction));
    }
}

export fn yg_node_set_justify_content(ptr: YGNodeRef, justify: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setJustifyContent(@enumFromInt(justify));
    }
}

export fn yg_node_set_align_content(ptr: YGNodeRef, align_content: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setAlignContent(@enumFromInt(align_content));
    }
}

export fn yg_node_set_align_items(ptr: YGNodeRef, align_items: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setAlignItems(@enumFromInt(align_items));
    }
}

export fn yg_node_set_align_self(ptr: YGNodeRef, align_self: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setAlignSelf(@enumFromInt(align_self));
    }
}

export fn yg_node_set_position_type(ptr: YGNodeRef, position_type: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPositionType(@enumFromInt(position_type));
    }
}

export fn yg_node_set_flex_wrap(ptr: YGNodeRef, wrap: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexWrap(@enumFromInt(wrap));
    }
}

export fn yg_node_set_overflow(ptr: YGNodeRef, overflow: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setOverflow(@enumFromInt(overflow));
    }
}

export fn yg_node_set_display(ptr: YGNodeRef, display: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setDisplay(@enumFromInt(display));
    }
}

export fn yg_node_set_flex(ptr: YGNodeRef, flex: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlex(flex);
    }
}

export fn yg_node_set_flex_grow(ptr: YGNodeRef, grow: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexGrow(grow);
    }
}

export fn yg_node_set_flex_shrink(ptr: YGNodeRef, shrink: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexShrink(shrink);
    }
}

export fn yg_node_set_flex_basis_percent(ptr: YGNodeRef, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexBasisPercent(percent);
    }
}

export fn yg_node_set_flex_basis_auto(ptr: YGNodeRef) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexBasisAuto();
    }
}

export fn yg_node_set_width(ptr: YGNodeRef, width: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setWidth(width);
    }
}

export fn yg_node_set_width_percent(ptr: YGNodeRef, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setWidthPercent(percent);
    }
}

export fn yg_node_set_width_auto(ptr: YGNodeRef) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setWidthAuto();
    }
}

export fn yg_node_set_height(ptr: YGNodeRef, height: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setHeight(height);
    }
}

export fn yg_node_set_height_percent(ptr: YGNodeRef, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setHeightPercent(percent);
    }
}

export fn yg_node_set_height_auto(ptr: YGNodeRef) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setHeightAuto();
    }
}

export fn yg_node_set_min_width(ptr: YGNodeRef, min_width: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMinWidth(min_width);
    }
}

export fn yg_node_set_min_height(ptr: YGNodeRef, min_height: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMinHeight(min_height);
    }
}

export fn yg_node_set_max_width(ptr: YGNodeRef, max_width: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMaxWidth(max_width);
    }
}

export fn yg_node_set_max_height(ptr: YGNodeRef, max_height: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMaxHeight(max_height);
    }
}

export fn yg_node_set_aspect_ratio(ptr: YGNodeRef, aspect_ratio: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setAspectRatio(aspect_ratio);
    }
}

export fn yg_node_set_margin(ptr: YGNodeRef, edge: u32, margin: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMargin(@enumFromInt(edge), margin);
    }
}

export fn yg_node_set_margin_percent(ptr: YGNodeRef, edge: u32, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMarginPercent(@enumFromInt(edge), percent);
    }
}

export fn yg_node_set_margin_auto(ptr: YGNodeRef, edge: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMarginAuto(@enumFromInt(edge));
    }
}

export fn yg_node_set_padding(ptr: YGNodeRef, edge: u32, padding: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPadding(@enumFromInt(edge), padding);
    }
}

export fn yg_node_set_padding_percent(ptr: YGNodeRef, edge: u32, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPaddingPercent(@enumFromInt(edge), percent);
    }
}

export fn yg_node_set_border(ptr: YGNodeRef, edge: u32, border: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setBorder(@enumFromInt(edge), border);
    }
}

export fn yg_node_set_position(ptr: YGNodeRef, edge: u32, position: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPosition(@enumFromInt(edge), position);
    }
}

export fn yg_node_set_gap(ptr: YGNodeRef, gutter: u32, gap: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setGap(@enumFromInt(gutter), gap);
    }
}

// ============================================================================
// Style Getters
// ============================================================================

export fn yg_node_get_flex_grow(ptr: YGNodeRef) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getFlexGrow();
    }
    return 0;
}

export fn yg_node_get_flex_shrink(ptr: YGNodeRef) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getFlexShrink();
    }
    return 0;
}

export fn yg_node_get_aspect_ratio(ptr: YGNodeRef) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getAspectRatio();
    }
    return 0;
}

export fn yg_node_get_border(ptr: YGNodeRef, edge: u32) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getBorder(@enumFromInt(edge));
    }
    return 0;
}
