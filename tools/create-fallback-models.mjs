import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/models");

const products = [
  { id: "fitflow", front: [0.02, 0.68, 0.55, 1], side: [0.02, 0.14, 0.48, 1] },
  { id: "storeops", front: [0.93, 0.98, 1, 1], side: [0.24, 0.62, 0.73, 1] },
  { id: "adkit", front: [1, 0.7, 0.16, 1], side: [0.72, 0.12, 0.2, 1] },
  { id: "launchpad", front: [0.56, 0.34, 1, 1], side: [0.55, 0.72, 0.1, 1] },
];

const faces = [
  {
    name: "front",
    material: 0,
    normal: [0, 0, 1],
    vertices: [
      [-0.6, -0.9, 0.14],
      [0.6, -0.9, 0.14],
      [0.6, 0.9, 0.14],
      [-0.6, 0.9, 0.14],
    ],
  },
  {
    name: "back",
    material: 1,
    normal: [0, 0, -1],
    vertices: [
      [0.6, -0.9, -0.14],
      [-0.6, -0.9, -0.14],
      [-0.6, 0.9, -0.14],
      [0.6, 0.9, -0.14],
    ],
  },
  {
    name: "left_spine",
    material: 1,
    normal: [-1, 0, 0],
    vertices: [
      [-0.6, -0.9, -0.14],
      [-0.6, -0.9, 0.14],
      [-0.6, 0.9, 0.14],
      [-0.6, 0.9, -0.14],
    ],
  },
  {
    name: "right_spine",
    material: 1,
    normal: [1, 0, 0],
    vertices: [
      [0.6, -0.9, 0.14],
      [0.6, -0.9, -0.14],
      [0.6, 0.9, -0.14],
      [0.6, 0.9, 0.14],
    ],
  },
  {
    name: "top",
    material: 1,
    normal: [0, 1, 0],
    vertices: [
      [-0.6, 0.9, 0.14],
      [0.6, 0.9, 0.14],
      [0.6, 0.9, -0.14],
      [-0.6, 0.9, -0.14],
    ],
  },
  {
    name: "bottom",
    material: 1,
    normal: [0, -1, 0],
    vertices: [
      [-0.6, -0.9, -0.14],
      [0.6, -0.9, -0.14],
      [0.6, -0.9, 0.14],
      [-0.6, -0.9, 0.14],
    ],
  },
];

function align(value, multiple = 4) {
  return Math.ceil(value / multiple) * multiple;
}

function pushAligned(chunks, buffer) {
  const padding = align(buffer.byteLength) - buffer.byteLength;
  chunks.push(buffer);
  if (padding > 0) {
    chunks.push(Buffer.alloc(padding));
  }
  return align(buffer.byteLength);
}

function floats(values) {
  const buffer = Buffer.alloc(values.length * 4);
  values.forEach((value, index) => buffer.writeFloatLE(value, index * 4));
  return buffer;
}

function uint16(values) {
  const buffer = Buffer.alloc(values.length * 2);
  values.forEach((value, index) => buffer.writeUInt16LE(value, index * 2));
  return buffer;
}

function createGlb(product) {
  const bufferViews = [];
  const accessors = [];
  const primitives = [];
  const chunks = [];
  let byteOffset = 0;

  function addBufferView(buffer, target) {
    const view = {
      buffer: 0,
      byteOffset,
      byteLength: buffer.byteLength,
      target,
    };
    bufferViews.push(view);
    byteOffset += pushAligned(chunks, buffer);
    return bufferViews.length - 1;
  }

  function addAccessor(bufferView, componentType, type, count, min, max) {
    accessors.push({ bufferView, componentType, count, type, min, max });
    return accessors.length - 1;
  }

  for (const face of faces) {
    const positions = face.vertices.flat();
    const normals = Array.from({ length: 4 }, () => face.normal).flat();
    const indices = [0, 1, 2, 0, 2, 3];
    const min = [0, 1, 2].map((axis) =>
      Math.min(...face.vertices.map((vertex) => vertex[axis])),
    );
    const max = [0, 1, 2].map((axis) =>
      Math.max(...face.vertices.map((vertex) => vertex[axis])),
    );

    const positionAccessor = addAccessor(
      addBufferView(floats(positions), 34962),
      5126,
      "VEC3",
      4,
      min,
      max,
    );
    const normalAccessor = addAccessor(
      addBufferView(floats(normals), 34962),
      5126,
      "VEC3",
      4,
      undefined,
      undefined,
    );
    const indexAccessor = addAccessor(
      addBufferView(uint16(indices), 34963),
      5123,
      "SCALAR",
      indices.length,
      [0],
      [3],
    );

    primitives.push({
      attributes: {
        POSITION: positionAccessor,
        NORMAL: normalAccessor,
      },
      indices: indexAccessor,
      material: face.material,
      mode: 4,
    });
  }

  const bin = Buffer.concat(chunks);
  const json = {
    asset: { version: "2.0", generator: "play-store-portfolio fallback generator" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: `${product.id}_package` }],
    meshes: [{ primitives, name: `${product.id}_box` }],
    materials: [
      {
        name: `${product.id}_front`,
        pbrMetallicRoughness: {
          baseColorFactor: product.front,
          metallicFactor: 0.02,
          roughnessFactor: 0.42,
        },
      },
      {
        name: `${product.id}_spine`,
        pbrMetallicRoughness: {
          baseColorFactor: product.side,
          metallicFactor: 0.02,
          roughnessFactor: 0.58,
        },
      },
    ],
    buffers: [{ byteLength: bin.byteLength }],
    bufferViews,
    accessors: accessors.map((accessor) => {
      const clean = { ...accessor };
      if (!clean.min) delete clean.min;
      if (!clean.max) delete clean.max;
      return clean;
    }),
  };

  const jsonBuffer = Buffer.from(JSON.stringify(json), "utf8");
  const paddedJson = Buffer.concat([
    jsonBuffer,
    Buffer.alloc(align(jsonBuffer.byteLength) - jsonBuffer.byteLength, 0x20),
  ]);
  const paddedBin = Buffer.concat([
    bin,
    Buffer.alloc(align(bin.byteLength) - bin.byteLength),
  ]);
  const totalLength = 12 + 8 + paddedJson.byteLength + 8 + paddedBin.byteLength;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(paddedJson.byteLength, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(paddedBin.byteLength, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);

  return Buffer.concat([header, jsonHeader, paddedJson, binHeader, paddedBin]);
}

await mkdir(outDir, { recursive: true });

for (const product of products) {
  await writeFile(resolve(outDir, `${product.id}.glb`), createGlb(product));
}

console.log(`Generated ${products.length} GLB fallback models in ${outDir}`);
