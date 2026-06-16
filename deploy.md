# Manual de Deploy - NutURL 🚀

Este guia detalha o processo para colocar o NutURL em produção usando a **Vercel** para hospedagem frontend/backend, **Supabase** (ou Neon) para o banco de dados PostgreSQL e **Firebase** para autenticação.

---

## 📦 1. Banco de Dados de Produção (PostgreSQL)

Como servidores serverless (Vercel) possuem sistemas de arquivos efêmeros e somente leitura, o SQLite (`dev.db`) **não é adequado para produção**, pois os links salvos seriam apagados a cada reinicialização da rota.

### Passo a Passo para Configurar o PostgreSQL:

1. **Crie uma instância de PostgreSQL:**
   - Crie uma conta gratuita no [Supabase](https://supabase.com) ou [Neon](https://neon.tech).
   - Crie um novo projeto e copie a **URI de Conexão (Connection String)** do banco de dados (ex: `postgresql://postgres:...`).

2. **Habilitar Suporte Híbrido no Prisma:**
   Em produção, o Prisma lerá a variável `DATABASE_URL` contendo o link do PostgreSQL.
   Para fazer a troca sem quebrar o SQLite de desenvolvimento local, podemos trocar o provider para `postgresql` no ambiente de produção.
   
   *Para migrar o schema local permanente para PostgreSQL em produção:*
   No seu painel do Vercel, defina a variável de ambiente:
   - `DATABASE_URL` = `sua-string-de-conexao-postgres`

---

## 🔐 2. Variáveis de Ambiente no Vercel

Configure as seguintes variáveis de ambiente no dashboard do seu projeto no Vercel (`Settings > Environment Variables`):

```env
DATABASE_URL="sua-string-de-conexao-postgres-do-supabase"

# Firebase Client Credentials
NEXT_PUBLIC_FIREBASE_API_KEY="seu-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="seu-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="seu-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="seu-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="seu-app-id"
```

---

## ⚡ 3. Comando de Build no Vercel

Para garantir que o Prisma gere o cliente e aplique as tabelas no PostgreSQL remoto antes de subir a aplicação, edite a configuração de build da Vercel:

- **Build Command:** `npx prisma db push && next build`

Isso criará as tabelas `Link` e `Visit` automaticamente no banco de dados de produção ao realizar o deploy.

---

## 🌍 4. Configuração de Domínio (Subdomínio da Banda)

Uma vez que o encurtador principal estiver rodando em `nuturl.com`, você poderá criar um subdomínio para o seu projeto musical (ex: `marrow.nuturl.com` ou `resistencia.nuturl.com`):

1. Vá em **Project Settings > Domains** no projeto do seu site musical na Vercel.
2. Adicione o domínio `marrow.nuturl.com`.
3. Siga as instruções de DNS fornecidas pela Vercel adicionando o registro `CNAME` no seu provedor de domínio (onde o `nuturl.com` está registrado).
