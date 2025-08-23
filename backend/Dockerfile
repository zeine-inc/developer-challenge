FROM python:3.12-slim

WORKDIR /app

# Copiar requirements e instalar
COPY backend/requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiar o código do backend
COPY backend/ .

EXPOSE 8000

# Rodar o backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
