# AgendaJovem

Calendário compartilhado de cultos e eventos da rede de grupos de jovens.

## Stack

- Next.js (App Router) + Tailwind CSS + shadcn/ui
- Prisma + SQLite (local) / Postgres (produção)
- Auth.js (login de líderes)
- FullCalendar + feed `.ics` (Google / Apple / Outlook)

## Começar

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Conta inicial (seed)

| Papel | E-mail | Senha |
|---|---|---|
| Admin | `naelgoncalves478@live.com` | `natanael09` |

Líderes criam a própria conta em `/cadastro`, junto com a igreja.

## Rotas principais

- `/` — calendário + próximos eventos
- `/eventos` — lista com filtro por igreja
- `/eventos/[id]` — detalhe + “Adicionar à agenda”
- `/assinar` — link do feed `calendar.ics`
- `/painel` — CRUD do líder
- `/admin` — igrejas e líderes

## Feed da agenda

`GET /api/calendar.ics` — assine este URL no Google Agenda / Apple / Outlook.

`GET /api/events/[id]/ics` — baixa um evento só.

## Produção (Vercel)

Variáveis obrigatórias no projeto Vercel (Production / Preview / Development):

| Variável | Exemplo |
|---|---|
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://seu-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://seu-app.vercel.app` |
| `DATABASE_URL` | Neon pooled (`...-pooler...`) |
| `DATABASE_URL_UNPOOLED` | Neon direct (sem pooler) |

Opcional: `BLOB_READ_WRITE_TOKEN` (Vercel Blob) para upload de cartazes.

```bash
# exemplo via CLI (já logado no vercel)
openssl rand -base64 32 | npx vercel env add AUTH_SECRET production
# cole a DATABASE_URL do Neon:
npx vercel env add DATABASE_URL production
npx vercel env add DATABASE_URL_UNPOOLED production
echo https://seu-app.vercel.app | npx vercel env add AUTH_URL production
echo https://seu-app.vercel.app | npx vercel env add NEXT_PUBLIC_APP_URL production
npx vercel --prod
```
