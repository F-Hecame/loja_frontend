import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Empty from "../components/Empty";
import { useToast } from "../components/Toast";
import { createOrder, errorMessage } from "../lib/api";
import { cartTotal } from "../lib/cart";
import { isValidCpf, maskCpf, money } from "../lib/format";
import { useCart } from "../lib/useCart";

export default function Cart() {
  const { cart, dispatch } = useCart();
  const notify = useToast();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [sending, setSending] = useState(false);

  async function finalize(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return notify("error", "Informe o nome do cliente.");
    if (!isValidCpf(cpf)) return notify("error", "CPF inválido.");
    setSending(true);
    try {
      await createOrder({
        cliente: { nome: nome.trim(), cpf },
        itens: cart.map((i) => ({ id: i.id, qtd: i.qty })),
      });
      dispatch({ type: "clear" });
      setNome("");
      setCpf("");
      notify("success", "Pedido finalizado. Ele já aparece em Pagamentos.");
    } catch (err) {
      notify("error", errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <h1>Pedido atual</h1>

      {cart.length === 0 ? (
        <Empty icon="🛒">
          Nenhum item no pedido. <Link to="/catalogo">Ir ao catálogo</Link>
        </Empty>
      ) : (
        <div className="split">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="num">Preço</th>
                  <th>Qtd.</th>
                  <th className="num">Subtotal</th>
                  <th aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {cart.map((i) => (
                  <tr key={i.id}>
                    <td>{i.title}</td>
                    <td className="num">{money(i.price)}</td>
                    <td>
                      <div className="qty">
                        <button
                          className="btn small"
                          aria-label={`Diminuir ${i.title}`}
                          onClick={() => dispatch({ type: "setQty", id: i.id, qty: i.qty - 1 })}
                        >
                          −
                        </button>
                        <span>{i.qty}</span>
                        <button
                          className="btn small"
                          aria-label={`Aumentar ${i.title}`}
                          onClick={() => dispatch({ type: "setQty", id: i.id, qty: i.qty + 1 })}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="num">{money(i.price * i.qty)}</td>
                    <td className="row-actions">
                      <button
                        className="btn small danger"
                        onClick={() => {
                          dispatch({ type: "remove", id: i.id });
                          notify("success", `Item removido: ${i.title}`);
                        }}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>Total</td>
                  <td className="num">
                    <strong>{money(cartTotal(cart))}</strong>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          <form className="card form" onSubmit={finalize}>
            <h2>Finalizar pedido</h2>
            <label>
              Nome do cliente
              <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" required />
            </label>
            <label>
              CPF
              <input
                value={cpf}
                onChange={(e) => setCpf(maskCpf(e.target.value))}
                inputMode="numeric"
                placeholder="000.000.000-00"
                required
              />
            </label>
            <button className="btn primary" type="submit" disabled={sending}>
              Finalizar pedido
            </button>
          </form>
        </div>
      )}
    </>
  );
}
