# Guia de Deploy - Marketplace

Este guia explica como fazer o deploy do marketplace em diferentes ambientes.

## Pré-requisitos

- Docker e Docker Compose instalados
- Conta no Vercel (para frontend)
- Conta no Render (para backend)
- Conta no Cloudinary (para upload de imagens)
- PostgreSQL (pode ser local ou na nuvem)

## Deploy Local com Docker

### 1. Clone o repositório

```bash
git clone <repository-url>
cd zeine-marketplace-challenge
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://admin:secret123@localhost:5432/marketplace

# JWT
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Redis (opcional)
REDIS_URL=redis://localhost:6379
```

### 3. Execute com Docker Compose

```bash
docker-compose up -d
```

O projeto estará disponível em:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 4. Acesse com as credenciais de demo

- **Email**: demo@example.com
- **Senha**: Demo123!

## Deploy em Produção

### Backend (Render)

1. **Crie uma conta no Render**

   - Acesse [render.com](https://render.com)
   - Faça login ou crie uma conta

2. **Conecte o repositório**

   - Clique em "New +"
   - Selecione "Web Service"
   - Conecte seu repositório GitHub

3. **Configure o serviço**

   - **Name**: marketplace-backend
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Configure as variáveis de ambiente**

   ```
   PYTHON_VERSION=3.11.0
   DATABASE_URL=<sua-url-do-postgres>
   SECRET_KEY=<sua-chave-secreta>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   CORS_ORIGINS=https://seu-frontend.vercel.app
   CLOUDINARY_CLOUD_NAME=<seu-cloud-name>
   CLOUDINARY_API_KEY=<sua-api-key>
   CLOUDINARY_API_SECRET=<sua-api-secret>
   ```

5. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde o deploy ser concluído

### Frontend (Vercel)

1. **Crie uma conta no Vercel**

   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub

2. **Importe o projeto**

   - Clique em "New Project"
   - Importe o repositório
   - Configure o diretório como `frontend`

3. **Configure as variáveis de ambiente**

   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<seu-cloud-name>
   ```

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o deploy ser concluído

### Banco de Dados (PostgreSQL)

#### Opção 1: Render (Recomendado)

1. No Render, crie um novo "PostgreSQL"
2. Configure o nome e usuário
3. Copie a URL de conexão
4. Use essa URL na variável `DATABASE_URL` do backend

#### Opção 2: Supabase

1. Crie uma conta no [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a connection string
5. Use essa URL na variável `DATABASE_URL`

#### Opção 3: Neon

1. Crie uma conta no [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a connection string
4. Use essa URL na variável `DATABASE_URL`

### Cloudinary (Upload de Imagens)

1. **Crie uma conta no Cloudinary**

   - Acesse [cloudinary.com](https://cloudinary.com)
   - Faça o registro gratuito

2. **Obtenha as credenciais**

   - Vá em Dashboard
   - Copie Cloud Name, API Key e API Secret

3. **Configure no backend**
   - Use essas credenciais nas variáveis de ambiente

## Configuração de Domínio Personalizado

### Backend (Render)

1. No painel do Render, vá em Settings
2. Em "Custom Domains", adicione seu domínio
3. Configure os registros DNS conforme instruções

### Frontend (Vercel)

1. No painel do Vercel, vá em Settings
2. Em "Domains", adicione seu domínio
3. Configure os registros DNS conforme instruções

## Monitoramento e Logs

### Render (Backend)

- **Logs**: Disponível no painel do Render
- **Métricas**: CPU, memória e requisições
- **Health Checks**: Configurado automaticamente

### Vercel (Frontend)

- **Analytics**: Disponível no painel do Vercel
- **Logs**: Function logs para API routes
- **Performance**: Métricas de Core Web Vitals

## Backup e Segurança

### Backup do Banco de Dados

1. **Render PostgreSQL**: Backup automático diário
2. **Supabase**: Backup automático
3. **Neon**: Backup automático

### Segurança

1. **HTTPS**: Configurado automaticamente
2. **CORS**: Configure apenas os domínios necessários
3. **Rate Limiting**: Implementado no backend
4. **JWT**: Tokens com expiração configurável

## Troubleshooting

### Problemas Comuns

#### Backend não inicia

- Verifique as variáveis de ambiente
- Confirme se o banco de dados está acessível
- Verifique os logs no Render

#### Frontend não carrega

- Verifique se a URL da API está correta
- Confirme se o CORS está configurado
- Verifique os logs no Vercel

#### Upload de imagens não funciona

- Verifique as credenciais do Cloudinary
- Confirme se o bucket está configurado
- Verifique as permissões

#### Erro de conexão com banco

- Verifique a URL de conexão
- Confirme se o banco está ativo
- Verifique as credenciais

### Comandos Úteis

```bash
# Ver logs do Docker
docker-compose logs -f

# Reiniciar serviços
docker-compose restart

# Parar todos os serviços
docker-compose down

# Rebuild das imagens
docker-compose build --no-cache
```

## Atualizações

### Deploy Automático

O projeto está configurado com GitHub Actions para:

- Testes automáticos
- Build das imagens Docker
- Deploy automático em staging/production

### Deploy Manual

1. Faça push para a branch `main`
2. O GitHub Actions fará o deploy automaticamente
3. Ou faça deploy manual no Render/Vercel

## Custos Estimados

### Render

- **Backend**: $7/mês (Free tier disponível)
- **PostgreSQL**: $7/mês (Free tier disponível)

### Vercel

- **Frontend**: Gratuito (Hobby plan)
- **Domínio**: $20/ano (opcional)

### Cloudinary

- **Upload**: Gratuito (25GB/mês)

**Total estimado**: $14-34/mês

## Suporte

Para suporte técnico:

- **Issues**: Use o GitHub Issues
- **Email**: suporte@marketplace.com
- **Documentação**: Consulte a documentação da API
