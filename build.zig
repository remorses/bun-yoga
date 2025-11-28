const std = @import("std");
const napigen = @import("napigen");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // Get yoga-zig dependency
    const yoga_zig_dep = b.dependency("yoga-zig", .{
        .target = target,
        .optimize = optimize,
    });

    // ========================================================================
    // NAPI Library (for Node.js/Bun require())
    // ========================================================================

    // Create the main library module
    const lib_mod = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add yoga-zig as an import
    lib_mod.addImport("yoga-zig", yoga_zig_dep.module("yoga-zig"));

    // Create the dynamic library
    const lib = b.addLibrary(.{
        .name = "yoga_napi",
        .linkage = .dynamic,
        .root_module = lib_mod,
    });

    // Link yoga-zig artifact
    lib.linkLibrary(yoga_zig_dep.artifact("yoga-zig"));

    // Add napigen
    napigen.setup(lib);

    // Build the lib
    b.installArtifact(lib);

    // Copy the result to a *.node file so we can require() it
    const copy_node_step = b.addInstallLibFile(lib.getEmittedBin(), "yoga_napi.node");
    b.getInstallStep().dependOn(&copy_node_step.step);

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
        .name = "yoga_ffi",
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

    // Tests - test the wrapper file which doesn't need napigen
    const test_mod = b.createModule(.{
        .root_source_file = b.path("src/yoga_wrapper.zig"),
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
