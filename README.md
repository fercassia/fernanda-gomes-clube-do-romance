# Clube do Romance 🌈 — (Backend-only)

> **Objetivo:** um projeto **backend** simples (em camadas) para praticar **TypeScript, Express, SQL, Docker, Autenticação JWT** e **integração com API externa** — com escopo pensado para **nível júnior**.

> __DOCUMENTAÇÃO DO PROJETO__: [Doc Clube do Romance](./DOC.MD)

---

## 🧭 Meta do Projeto

Construir uma **API REST** simples e bem organizada para:

- 👤 **cadastrar/logar usuários** (Auth/JWT)
- 📚 **buscar livros** (integração externa + cache local)
- 🗂️ **criar estantes pessoais** e **registrar progresso** (somente status)
- ✍️ **publicar reviews** com **marcação de gatilhos** *simplificada* (sem moderação por enquanto)
- 🐳 Tudo rodando em **Docker** com **banco SQL**


---

## 🗺️ Roadmap em 4 Etapas (cada uma entrega algo “usável”)

### 1) Base (Auth + Saúde da API)
**Objetivo:** subir servidor Express + TypeScript, com lint, scripts e Docker.

**Endpoints**
- `POST /auth/register` → cria usuário
- `POST /auth/login` → retorna **JWT** (sem refresh no início)
- `GET /health` → `ok`

**Banco (SQL)**
- `users(id, email unique, password_hash, display_name, role='user', created_at)`

**Segurança**
- Hash de senha (**bcrypt**) e JWT curto (ex.: 15–30 min)

**Docker**
- `docker-compose.yml` com `api` + `db` (Postgres, p. ex.) + `db-admin` (Adminer/pgAdmin)

**✅ Critérios de aceite**
- Registrar → logar → acessar rota protegida `GET /me`
- Senha não aparece em logs; `401` sem token

---

### 2) Catálogo (Integração Externa + Cache Local)
**Objetivo:** praticar **integração com API externa** e **persistência**.

**Integração**
- Open Library (ou similar) por **ISBN** e por **título** (busca simples)

**Banco**
- `books(id, external_id, source, title, authors TEXT[], published_year, synopsis, cover_url, created_at)`
- `tags(id, name, kind CHECK IN ('genre','trigger'))`
- `book_tags(book_id, tag_id)`
  - Para júnior: `kind='trigger'` já marca *violência*, *homofobia* etc.; `genre` cobre gêneros literários

**Endpoints**
- `GET /books?q=` → busca no **cache** por título; se vazio, consulta externa **na própria request**, salva e responde
- `GET /books/:id` → detalhes do livro

**Simplificações**
- Sem “porquê da recomendação”
- Sem “revelar uma vez” (pode virar bônus na Etapa 4)

**✅ Critérios de aceite**
- Buscar “Carol” → tenta no banco; se não achar, chama externa, salva e devolve
- Evitar duplicados via `(external_id, source)` como *unique lógico*

---

### 3) Estantes & Progresso (CRUD Simples + Upsert)
**Objetivo:** praticar **CRUD REST** e **upsert** com validações básicas.

**Banco**
- `shelves(id, user_id, name, is_private DEFAULT true, created_at)`
- `shelf_items(shelf_id, book_id, position INT, added_at, PRIMARY KEY (shelf_id, book_id))`
- `reading_progress(user_id, book_id, status CHECK IN ('started','paused','finished'), updated_at, PRIMARY KEY (user_id, book_id))`

**Endpoints**
- `GET /me/shelves`
- `POST /me/shelves`
- `PATCH /me/shelves/:id` / `DELETE /me/shelves/:id`
- `POST /me/shelves/:id/items` / `DELETE /me/shelves/:id/items/:bookId`
- `POST /me/progress` (upsert por `user,book`)
- `GET /me/progress?bookId=...`

**Regras**
- Estante pertence ao **próprio usuário** (validar `user_id` do token)
- Progresso guarda **apenas** `status ∈ {started, paused, finished}`  
  Reabrir (de `finished` para `started`) é permitido no MVP

**✅ Critérios de aceite**
- Criar estante privada, adicionar/remover livros, listar
- Atualizar e consultar progresso por livro

---

### 4) Reviews + Gatilhos
**Objetivo:** treinar **validações** e **regras de conteúdo** leves.

**Banco**
- `reviews(id, user_id, book_id, rating INT 1..5, body TEXT, marked_triggers INT[] DEFAULT '{}', visibility CHECK IN ('public','anonymous'), status CHECK IN ('visible','hidden'), created_at, updated_at)`
  - `marked_triggers` referencia `tags(kind='trigger')` por **id**

**Endpoints**
- `POST /books/:id/reviews`
- `GET /books/:id/reviews`
- `PATCH /reviews/:id` / `DELETE /reviews/:id`

**Regras simples**
- Texto mínimo (ex.: 50 chars)
- Se o corpo contiver termos de uma **lista sensível** (array estático simples) e `marked_triggers` não cobrir → `400` com “marque gatilho X”
- `visibility='anonymous'` oculta `display_name` no payload

**(Bônus opcional) Ocultação por gatilhos do usuário**
- `user_preferences(user_id PK, hidden_triggers INT[])`
- `GET /books/:id/reviews` retorna `hidden=true` + `body_preview` quando intersectar gatilhos  

**✅ Critérios de aceite**
- Criar → listar reviews; review anônima não expõe `display_name`
- Rejeitar review quando faltar gatilho necessário

---

## 🔚 Endpoints (resumo rápido)

### 🔐 Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /me` *(protegido)*

### 📚 Books
- `GET /books?q=term`
- `GET /books/:id`

### 🗂️ Shelves
- `GET /me/shelves`
- `POST /me/shelves`
- `PATCH /me/shelves/:id`
- `DELETE /me/shelves/:id`
- `POST /me/shelves/:id/items`
- `DELETE /me/shelves/:id/items/:bookId`

### ▶️ Progress
- `POST /me/progress`
- `GET /me/progress?bookId=...`

### ✍️ Reviews
- `POST /books/:id/reviews`
- `GET /books/:id/reviews`
- `PATCH /reviews/:id`
- `DELETE /reviews/:id`

### ⚙️ (Opcional) Preferências
- `GET /me/preferences`
- `PUT /me/preferences` *(apenas `hidden_triggers`)*

