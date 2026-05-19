import type { Product } from "@/components/product-data";
import { ProductScene } from "@/components/product-scene";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <ProductScene
        className="product-card__scene"
        products={[product]}
        variant="card"
      />
      <div className="product-card__body">
        <span>{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.detail}</p>
      </div>
    </article>
  );
}
