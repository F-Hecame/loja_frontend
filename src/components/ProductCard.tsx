import type { Product } from "../types";
import { money } from "../lib/format";

export default function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <article className="card product">
      <div className="thumb">
        {product.image ? (
          <img src={product.image} alt="" loading="lazy" />
        ) : (
          <span aria-hidden>{product.title.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div className="product-body">
        <div className="tags">
          {product.category && <span className="tag">{product.category}</span>}
          {product.origem === "local" && <span className="tag local">local</span>}
        </div>
        <h3 title={product.title}>{product.title}</h3>
        <p className="muted clamp">{product.description}</p>
      </div>
      <div className="product-foot">
        <strong className="price">{money(product.price)}</strong>
        <button className="btn primary" onClick={onAdd}>
          Adicionar
        </button>
      </div>
    </article>
  );
}
