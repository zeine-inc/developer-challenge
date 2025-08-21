# Painel de Controle de um Vendedor

## Modelagem do Banco de Dados

O banco de dados é composto por duas entidades principais: **Vendedor** e **Contato**.  
Estas entidades possuem um relacionamento **muitos-para-muitos**, que é representado por uma tabela intermediária chamada **VENDEDOR_CONTATO**.

Utilizamos a notação **Crow’s Foot** para representar os relacionamentos, que é uma forma padrão de modelagem de bancos de dados relacionais.

```mermaid
erDiagram
    VENDEDOR {
        int id PK
        string nome
        string email
        string senha
    }

    CONTATO {
        int id PK
        string nome
        string email
        string telefone
        string foto
    }

    VENDEDOR_CONTATO {
        int id_vendedor FK
        int id_contato FK
    }

    VENDEDOR ||--o{ VENDEDOR_CONTATO : "tem"
    CONTATO ||--o{ VENDEDOR_CONTATO : "é gerenciado"
```
