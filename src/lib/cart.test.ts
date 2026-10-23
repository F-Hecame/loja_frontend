import { describe, expect, it } from "vitest";
import { cartReducer, cartTotal } from "./cart";
import { isValidCpf, maskCpf } from "./format";

const bife = { id: 1, title: "Bife", price: 20 };

describe("carrinho", () => {
  it("soma a quantidade ao adicionar o mesmo produto", () => {
    let cart = cartReducer([], { type: "add", product: bife });
    cart = cartReducer(cart, { type: "add", product: bife });
    expect(cart).toEqual([{ ...bife, qty: 2 }]);
    expect(cartTotal(cart)).toBe(40);
  });

  it("remove o item quando a quantidade chega a zero", () => {
    const cart = cartReducer([{ ...bife, qty: 1 }], { type: "setQty", id: 1, qty: 0 });
    expect(cart).toEqual([]);
  });

  it("remove um item e limpa o carrinho", () => {
    const cart = [{ ...bife, qty: 1 }, { id: 2, title: "Suco", price: 5, qty: 1 }];
    expect(cartReducer(cart, { type: "remove", id: 1 })).toEqual([cart[1]]);
    expect(cartReducer(cart, { type: "clear" })).toEqual([]);
  });
});

describe("cpf", () => {
  it("valida dígitos verificadores", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("529.982.247-24")).toBe(false);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("123")).toBe(false);
  });

  it("aplica máscara", () => {
    expect(maskCpf("52998224725")).toBe("529.982.247-25");
    expect(maskCpf("5299")).toBe("529.9");
  });
});
