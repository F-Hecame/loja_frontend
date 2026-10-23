import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Empty from "../components/Empty";
import ErrorBox from "../components/ErrorBox";
import { useToast } from "../components/Toast";
import { errorMessage, listOrders, pay } from "../lib/api";
import { formatDate, money } from "../lib/format";
import { useAsync } from "../lib/useAsync";
import type { PaymentMethod } from "../types";

export default function Payments() {
  const notify = useToast();
  const [method, setMethod] = useState<PaymentMethod>("crédito");
  const [paying, setPaying] = useState(false);

  const { data, error, loading, reload } = useAsync((signal) => listOrders(signal), []);
  const orders = data?.pedidos ?? [];
  const total = data?.total ?? 0;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPaying(true);
    try {
      const r = await pay(method);
      notify("success", `Pagamento de ${money(r.total)} realizado via ${r.metodo.toUpperCase()}. Pedidos quitados.`);
    } catch (err) {
      notify("error", errorMessage(err));
    } finally {
      setPaying(false);
      reload();
    }
  }

  return (
    <>
      <h1>Pagamentos</h1>

      {error && <ErrorBox error={error} onRetry={reload} />}

      {!data && loading ? (
        <p className="muted">Carregando pedidos…</p>
      ) : orders.length === 0 ? (
        !error && (
          <Empty icon="🧾">
            Nenhum pedido pendente. <Link to="/catalogo">Ir ao catálogo</Link>
          </Empty>
        )
      ) : (
        <div className="split">
          <div className="stack">
            {orders.map((o) => (
              <section className="card" key={o.id}>
                <header className="order-head">
                  <div>
                    <strong>{o.cliente.nome ?? "Cliente não informado"}</strong>
                    <div className="muted small-text">
                      {o.cliente.cpf && `CPF ${o.cliente.cpf} · `}
                      {formatDate(o.criado_em)}
                    </div>
                  </div>
                  <strong>{money(o.total)}</strong>
                </header>
                <ul className="items">
                  {o.itens.map((i) => (
                    <li key={i.id}>
                      <span>
                        {i.qtd}× {i.nome}
                      </span>
                      <span>{money(i.preco * i.qtd)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <form className="card form" onSubmit={submit}>
            <h2>Pagar</h2>
            <p className="total-line">
              Valor total dos pedidos <strong>{money(total)}</strong>
            </p>
            <label>
              Forma de pagamento
              <select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
                <option value="crédito">Crédito</option>
                <option value="débito">Débito</option>
                <option value="dinheiro">Dinheiro</option>
              </select>
            </label>
            <button className="btn primary" type="submit" disabled={paying}>
              Pagar {money(total)}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
