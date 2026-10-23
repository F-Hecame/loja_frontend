# Nova Loja — Front-end

Interface web do projeto [`loja_micro_service`](../loja_micro_service). Todas as operações
(catálogo, cadastros, pedidos e pagamentos) são feitas por HTTP na API do backend; este repositório
é só a interface.

## Rodando

Precisa de dois terminais:

```bash
# 1. backend (pasta loja_micro_service)
python3 api.py                 # http://127.0.0.1:8000

# 2. front-end (esta pasta)
npm install
npm run dev                    # http://localhost:5173
```

Para apontar para outra API, copie `.env.example` para `.env` e ajuste `VITE_API_URL`.
Se o backend estiver parado, as telas mostram o erro de conexão com um botão "Tentar de novo".

Outros comandos: `npm test` (testes do carrinho e do CPF) e `npm run build` (saída em `dist/`).
Requer Node 18+.

## Telas e endpoints

| Tela          | Endpoints usados |
| ------------- | ---------------- |
| `/catalogo`   | `GET /produtos` (com `origem` e `promocao`) |
| `/cadastros`  | `GET /produtos?origem=local`, `POST /produtos`, `PUT /produtos/{id}`, `DELETE /produtos/{id}` |
| `/pedido`     | `POST /pedidos` ao finalizar |
| `/pagamentos` | `GET /pedidos`, `POST /pagamentos` |

O pedido em montagem (carrinho) fica só no navegador (`localStorage`) até ser finalizado,
quando é enviado de uma vez para a API. O restante dos dados vive no backend.

## Estrutura

```
src/
  lib/api.ts        cliente HTTP tipado (único ponto que fala com o backend)
  lib/useAsync.ts   carregamento assíncrono com recarga
  lib/cart.ts       reducer do carrinho
  lib/useCart.tsx   contexto + persistência do carrinho
  lib/format.ts     moeda, datas, máscara/validação de CPF
  pages/            Catalog, Products, Cart, Payments
  components/       ProductCard, Toast, ErrorBox, Empty
```
