import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Empty from "../components/Empty";
import ErrorBox from "../components/ErrorBox";
import { useToast } from "../components/Toast";
import { listProducts } from "../lib/api";
import { PROMO_LIMIT } from "../lib/cart";
import { money } from "../lib/format";
import { useAsync } from "../lib/useAsync";
import { useCart } from "../lib/useCart";

type Origem = "todos" | "local" | "api";

export default function Catalog() {
  const { dispatch } = useCart();
  const notify = useToast();
  const [promo, setPromo] = useState(false);
  const [origem, setOrigem] = useState<Origem>("local");
  const [query, setQuery] = useState("");

  const { data, error, loading, reload } = useAsync(
    (signal) => listProducts({ origem: origem === "todos" ? undefined : origem, promocao: promo }, signal),
    [origem, promo],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.produtos ?? []).filter(
      (p) => !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [data, query]);

  return (
    <>
      <h1>Catálogo de produtos</h1>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Buscar produto…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar produto"
        />
        <select
          value={origem}
          onChange={(e) => setOrigem(e.target.value as Origem)}
          aria-label="Origem dos produtos"
          className="inline-select"
        >
          <option value="local">Meus produtos</option>
          <option value="api">Fake Store API</option>
          <option value="todos">Todos</option>
        </select>
        <label className="check">
          <input type="checkbox" checked={promo} onChange={(e) => setPromo(e.target.checked)} />
          Só promoção (abaixo de {money(PROMO_LIMIT)})
        </label>
      </div>

      {error && <ErrorBox error={error} onRetry={reload} />}
      {data && !data.api_externa_disponivel && origem !== "local" && (
        <div className="alert error" role="alert">
          <span>O backend não conseguiu acessar a Fake Store API. Mostrando apenas os produtos locais.</span>
          <button className="btn small" onClick={reload}>
            Tentar de novo
          </button>
        </div>
      )}

      {!data && loading ? (
        <p className="muted">Carregando produtos…</p>
      ) : visible.length === 0 ? (
        !error &&
        (origem === "local" && !promo && !query.trim() ? (
          <Empty icon="📦">
            Você ainda não cadastrou nenhum produto. <Link to="/cadastros">Cadastrar agora</Link>
          </Empty>
        ) : (
          <Empty icon="📭">Nenhum produto para exibir.</Empty>
        ))
      ) : (
        <div className="grid">
          {visible.map((p) => (
            <ProductCard
              key={`${p.origem}-${p.id}`}
              product={p}
              onAdd={() => {
                dispatch({ type: "add", product: p });
                notify("success", `“${p.title}” adicionado ao pedido.`);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
