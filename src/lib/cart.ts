import type { CartItem, Product } from "../types";

export const PROMO_LIMIT = 60; // mesmo valor do backend (servico.PRECO_PROMOCAO), usado só no rótulo

export type CartAction =
  | { type: "add"; product: Pick<Product, "id" | "title" | "price"> }
  | { type: "setQty"; id: number; qty: number }
  | { type: "remove"; id: number }
  | { type: "clear" };

export const cartTotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.qty, 0);

export function cartReducer(cart: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const { id, title, price } = action.product;
      return cart.some((i) => i.id === id)
        ? cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...cart, { id, title, price, qty: 1 }];
    }
    case "setQty":
      return action.qty <= 0
        ? cart.filter((i) => i.id !== action.id)
        : cart.map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i));
    case "remove":
      return cart.filter((i) => i.id !== action.id);
    case "clear":
      return [];
  }
}
