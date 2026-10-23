import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import type { CartItem } from "../types";
import { cartReducer, type CartAction } from "./cart";

const STORAGE_KEY = "loja-frontend:cart";

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface Ctx {
  cart: CartItem[];
  dispatch: Dispatch<CartAction>;
}

const CartContext = createContext<Ctx | null>(null);

// O pedido em montagem fica só no navegador; ao finalizar, vai para a API (POST /pedidos).
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // armazenamento indisponível: o carrinho segue só em memória
    }
  }, [cart]);

  const value = useMemo(() => ({ cart, dispatch }), [cart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
