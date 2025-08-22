# 🚀 Quick Start - Marketplace

Guia rápido para executar o marketplace localmente.

## ⚡ Execução Rápida

### 1. Clone e Configure

```bash
# Clone o repositório
git clone <repository-url>
cd zeine-marketplace-challenge

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 2. Execute com Docker

```bash
# Inicie todos os serviços
docker-compose up -d

# Verifique se tudo está rodando
docker-compose ps
```

### 3. Acesse a Aplicação

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 4. Login com Demo

- **Email**: `demo@example.com`
- **Senha**: `Demo123!`

## 🎯 Funcionalidades Principais

### ✅ Implementadas

- **Autenticação completa** com JWT
- **Dashboard** com estatísticas
- **Listagem de produtos** com filtros e paginação
- **Cadastro de produtos** com upload de imagem
- **Edição de produtos** com preview
- **Perfil do usuário** com alteração de senha
- **Responsividade** completa
- **Easter egg** no botão "Novo produto" (7 segundos de hover)

### 🎨 Design System

- **Cores**: Seguindo o design do Figma
- **Componentes**: Reutilizáveis e consistentes
- **Animações**: Suaves e profissionais
- **Loading states**: Skeleton loading em todas as páginas

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **React Query** para gerenciamento de estado
- **React Hook Form** + **Zod** para validação
- **Sonner** para notificações
- **Lucide React** para ícones

### Backend

- **FastAPI** para API REST
- **SQLAlchemy 2.0** para ORM
- **PostgreSQL** para banco de dados
- **Pydantic v2** para validação
- **JWT** para autenticação
- **Cloudinary** para upload de imagens

### DevOps

- **Docker** + **Docker Compose**
- **GitHub Actions** para CI/CD
- **Vercel** para deploy do frontend
- **Render** para deploy do backend

## 📁 Estrutura do Projeto

```
zeine-marketplace-challenge/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/v1/         # Rotas da API
│   │   ├── core/           # Configurações
│   │   ├── models/         # Modelos SQLAlchemy
│   │   └── schemas/        # Schemas Pydantic
│   ├── requirements.txt
│   └── main.py
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── app/           # Páginas (App Router)
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Contextos (Auth)
│   │   ├── lib/           # Utilitários
│   │   └── types/         # Tipos TypeScript
│   ├── package.json
│   └── next.config.js
├── docker-compose.yml
└── README.md
```

## 🔧 Comandos Úteis

### Docker

```bash
# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild
docker-compose build --no-cache
```

### Backend

```bash
cd backend

# Instalar dependências
pip install -r requirements.txt

# Executar localmente
uvicorn main:app --reload

# Executar testes
pytest

# Formatação de código
black .
isort .
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar testes
npm test
```

## 🎮 Easter Egg

**Descobriu o easter egg?** 🎉

Passe o mouse sobre o botão "Novo produto" no header e aguarde 7 segundos. Você verá uma mensagem motivacional aparecer com uma animação suave!

## 📊 Dados de Demonstração

O projeto inclui dados de demonstração:

### Usuário Demo

- **Email**: demo@example.com
- **Senha**: Demo123!

### Produtos de Exemplo

- Sofá Moderno (R$ 1.200,90)
- iPhone 13 Pro (R$ 4.500,00)
- Notebook Dell (R$ 3.200,00)
- Mesa de Escritório (R$ 800,00)

## 🔍 Funcionalidades Detalhadas

### Dashboard

- Cards com estatísticas em tempo real
- Gráfico de visitantes (simulado)
- Produtos em destaque
- Resumo dos últimos 30 dias

### Produtos

- **Listagem**: Grid responsivo com filtros
- **Busca**: Por título, categoria, preço
- **Ordenação**: Por data, preço, visualizações
- **Paginação**: Navegação intuitiva
- **Ações**: Editar, excluir, ativar/desativar

### Cadastro de Produtos

- **Upload de imagem**: Drag & drop
- **Editor de texto rico**: Markdown com preview
- **Auto-save**: Salva como rascunho automaticamente
- **Validação**: Em tempo real com feedback visual

### Perfil

- **Informações pessoais**: Nome, email, telefone
- **Upload de avatar**: Com preview
- **Alteração de senha**: Com validação
- **Informações da conta**: Status, data de criação

## 🚀 Próximos Passos

### Melhorias Sugeridas

- [ ] Implementar upload real para Cloudinary
- [ ] Adicionar testes unitários e E2E
- [ ] Implementar notificações em tempo real
- [ ] Adicionar sistema de avaliações
- [ ] Implementar busca avançada
- [ ] Adicionar exportação de relatórios

### Deploy

- [ ] Configurar Vercel para frontend
- [ ] Configurar Render para backend
- [ ] Configurar PostgreSQL na nuvem
- [ ] Configurar Cloudinary
- [ ] Configurar domínio personalizado

## 🆘 Suporte

### Problemas Comuns

**Backend não inicia**

```bash
# Verifique se o PostgreSQL está rodando
docker-compose logs postgres

# Verifique as variáveis de ambiente
cat .env
```

**Frontend não carrega**

```bash
# Verifique se o backend está acessível
curl http://localhost:8000/health

# Verifique os logs
docker-compose logs frontend
```

**Erro de banco de dados**

```bash
# Reinicie o PostgreSQL
docker-compose restart postgres

# Verifique a conexão
docker-compose exec postgres psql -U admin -d marketplace
```

### Contato

- **Issues**: GitHub Issues
- **Email**: suporte@marketplace.com
- **Documentação**: `/backend/API_DOCUMENTATION.md`

## 🎉 Parabéns!

Você agora tem um marketplace completo e funcional rodando localmente!

**Tá esperando o quê? Boraa moeer!! 🚀**
