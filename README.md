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

1. Troque `DATABASE_URL` para Postgres (Neon).
2. Em `prisma/schema.prisma`, mude `provider` de `sqlite` para `postgresql`.
3. Defina `AUTH_SECRET` e `NEXT_PUBLIC_APP_URL` com a URL do deploy.
4. Para cartazes em produção, considere Vercel Blob no lugar de `public/uploads`.
