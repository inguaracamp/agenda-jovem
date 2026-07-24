# 📅 Agenda de Cultos — Rede de Grupos de Jovens

> Um calendário compartilhado onde líderes de grupos de jovens de várias igrejas
> publicam os cultos e eventos, anexam o cartaz, e todos conseguem ver a agenda
> num só lugar — além de integrar com o calendário do celular/computador.

---

## 1. Visão Geral

Hoje o problema é: cada igreja tem seus cultos e convites, e o grupo de líderes
se perde sobre "quando é o culto de quem". A ideia é ter **um único lugar** onde:

- Cada líder **posta o próximo culto/evento** da sua igreja.
- O post tem **data, horário, local, título, descrição e o cartaz** (imagem).
- Tudo aparece num **calendário compartilhado**, visível para todo o grupo.
- Cada pessoa pode **assinar a agenda** e ver os cultos direto no **Google
  Agenda / Apple Calendar / Outlook** do celular ou computador.
- Dá para **filtrar por igreja** e ver a **lista dos próximos eventos**.

**Objetivo #1:** simples de usar e simples de manter. Nada de over-engineering.

---

## 2. Personas & Casos de Uso

| Persona | O que faz |
|---|---|
| **Líder (você e os outros líderes)** | Cria, edita e remove os cultos da sua igreja. Faz upload do cartaz. |
| **Membro / Convidado** | Vê o calendário, filtra por igreja, baixa o cartaz, assina a agenda. |
| **Admin** | Aprova novos líderes, gerencia a lista de igrejas. |

Casos de uso principais:

1. Líder publica: "Culto de Jovens — Igreja Central — Sexta 20h" + cartaz.
2. Aparece automaticamente no calendário do grupo.
3. Um membro clica em "Adicionar à minha agenda" e o evento vai pro celular.
4. Um membro assina o feed uma vez e **todos os cultos futuros aparecem sozinhos**.
5. Filtro: "Mostrar só os cultos da Igreja X neste mês".

---

## 3. Funcionalidades

### 3.1 MVP (primeira versão — o essencial)

- [ ] **Cadastro de igrejas** (nome, cidade, cor da igreja no calendário).
- [ ] **Criar evento/culto**: título, igreja, data, hora início/fim, local,
      descrição, tipo (culto, evento especial, convite).
- [ ] **Upload do cartaz** (imagem) exibido no card do evento.
- [ ] **Visualização em Calendário** (mês) e **Lista** (próximos eventos).
- [ ] **Filtro por igreja** e por período.
- [ ] **Página de detalhe do evento** com cartaz grande + botão "Adicionar à agenda".
- [ ] **Exportar `.ics`** de um evento (botão "Adicionar à minha agenda").
- [ ] **Feed de assinatura `webcal://`** para sincronizar tudo automaticamente.
- [ ] **Login simples** para líderes editarem (leitura é pública ou por link).

### 3.2 Melhorias (fase 2 — deixa mais redondo)

- [ ] **Eventos recorrentes** ("todo sábado 19h30").
- [ ] **Lembretes** por e-mail/WhatsApp X dias antes.
- [ ] **RSVP / Confirmação de presença** ("vou / não vou / talvez").
- [ ] **Comentários** no evento (ex.: "vai ter transporte saindo às 18h").
- [ ] **Modo compartilhável**: gerar imagem/story do evento para postar no Insta.
- [ ] **Notificações push** (PWA) quando um novo culto é publicado.
- [ ] **Múltiplos feeds**: assinar só de igrejas específicas.

### 3.3 Ideias extras (nice to have / futuro)

- [ ] **App instalável (PWA)** — ícone na tela do celular, funciona offline pra ver.
- [ ] **Galeria de cartazes** — histórico visual dos cultos passados.
- [ ] **Estatísticas** — quantos cultos por mês, por igreja.
- [ ] **Mapa** com o local de cada culto.
- [ ] **Tema claro/escuro** e identidade visual do grupo.

---

## 4. Arquitetura & Stack (pensada para o Vercel)

Tudo escolhido para ser **fácil de subir no Vercel** e barato (tier grátis atende
no começo).

| Camada | Escolha | Por quê |
|---|---|---|
| **Framework** | **Next.js (App Router)** | Roda nativo no Vercel, front + back juntos. |
| **UI** | **Tailwind CSS + shadcn/ui** | Componentes prontos e bonitos, rápido de montar. |
| **Calendário** | **FullCalendar** ou **react-big-calendar** | Visual de mês/semana pronto. |
| **Banco de dados** | **Vercel Postgres (Neon)** | Integra em 1 clique com o projeto Vercel. |
| **ORM** | **Prisma** ou **Drizzle** | Modelagem simples e type-safe. |
| **Imagens (cartazes)** | **Vercel Blob** | Upload de arquivo simples, servido via CDN. |
| **Autenticação** | **Clerk** (fácil) ou **Auth.js** com magic link | Login sem senha por e-mail. |
| **Feed de calendário** | Rota de API que gera **`.ics` (iCalendar)** | Padrão universal aceito por Google/Apple/Outlook. |
| **Deploy** | **Vercel** | `git push` = site no ar. |

> Alternativa ainda mais simples: usar **Supabase** (banco + auth + storage num
> lugar só). Escolha uma das duas para não misturar. A recomendação padrão aqui
> é **Vercel Postgres + Vercel Blob + Clerk**.

---

## 5. Modelo de Dados

```
Church (Igreja)
  id            uuid
  name          string        # "Igreja Central"
  city          string
  color         string        # cor no calendário (#hex)
  createdAt     datetime

User (Líder/Admin)
  id            uuid
  name          string
  email         string        # login
  role          enum(LEADER, ADMIN)
  churchId      uuid -> Church
  createdAt     datetime

Event (Culto / Evento / Convite)
  id            uuid
  title         string        # "Culto de Jovens"
  type          enum(CULTO, EVENTO, CONVITE)
  churchId      uuid -> Church
  createdById   uuid -> User
  startsAt      datetime
  endsAt        datetime
  location      string        # endereço / nome do local
  description   text
  posterUrl     string        # URL do cartaz no Vercel Blob
  recurrence    string?       # regra RRULE (fase 2)
  createdAt     datetime
  updatedAt     datetime

# (Fase 2)
Rsvp
  id       uuid
  eventId  uuid -> Event
  name     string
  status   enum(VAI, NAO_VAI, TALVEZ)
```

---

## 6. Rotas / Páginas

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Calendário do mês + próximos eventos | Público |
| `/eventos` | Lista de todos os eventos com filtros | Público |
| `/eventos/[id]` | Detalhe do evento + cartaz + "Adicionar à agenda" | Público |
| `/igrejas` | Lista de igrejas da rede | Público |
| `/login` | Login do líder | Público |
| `/painel` | Painel do líder (meus eventos) | Líder |
| `/painel/novo` | Criar evento + upload de cartaz | Líder |
| `/painel/[id]/editar` | Editar evento | Líder (dono) |
| `/admin` | Gerenciar igrejas e líderes | Admin |

### Rotas de API

| Rota | Método | Descrição |
|---|---|---|
| `/api/events` | GET/POST | Listar / criar eventos |
| `/api/events/[id]` | GET/PUT/DELETE | Detalhe / editar / remover |
| `/api/events/[id]/ics` | GET | Baixar `.ics` de **um** evento |
| `/api/calendar.ics` | GET | **Feed completo** (assinatura de todos os eventos) |
| `/api/calendar/[churchId].ics` | GET | Feed **de uma igreja** (fase 2) |
| `/api/upload` | POST | Upload do cartaz para o Vercel Blob |

---

## 7. Integração com a Agenda (o coração do pedido)

Isto é o que faz "ficar marcado na agenda do celular/computador".

### 7.1 Adicionar **um** evento

Botão **"Adicionar à minha agenda"** → baixa um arquivo `.ics`. Ao abrir, o
celular/computador pergunta se quer adicionar ao Google Agenda / Apple Calendar.

Exemplo de conteúdo de um `.ics`:

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Agenda de Cultos//PT-BR//
BEGIN:VEVENT
UID:evento-123@agenda-cultos
DTSTAMP:20260723T230000Z
DTSTART:20260725T230000Z
DTEND:20260726T010000Z
SUMMARY:Culto de Jovens - Igreja Central
LOCATION:Rua Exemplo, 123
DESCRIPTION:Venha participar! Cartaz: https://.../cartaz.jpg
END:VEVENT
END:VCALENDAR
```

### 7.2 **Assinar** a agenda inteira (recomendado 👑)

Em vez de adicionar evento por evento, a pessoa **assina o feed uma única vez** e
**todos os cultos futuros aparecem automaticamente**:

- **Google Agenda:** Configurações → Adicionar calendário → "De URL" → colar o
  link `https://SEU-APP.vercel.app/api/calendar.ics`.
- **Apple Calendar (iPhone):** Ajustes → Calendário → Contas → Adicionar → Outra
  → Assinatura de calendário → colar o link (use `webcal://` no lugar de `https://`).
- **Outlook:** Adicionar calendário → Assinar da Web.

> Vantagem: quando um líder posta um culto novo, ele **aparece sozinho** na agenda
> de todo mundo que assinou. Zero trabalho manual.

---

## 8. Fluxo de Uso (passo a passo)

1. **Você (admin)** cadastra as igrejas e convida os líderes por e-mail.
2. Cada **líder faz login** e vai em **"Novo evento"**.
3. Preenche data/hora/local, escreve a descrição e **envia o cartaz**.
4. O evento aparece **no calendário do grupo** com a cor da igreja.
5. Os **membros** entram no site, veem o mês, filtram por igreja se quiserem.
6. Cada um **assina o feed** uma vez → os cultos entram na agenda pessoal.
7. Culto novo publicado = aparece na agenda de todos automaticamente. ✅

---

## 9. Roteiro de Implementação (sugestão de sprints)

### Sprint 0 — Fundação
- [ ] `npx create-next-app` com TypeScript + Tailwind.
- [ ] Configurar shadcn/ui.
- [ ] Criar projeto no Vercel + Vercel Postgres + Vercel Blob.
- [ ] Modelar banco com Prisma (Church, User, Event).

### Sprint 1 — CRUD de eventos (sem login ainda)
- [ ] Página de calendário com FullCalendar puxando eventos do banco.
- [ ] Formulário "Novo evento" + upload de cartaz no Blob.
- [ ] Página de detalhe do evento.
- [ ] Página de lista com filtro por igreja.

### Sprint 2 — Integração com agenda
- [ ] Rota `/api/events/[id]/ics` (um evento).
- [ ] Rota `/api/calendar.ics` (feed completo).
- [ ] Botões "Adicionar à agenda" e "Assinar calendário".

### Sprint 3 — Login e permissões
- [ ] Login de líder (Clerk / Auth.js).
- [ ] Painel do líder (só edita os próprios eventos).
- [ ] Área de admin (gerenciar igrejas e líderes).

### Sprint 4 — Polimento
- [ ] Cores por igreja, tema, responsividade mobile.
- [ ] Transformar em **PWA** (instalável).
- [ ] Fase 2: lembretes, RSVP, recorrência.

---

## 10. Sugestões e Melhorias (o que eu recomendo)

1. **Comece pelo feed `.ics` de assinatura.** É o que resolve de verdade a dor de
   "nos perdemos com os dias". Uma vez assinado, todo mundo fica sincronizado.
2. **Cor por igreja** no calendário — bate o olho e já sabe de quem é o culto.
3. **Cartaz obrigatório e bonito** — o cartaz é o que engaja os jovens; deixe ele
   em destaque no card e na página de detalhe.
4. **Botão "compartilhar no WhatsApp/Instagram"** — os convites viram divulgação.
5. **PWA desde cedo** — instalar na tela inicial dá cara de "app de verdade" sem
   custo de loja de aplicativos.
6. **Leitura pública, escrita protegida** — qualquer membro vê; só líder posta.
   Simplifica muito o começo (não precisa cada membro ter conta).
7. **Fuso horário** — cuidado ao salvar datas: guarde em UTC e mostre no horário
   de Brasília, senão o culto aparece na hora errada na agenda de quem assina.
8. **Backup simples** — exportar todos os eventos em `.ics`/CSV de vez em quando.

---

## 11. Nome & Identidade (ideias)

Sugestões de nome para o projeto/app:

- **AgendaJovem**
- **CultoConectado**
- **Rede de Cultos**
- **JovemNaAgenda**
- **UniCultos**

> Escolha um nome curto, defina uma cor principal e um ícone simples — isso já
> dá identidade e ajuda quando virar PWA (ícone na tela do celular).

---

## 12. Próximos Passos

1. Validar este documento com o grupo de líderes (o que falta? o que sobra?).
2. Definir a stack final (recomendo: **Next.js + Vercel Postgres + Vercel Blob + Clerk**).
3. Rodar o **Sprint 0** e ter o esqueleto no ar no Vercel.
4. Cadastrar 1 igreja e 1 culto de teste para validar o fluxo do `.ics`.

---

*Documento vivo — atualize conforme o projeto evoluir.* 🙏
