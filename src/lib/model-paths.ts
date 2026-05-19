import type { Product } from "@/components/product-data";

export function getProductModelPath(product: Pick<Product, "id">) {
  return `/models/${product.id}.glb`;
}
