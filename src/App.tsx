import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Payments from "./pages/Payments";
import { useCart } from "./lib/useCart";
import { cartCount } from "./lib/cart";

export default function App() {
  const { cart } = useCart();
  const count = cartCount(cart);

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <span className="brand">🛍️ Nova Loja</span>
          <nav>
            <NavLink to="/catalogo">Catálogo</NavLink>
            <NavLink to="/cadastros">Cadastros</NavLink>
            <NavLink to="/pedido">Pedido {count > 0 && <span className="badge">{count}</span>}</NavLink>
            <NavLink to="/pagamentos">Pagamentos</NavLink>
          </nav>
        </div>
      </header>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/cadastros" element={<Products />} />
          <Route path="/pedido" element={<Cart />} />
          <Route path="/pagamentos" element={<Payments />} />
          <Route path="*" element={<Navigate to="/catalogo" replace />} />
        </Routes>
      </main>
    </>
  );
}
