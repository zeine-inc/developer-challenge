#!/bin/bash
set -e

echo "Rodando a aplicação com Docker..."

# Copia os arquivos de ambiente para Docker
cp backend/.env.docker backend/.env
cp frontend/.env.docker frontend/.env

# Sobe os containers
docker compose up --build -d

echo -e "\n✅ Serviços disponíveis:"
echo "Banco de dados | Postgres | db       | porta 5432"
echo "Backend        | FastAPI  | backend  | porta 8000"
echo "Frontend       | React    | frontend | porta 3000"
