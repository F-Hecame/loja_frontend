import type {
  Order,
  OrderList,
  PaymentMethod,
  PaymentResult,
  Product,
  ProductInput,
  ProductList,
} from "../types";

export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      ...rest,
      headers: json !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new ApiError(0, `Não foi possível conectar à API em ${API_URL}. Ela está rodando? (python3 api.py)`);
  }

  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body?.erro ?? `Erro ${res.status} na API.`);
  return body as T;
}

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Erro inesperado.");

export function listProducts(
  opts: { origem?: "api" | "local"; promocao?: boolean } = {},
  signal?: AbortSignal,
) {
  const q = new URLSearchParams();
  if (opts.origem) q.set("origem", opts.origem);
  if (opts.promocao) q.set("promocao", "true");
  const qs = q.toString();
  return request<ProductList>(`/produtos${qs ? `?${qs}` : ""}`, { signal });
}

export const createProduct = (data: ProductInput) =>
  request<Product>("/produtos", { method: "POST", json: data });

export const updateProduct = (id: number, data: ProductInput) =>
  request<Product>(`/produtos/${id}`, { method: "PUT", json: data });

export const deleteProduct = (id: number) => request<void>(`/produtos/${id}`, { method: "DELETE" });

export const listOrders = (signal?: AbortSignal) => request<OrderList>("/pedidos", { signal });

export const createOrder = (data: {
  cliente: { nome: string; cpf: string };
  itens: { id: number; qtd: number }[];
}) => request<Order>("/pedidos", { method: "POST", json: data });

export const pay = (metodo: PaymentMethod) =>
  request<PaymentResult>("/pagamentos", { method: "POST", json: { metodo } });
