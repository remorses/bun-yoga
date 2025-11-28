const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // Get yoga-zig dependency
    const yoga_zig_dep = b.dependency("yoga-zig", .{
        .target = target,
        .optimize = optimize,
    });

    // ========================================================================
    // FFI Library (for Bun FFI)
    // ========================================================================

    // Create the FFI library module
    const ffi_mod = b.createModule(.{
        .root_source_file = b.path("src/yoga_ffi.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add yoga-zig as an import
    ffi_mod.addImport("yoga-zig", yoga_zig_dep.module("yoga-zig"));

    // Create the FFI dynamic library
    const ffi_lib = b.addLibrary(.{
        .name = "yoga",
        .linkage = .dynamic,
        .root_module = ffi_mod,
    });

    // Link yoga-zig artifact
    ffi_lib.linkLibrary(yoga_zig_dep.artifact("yoga-zig"));

    // Build the FFI lib
    b.installArtifact(ffi_lib);

    // ========================================================================
    // Tests
    // ========================================================================

    const test_mod = b.createModule(.{
        .root_source_file = b.path("src/yoga_ffi.zig"),
        .target = target,
        .optimize = optimize,
    });
    test_mod.addImport("yoga-zig", yoga_zig_dep.module("yoga-zig"));

    const lib_unit_tests = b.addTest(.{
        .root_module = test_mod,
    });
    lib_unit_tests.linkLibrary(yoga_zig_dep.artifact("yoga-zig"));

    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
}
