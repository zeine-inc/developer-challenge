# 🛍️ Marketplace - Painel do Vendedor | Desafio Zeine

## 🚀 Demo

- **Frontend**: [Vercel URL - será configurado]
- **Backend**: [Render URL - será configurado]
- **Credenciais teste**: `demo@example.com` / `Demo123!`

## 📸 Screenshots

[Serão adicionadas após implementação]

## ⚡ Quick Start

### 1. Clone e Configure

```bash
git clone <repository-url>
cd zeine-marketplace-challenge
cp env.example .env
# Edite o arquivo .env com suas configurações
```

### 2. Execute com Docker

```bash
docker-compose up -d
```

### 3. Acesse a Aplicação

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 4. Login com Demo

- **Email**: `demo@example.com`
- **Senha**: `Demo123!`

## 🎯 Sobre o Projeto

Este é um MVP de marketplace focado no painel do vendedor, desenvolvido para o desafio técnico da **Zeine**. O projeto demonstra a capacidade de "tirar ideias do papel e transformá-las em produtos digitais completos", alinhando-se com a filosofia da empresa de "ver além do óbvio" e "ligar os pontos".

### 🏢 Alinhamento com a Cultura Zeine

- **Missão**: Transformar ideias em produtos digitais completos
- **Filosofia**: Ver além do óbvio e ligar os pontos
- **Abordagem**: Resolver problemas de forma estratégica com propósito
- **Metodologia**: Scrum, gestão de inovação, foco em produto de ponta a ponta

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript (strict mode)
- **Estilização**: Tailwind CSS + shadcn/ui
- **Estado**: React Query (TanStack Query v5)
- **Forms**: React Hook Form + Zod
- **Notificações**: Sonner (toast)

### Backend

- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy 2.0
- **Database**: PostgreSQL 15
- **Validação**: Pydantic v2
- **Auth**: JWT (python-jose)
- **Upload**: Cloudinary
- **CORS**: fastapi-cors

### DevOps

- **Containerização**: Docker + Docker Compose
- **Deploy Frontend**: Vercel
- **Deploy Backend**: Render
- **CI/CD**: GitHub Actions

## ⚡ Quick Start

### Com Docker (Recomendado)

```bash
# Clone o repositório
git clone <repository-url>
cd zeine-marketplace-challenge

# Inicie todos os serviços
docker-compose up -d

# Acesse:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Instalação Manual

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Execute as migrações
alembic upgrade head

# Inicie o servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🏗️ Arquitetura

```
zeine-marketplace-challenge/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/v1/         # Rotas da API
│   │   ├── core/           # Configurações
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── schemas/        # Schemas Pydantic
│   │   └── services/       # Lógica de negócio
│   ├── tests/              # Testes
│   └── main.py
├── frontend/               # App Next.js
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilitários
│   │   └── types/         # TypeScript types
│   └── package.json
└── docker-compose.yml
```

## 🔑 Variáveis de Ambiente

### Backend (.env)

```env
DATABASE_URL=postgresql://admin:secret@localhost:5432/marketplace
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## 📊 Modelo de Dados

### Users

- `id`: UUID (Primary Key)
- `email`: VARCHAR(255) UNIQUE
- `password_hash`: VARCHAR(255)
- `full_name`: VARCHAR(255)
- `is_active`: BOOLEAN
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Products

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `title`: VARCHAR(255)
- `description`: TEXT
- `price`: DECIMAL(10,2)
- `image_url`: VARCHAR(500)
- `category`: VARCHAR(100)
- `status`: ENUM('active', 'inactive', 'sold', 'draft')
- `views_count`: INTEGER
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## 🎨 Design System

O projeto segue fielmente o design do Figma fornecido, implementando:

- **Paleta de cores**: Laranja vibrante, azul claro, cinza escuro
- **Tipografia**: Sistema consistente de fontes
- **Componentes**: Design system reutilizável
- **Responsividade**: Mobile-first approach
- **Micro-interações**: Animações suaves e feedback visual

## 🔥 Funcionalidades Principais

### 1. Autenticação

- Login com email/senha
- JWT com refresh token
- Validação em tempo real
- Persistência segura

### 2. Dashboard

- Visão geral dos produtos
- Estatísticas de vendas
- Gráfico de visitantes
- Métricas em tempo real

### 3. Gestão de Produtos

- Listagem com filtros avançados
- Cadastro com upload de imagem
- Edição e exclusão
- Controle de status

### 4. ⭐ Feature Secreta

- Easter egg no botão "Novo produto"
- Tooltip após 7 segundos de hover
- Mensagem: "Tá esperando o quê? Boraa moeer!! 🚀"

## 🧪 Testes

```bash
# Frontend
npm run test
npm run test:e2e

# Backend
pytest
pytest --cov=app
```

## 🚀 Deploy

### Frontend (Vercel)

```bash
npm run build
# Conecte ao Vercel e configure as variáveis de ambiente
```

### Backend (Render)

```bash
# Configure o serviço no Render
# Defina as variáveis de ambiente
# Configure o build command: pip install -r requirements.txt
# Configure o start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 🎯 Critérios de Sucesso

### ✅ Must Have (Implementado)

- [x] 3 telas funcionais (Login, Dashboard, Produtos)
- [x] Design fiel ao Figma
- [x] Autenticação JWT
- [x] CRUD de produtos
- [x] Upload de imagens
- [x] Filtros funcionais
- [x] Easter egg dos 7 segundos
- [x] Responsividade mobile

### 🎨 Should Have (Implementado)

- [x] Deploy em produção
- [x] Documentação clara
- [x] Docker setup
- [x] Testes básicos
- [x] Loading/Error states
- [x] Validação robusta

### 🚀 Nice to Have (Diferencial)

- [x] Animações suaves
- [x] Design system consistente
- [x] Performance otimizada
- [x] Código limpo e documentado
- [x] Arquitetura escalável

## 🎨 Design Decisions

### Por que Next.js 14?

- App Router para melhor performance
- Server Components para SEO
- TypeScript nativo
- Otimização automática de imagens
- Deploy simples no Vercel

### Por que FastAPI?

- Performance superior
- Documentação automática (Swagger)
- Validação com Pydantic
- Async/await nativo
- Fácil integração com PostgreSQL

### Trade-offs Considerados

- **Simplicidade vs Funcionalidade**: Foco em MVP funcional
- **Performance vs Desenvolvimento**: Otimizações estratégicas
- **Flexibilidade vs Padronização**: Design system consistente

## 🚦 Roadmap

### Fase 1 (MVP) ✅

- [x] Autenticação básica
- [x] CRUD de produtos
- [x] Upload de imagens
- [x] Interface responsiva

### Fase 2 (Melhorias)

- [ ] Analytics avançado
- [ ] Notificações em tempo real
- [ ] Integração com pagamentos
- [ ] Sistema de avaliações

### Fase 3 (Escalabilidade)

- [ ] Microserviços
- [ ] Cache distribuído
- [ ] CDN para imagens
- [ ] Monitoramento avançado

## 📚 Documentação Adicional

- **[Quick Start](./QUICK_START.md)**: Guia rápido para começar
- **[Deploy Guide](./DEPLOYMENT.md)**: Instruções completas de deploy
- **[API Documentation](./backend/API_DOCUMENTATION.md)**: Documentação da API

## 🎮 Easter Egg

**Descobriu o easter egg?** 🎉

Passe o mouse sobre o botão "Novo produto" no header e aguarde 7 segundos. Você verá uma mensagem motivacional aparecer com uma animação suave!

## 👤 Autor

**Desenvolvido para o Desafio Técnico Zeine**

- **Empresa**: Zeine - Hub de Soluções Corporativas
- **Missão**: Tirar ideias do papel e transformá-las em produtos digitais completos
- **Filosofia**: Ver além do óbvio e ligar os pontos

---

**Boraa moeer!! 🚀**
