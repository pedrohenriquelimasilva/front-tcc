# Deploy — Vercel + Render + Supabase

Guia objetivo. Faça na ordem: **Supabase → Render → Vercel**.

---

## 1. Supabase (Postgres)

1. Acesse https://supabase.com → **New Project**
   - Name: `devprep`
   - Region: a mais próxima (ex: `South America (São Paulo)`)
   - Database Password: **GERE UMA FORTE E SALVE** (não dá pra ver depois)
2. Espere ~2min provisionar.
3. Vá em **Project Settings → Database → Connection string**.
4. Copie o "URI" do **Session Pooler** (porta **5432**) — **NÃO** o Transaction Pooler (6543).
   - Vai parecer: `postgresql://postgres.abcdef:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`
5. Guarde a senha + URI para o próximo passo.

> ⚠️ A porta 6543 (Transaction Pooler) quebra prepared statements do asyncpg/SQLAlchemy e suas migrations vão falhar. Use 5432.

---

## 2. Render (API)

### 2.1. Subir o código

Se ainda não tem repo no GitHub:

```powershell
git init
git add .
git commit -m "deploy inicial"
gh repo create devprep --public --source=. --push
```

### 2.2. Criar o Web Service

1. https://render.com → **New → Web Service** → conecte o repo do GitHub.
2. Configurações:
   - **Root Directory**: `backend`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Free
   - **Health Check Path**: `/healthz`
3. **Docker Command** (sobrescreve o CMD do Dockerfile):
   ```
   sh -c "alembic upgrade head && python -m scripts.seed && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
   ```

### 2.3. Environment Variables

Cole **cada uma** no painel:

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://postgres.<ref>:<SENHA>@aws-0-<region>.pooler.supabase.com:5432/postgres?ssl=require` |
| `ALEMBIC_DATABASE_URL` | `postgresql+psycopg2://postgres.<ref>:<SENHA>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require` |
| `SECRET_KEY` | (clique em "Generate") |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `30` |
| `ENVIRONMENT` | `production` |
| `API_PREFIX` | `/api/v1` |
| `CORS_ORIGINS` | (preencha depois com a URL da Vercel) |

> ⚠️ Note as diferenças nos drivers: `asyncpg` precisa de **`?ssl=require`** e `psycopg2` precisa de **`?sslmode=require`**.

### 2.4. Deploy

Clica em **Create Web Service**. Logs em tempo real aparecem.

- Migrations rodam → seed roda → uvicorn sobe → `/healthz` responde 200.
- Copie a URL final: `https://devprep-api.onrender.com`.

Teste rapidinho:
```
https://devprep-api.onrender.com/healthz
https://devprep-api.onrender.com/docs
```

---

## 3. Vercel (Front)

### 3.1. Importar projeto

1. https://vercel.com → **Add New → Project** → importe o mesmo repo.
2. Configurações:
   - **Framework Preset**: Next.js (detecta sozinho)
   - **Root Directory**: `./` (raiz — Next.js está na raiz)
3. **Environment Variables**:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://devprep-api.onrender.com/api/v1` |

4. **Deploy**.

### 3.2. Voltar no Render e atualizar CORS

Depois que a Vercel der a URL final (ex: `https://devprep.vercel.app`):

1. Volte no Render → seu serviço → **Environment** → edite `CORS_ORIGINS`:
   ```
   https://devprep.vercel.app
   ```
2. O Render redeploya sozinho.

---

## 4. Verificação final

- [ ] `GET https://devprep-api.onrender.com/healthz` → 200
- [ ] `GET https://devprep-api.onrender.com/docs` carrega
- [ ] Abrir `https://devprep.vercel.app` → conseguir criar conta + logar
- [ ] DevTools → Network → chamadas pra `devprep-api.onrender.com` retornam 200/201
- [ ] Sem erro de CORS no console

---

## Gotchas / Troubleshooting

### Cold start
Render free tier **dorme após 15min** sem requisição. Primeira chamada leva ~30s. Pra banca do TCC:
- Abra a URL do back ~1min antes da apresentação pra acordar.
- Ou faça um uptime ping (ex: cron-job.org gratuito pingando `/healthz` a cada 10min).

### Migration falha com `prepared statement "..." already exists`
Você está na porta **6543** (Transaction Pooler). Troque para **5432** (Session Pooler).

### Erro `SSL connection required`
Faltou `?ssl=require` na `DATABASE_URL` (asyncpg) ou `?sslmode=require` na `ALEMBIC_DATABASE_URL` (psycopg2).

### Erro de CORS no front
- Confira que `CORS_ORIGINS` no Render bate **exatamente** com a origem da Vercel (com `https://`, sem barra no final).
- Preview deployments da Vercel têm URLs diferentes (`...-git-branch-user.vercel.app`). Se quiser que funcionem, adicione um wildcard ou liste cada preview manualmente.

### Seed reclama de duplicata
O seed é idempotente — checa `existing` antes de inserir. Se ainda falhar, rode `alembic downgrade base && alembic upgrade head` localmente apontando pra Supabase pra resetar.
