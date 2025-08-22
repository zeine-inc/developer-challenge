# API Documentation - Marketplace Backend

## Visão Geral

Esta é a documentação da API REST do painel do vendedor do marketplace. A API é construída com FastAPI e fornece endpoints para autenticação, gerenciamento de usuários e produtos.

## Base URL

- **Desenvolvimento**: `http://localhost:8000`
- **Produção**: `https://your-backend-domain.onrender.com`

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Os tokens devem ser incluídos no header `Authorization` das requisições:

```
Authorization: Bearer <access_token>
```

### Tipos de Token

- **Access Token**: Token de curta duração (30 minutos) para autenticação
- **Refresh Token**: Token de longa duração (7 dias) para renovar o access token

## Endpoints

### Autenticação

#### POST /api/v1/auth/login

Faz login do usuário.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "João Silva",
    "is_active": true
  }
}
```

#### POST /api/v1/auth/register

Registra um novo usuário.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "full_name": "João Silva",
  "phone": "(11) 99999-9999"
}
```

#### POST /api/v1/auth/refresh

Renova o access token usando o refresh token.

**Request Body:**

```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### GET /api/v1/auth/me

Obtém o perfil do usuário autenticado.

**Headers:**

```
Authorization: Bearer <access_token>
```

#### PUT /api/v1/auth/me

Atualiza o perfil do usuário autenticado.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "full_name": "João Silva Atualizado",
  "phone": "(11) 88888-8888",
  "bio": "Nova biografia"
}
```

#### POST /api/v1/auth/change-password

Altera a senha do usuário autenticado.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

### Produtos

#### GET /api/v1/products

Lista produtos do usuário autenticado.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `search` (string): Busca por título
- `status` (string): Filtro por status (active, inactive, draft, sold)
- `category` (string): Filtro por categoria
- `min_price` (number): Preço mínimo
- `max_price` (number): Preço máximo
- `sort_by` (string): Campo para ordenação
- `sort_order` (string): Ordem (asc, desc)
- `page` (number): Número da página
- `limit` (number): Itens por página

**Response:**

```json
{
  "products": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "iPhone 13 Pro",
      "description": "Smartphone em excelente estado",
      "price": 4500.0,
      "image_url": "https://example.com/image.jpg",
      "category": "Eletrônicos",
      "status": "active",
      "views_count": 45,
      "likes_count": 12,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "total_pages": 1
}
```

#### POST /api/v1/products

Cria um novo produto.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "title": "Novo Produto",
  "description": "Descrição do produto",
  "price": 100.0,
  "category": "Categoria",
  "tags": "tag1,tag2,tag3",
  "image_url": "https://example.com/image.jpg",
  "status": "draft"
}
```

#### GET /api/v1/products/{product_id}

Obtém um produto específico.

**Headers:**

```
Authorization: Bearer <access_token>
```

#### PUT /api/v1/products/{product_id}

Atualiza um produto.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "title": "Produto Atualizado",
  "description": "Nova descrição",
  "price": 150.0,
  "category": "Nova Categoria",
  "status": "active"
}
```

#### DELETE /api/v1/products/{product_id}

Exclui um produto.

**Headers:**

```
Authorization: Bearer <access_token>
```

#### PATCH /api/v1/products/{product_id}/status

Atualiza o status de um produto.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "status": "active"
}
```

#### GET /api/v1/products/stats/summary

Obtém estatísticas dos produtos do usuário.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "total_products": 10,
  "active_products": 8,
  "sold_products": 2,
  "recent_products": 3,
  "total_views": 1500,
  "total_value": 15000.0
}
```

#### POST /api/v1/products/bulk/actions

Executa ações em lote nos produtos.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "action": "activate",
  "product_ids": ["id1", "id2", "id3"]
}
```

#### GET /api/v1/products/categories/list

Lista categorias dos produtos do usuário.

**Headers:**

```
Authorization: Bearer <access_token>
```

### Usuários

#### GET /api/v1/users/profile

Obtém o perfil do usuário.

**Headers:**

```
Authorization: Bearer <access_token>
```

#### PUT /api/v1/users/profile

Atualiza o perfil do usuário.

**Headers:**

```
Authorization: Bearer <access_token>
```

#### GET /api/v1/users/dashboard

Obtém dados do dashboard do usuário.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "stats": {
    "total_products": 10,
    "active_products": 8,
    "sold_products": 2,
    "recent_products": 3,
    "total_views": 1500,
    "total_value": 15000.0
  },
  "top_products": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Produto Mais Visto",
      "views_count": 150,
      "price": 100.0,
      "status": "active"
    }
  ]
}
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autorizado
- `403` - Proibido
- `404` - Não encontrado
- `422` - Erro de validação
- `500` - Erro interno do servidor

## Tratamento de Erros

A API retorna erros no seguinte formato:

```json
{
  "detail": "Mensagem de erro",
  "error_code": "ERROR_CODE"
}
```

## Rate Limiting

A API implementa rate limiting de 60 requisições por minuto por IP.

## Upload de Imagens

Para upload de imagens, use o endpoint do Cloudinary ou implemente um endpoint customizado.

## Exemplos de Uso

### Exemplo de Login

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Exemplo de Listagem de Produtos

```bash
curl -X GET "http://localhost:8000/api/v1/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Exemplo de Criação de Produto

```bash
curl -X POST "http://localhost:8000/api/v1/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Novo Produto",
    "description": "Descrição do produto",
    "price": 100.00,
    "category": "Eletrônicos",
    "status": "draft"
  }'
```

## Documentação Interativa

A API inclui documentação interativa disponível em:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Suporte

Para suporte técnico, entre em contato através do email: suporte@marketplace.com
