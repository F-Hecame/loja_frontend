import { useState, type FormEvent } from "react";
import Empty from "../components/Empty";
import ErrorBox from "../components/ErrorBox";
import { useToast } from "../components/Toast";
import { createProduct, deleteProduct, errorMessage, listProducts, updateProduct } from "../lib/api";
import { money } from "../lib/format";
import { useAsync } from "../lib/useAsync";

const empty = { title: "", price: "", description: "" };

export default function Products() {
  const notify = useToast();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { data, error, loading, reload } = useAsync((signal) => listProducts({ origem: "local" }, signal), []);
  const products = data?.produtos ?? [];

  const set = (field: keyof typeof empty) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const price = Number(form.price.replace(",", "."));
    if (!form.title.trim()) return notify("error", "Informe o nome.");
    if (form.price.trim() === "" || !Number.isFinite(price) || price < 0) return notify("error", "Preço inválido.");

    const input = { title: form.title.trim(), price, description: form.description.trim() };
    setSaving(true);
    try {
      if (editingId === null) {
        await createProduct(input);
        notify("success", `“${input.title}” cadastrado com sucesso.`);
      } else {
        await updateProduct(editingId, input);
        notify("success", "Produto atualizado com sucesso.");
      }
      reset();
      reload();
    } catch (err) {
      notify("error", errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function edit(id: number) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setForm({ title: p.title, price: String(p.price), description: p.description });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: number, title: string) {
    if (!window.confirm(`Tem certeza que deseja excluir “${title}”?`)) return;
    try {
      await deleteProduct(id);
      if (editingId === id) reset();
      notify("success", "Produto excluído com sucesso.");
    } catch (err) {
      notify("error", errorMessage(err));
    }
    reload();
  }

  return (
    <>
      <h1>Cadastros</h1>

      <form className="card form" onSubmit={submit}>
        <h2>{editingId === null ? "Novo item" : `Editando item #${editingId}`}</h2>
        <div className="form-grid">
          <label>
            Nome
            <input value={form.title} onChange={set("title")} required />
          </label>
          <label>
            Preço (R$)
            <input value={form.price} onChange={set("price")} inputMode="decimal" placeholder="0,00" required />
          </label>
          <label className="span-all">
            Descrição
            <input value={form.description} onChange={set("description")} />
          </label>
        </div>
        <div className="actions">
          <button className="btn primary" type="submit" disabled={saving}>
            {editingId === null ? "Cadastrar" : "Salvar alterações"}
          </button>
          {editingId !== null && (
            <button className="btn" type="button" onClick={reset}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2>Produtos locais</h2>
      {error && <ErrorBox error={error} onRetry={reload} />}
      {!data && loading ? (
        <p className="muted">Carregando…</p>
      ) : products.length === 0 ? (
        !error && <Empty icon="📦">Nenhum produto local cadastrado.</Empty>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th className="num">Preço</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.title}
                    <div className="muted small-text">{p.description}</div>
                  </td>
                  <td className="num">{money(p.price)}</td>
                  <td className="row-actions">
                    <button className="btn small" onClick={() => edit(p.id)}>
                      Editar
                    </button>
                    <button className="btn small danger" onClick={() => remove(p.id, p.title)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
