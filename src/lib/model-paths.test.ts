import { describe, expect, it } from "vitest";
import { products } from "../components/product-data";
import { getProductModelPath } from "./model-paths";

describe("getProductModelPath", () => {
  it("returns public GLB paths for every product", () => {
    expect(products.map((product) => getProductModelPath(product))).toEqual([
      "/models/fitflow.glb",
      "/models/storeops.glb",
      "/models/adkit.glb",
      "/models/launchpad.glb",
    ]);
  });

  it("keeps every product connected to a unique model file", () => {
    const paths = products.map((product) => getProductModelPath(product));

    expect(new Set(paths).size).toBe(products.length);
    expect(paths.every((path) => path.startsWith("/models/"))).toBe(true);
    expect(paths.every((path) => path.endsWith(".glb"))).toBe(true);
  });
});
