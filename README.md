# Marketplace – Painel do Vendedor

## Links rápidos

- Front (deploy): https://...
- Back (deploy): https://...
- PR (ou fork): https://...
- Vídeo demo (Loom/YouTube): https://...

## Como rodar localmente

- Requisitos: Node v18+, Docker (opcional), PNPM/NPM, PostgreSQL/MongoDB
- Backend:
  1. cp .env.example .env # configure DB/JWT/Storage
  2. pnpm install
  3. pnpm db:migrate && pnpm db:seed
  4. pnpm dev
- Frontend:
  1. cp .env.local.example .env.local # API_URL
  2. pnpm install
  3. pnpm dev

## Decisões técnicas

- Stack: Next.js + NestJS (ou FastAPI) + PostgreSQL/MongoDB
- Autenticação: JWT + refresh (httpOnly) / proteção de rotas
- Upload: storage local em dev, provider em prod (ex.: S3/Cloudinary)
- Filtros e estados: ativo/inativo/vendido etc. com index e paginação

## Requisitos cobertos

- Login com validação
- Listagem com filtros por texto e status
- Produto: imagem, título, descrição, valor, categoria; Salvar/Publicar/Cancelar
- Backend com usuários, produtos, categorias/status; ERD incluso
- Mensagem secreta: tooltip após 7s no hover em “Novo produto”

## Testes

- API: auth, criação/listagem de produtos, filtros
- UI: componentes de formulário e filtro

## ERD

![ERD](./docs/erd.png)

## Observações

- Limitações conhecidas e próximos passos
