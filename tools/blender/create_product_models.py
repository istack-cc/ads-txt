from __future__ import annotations

import math
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "public" / "models"

PRODUCTS = [
    {
        "id": "fitflow",
        "name": "FIT\nFLOW",
        "front": (0.02, 0.68, 0.55, 1),
        "side": (0.02, 0.14, 0.48, 1),
        "text": (1, 1, 1, 1),
    },
    {
        "id": "storeops",
        "name": "STORE\nOPS",
        "front": (0.93, 0.98, 1, 1),
        "side": (0.24, 0.62, 0.73, 1),
        "text": (0.05, 0.08, 0.11, 1),
    },
    {
        "id": "adkit",
        "name": "AD\nKIT",
        "front": (1, 0.70, 0.16, 1),
        "side": (0.72, 0.12, 0.20, 1),
        "text": (0.12, 0.07, 0.02, 1),
    },
    {
        "id": "launchpad",
        "name": "LAUNCH\nPAD",
        "front": (0.56, 0.34, 1, 1),
        "side": (0.55, 0.72, 0.10, 1),
        "text": (1, 1, 1, 1),
    },
]


def material(name: str, color: tuple[float, float, float, float]) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = 0.48
    bsdf.inputs["Metallic"].default_value = 0.03
    return mat


def create_package(product: dict[str, object]) -> bpy.types.Object:
    front = material(f"{product['id']}_front", product["front"])
    side = material(f"{product['id']}_spine", product["side"])
    text_mat = material(f"{product['id']}_text", product["text"])

    bpy.ops.mesh.primitive_cube_add(size=1)
    box = bpy.context.object
    box.name = f"{product['id']}_package"
    box.dimensions = (1.18, 1.82, 0.28)
    box.location = (0, 0, 0)
    box.data.materials.append(front)
    box.data.materials.append(side)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    bevel = box.modifiers.new("soft_package_edges", "BEVEL")
    bevel.width = 0.045
    bevel.segments = 6
    box.modifiers.new("weighted_package_normals", "WEIGHTED_NORMAL")

    bpy.ops.object.text_add(location=(-0.42, -0.28, 0.151), rotation=(0, 0, 0))
    label = bpy.context.object
    label.name = f"{product['id']}_label"
    label.data.body = str(product["name"])
    label.data.align_x = "LEFT"
    label.data.align_y = "CENTER"
    label.data.size = 0.26
    label.data.extrude = 0.008
    label.data.materials.append(text_mat)

    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.73, 0.158))
    band = bpy.context.object
    band.name = f"{product['id']}_bottom_band"
    band.dimensions = (0.94, 0.08, 0.012)
    band.data.materials.append(side)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    return box


def export_product(product: dict[str, object]) -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()

    create_package(product)

    bpy.ops.object.light_add(type="AREA", location=(0, -2.2, 3.4))
    key = bpy.context.object
    key.name = "large_softbox"
    key.data.energy = 420
    key.data.size = 4

    bpy.ops.object.camera_add(location=(0, -4, 1.1), rotation=(math.radians(77), 0, 0))
    bpy.context.scene.camera = bpy.context.object

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(OUT_DIR / f"{product['id']}.glb"),
        export_format="GLB",
        use_selection=False,
    )


def main() -> None:
    for product in PRODUCTS:
        export_product(product)


if __name__ == "__main__":
    main()
