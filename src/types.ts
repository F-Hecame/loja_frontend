export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category?: string;
  image?: string;
  origem: "api" | "local";
}

export interface ProductInput {
  title: string;
  price: number;
  description: string;
}

export interface ProductList {
  produtos: Product[];
  api_externa_disponivel: boolean;
}

/** Item do pedido em montagem, só existe no navegador até o pedido ser finalizado. */
export interface CartItem {
  id: number;
  title: string;
  price: number;
  qty: number;
}

export interface OrderItem {
  id: number;
  nome: string;
  preco: number;
  qtd: number;
}

export interface Order {
  id: string;
  criado_em: string;
  cliente: { nome: string | null; cpf: string | null };
  itens: OrderItem[];
  total: number;
}

export interface OrderList {
  pedidos: Order[];
  total: number;
}

export type PaymentMethod = "crédito" | "débito" | "dinheiro";

export interface PaymentResult {
  total: number;
  metodo: PaymentMethod;
  pedidos_quitados: number;
}
