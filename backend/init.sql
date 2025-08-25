-- Script de inicialização do banco de dados
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Inserir dados de exemplo para desenvolvimento
-- Usuário de teste
INSERT INTO users (id, email, password_hash, full_name, phone, is_active, is_verified, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'demo@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', -- Senha: Demo123!
    'Usuário Demo',
    '(11) 99999-9999',
    true,
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Produtos de exemplo
INSERT INTO products (id, user_id, title, description, price, image_url, category, status, views_count, likes_count, created_at, updated_at)
VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Sofá Moderno',
    'Sofá confortável com design moderno, ideal para sala de estar. Material de alta qualidade e acabamento perfeito.',
    1200.90,
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    'Móveis',
    'active',
    45,
    12,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '2 days'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'Camiseta Masculina',
    'Camiseta básica de algodão, muito confortável e versátil. Disponível em várias cores.',
    35.89,
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    'Vestuário',
    'active',
    23,
    8,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    'Kit Utensílios de Cozinha',
    'Kit completo de utensílios de bambu para cozinha. Inclui colheres, espátulas e outros acessórios.',
    86.79,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    'Casa e Cozinha',
    'active',
    67,
    15,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '3 days'
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440000',
    'Kit de Cremes Hidratantes',
    'Kit com 3 cremes hidratantes para diferentes tipos de pele. Produtos de alta qualidade.',
    159.90,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
    'Beleza',
    'active',
    34,
    9,
    NOW() - INTERVAL '2 days',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440000',
    'Caderno de Desenho',
    'Caderno de desenho profissional com papel de alta gramatura. Ideal para artistas e estudantes.',
    56.00,
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    'Papelaria',
    'sold',
    89,
    22,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '1 day'
),
(
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440000',
    'Carro de Brinquedo',
    'Carro de brinquedo para crianças, muito divertido e resistente. Ideal para presente.',
    24.60,
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop',
    'Brinquedos',
    'inactive',
    12,
    3,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '5 days'
)
ON CONFLICT (id) DO NOTHING;

-- Comentário sobre os dados de exemplo
COMMENT ON TABLE users IS 'Tabela de usuários do marketplace';
COMMENT ON TABLE products IS 'Tabela de produtos do marketplace';

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Comentário final
SELECT 'Dados de exemplo inseridos com sucesso!' as message;
