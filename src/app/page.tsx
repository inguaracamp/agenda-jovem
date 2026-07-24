import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { getAppUrl, whatsappShareUrl } from "@/lib/app-url";
import { siteWhatsAppMessage } from "@/lib/share";
import { EventsCalendar } from "@/components/events-calendar";
import { EventCard } from "@/components/event-card";
import { PostEventButton } from "@/components/post-event-button";
import { AddHomeShortcutButton } from "@/components/add-home-shortcut-button";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Rss, Share2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  const canPost = Boolean(session?.user);

  const now = new Date();

  const [events, churches, ongoing, upcoming, appUrl] = await Promise.all([
    prisma.event.findMany({
      include: { church: true },
      orderBy: { startsAt: "asc" },
    }),
    prisma.church.findMany({ orderBy: { name: "asc" } }),
    prisma.event.findMany({
      where: {
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      include: { church: true },
      orderBy: { endsAt: "asc" },
    }),
    prisma.event.findMany({
      where: { startsAt: { gt: now } },
      include: { church: true },
      orderBy: { startsAt: "asc" },
      take: 4,
    }),
    getAppUrl(),
  ]);

  const whatsappHref = whatsappShareUrl(siteWhatsAppMessage(appUrl));

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800/70">
            Rede de grupos de jovens
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Agenda<span className="text-teal-800">Jovem</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Cultos e eventos de várias igrejas num só calendário. Filtre por
            igreja, baixe o cartaz e assine a agenda no celular.
          </p>
          <div className="flex flex-wrap gap-3">
            <PostEventButton authenticated={canPost} />
            <Button asChild variant="outline">
              <Link href="/eventos">
                <CalendarPlus className="size-4" />
                Ver próximos eventos
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <Share2 className="size-4" />
                Divulgar no WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/assinar">
                <Rss className="size-4" />
                Assinar no celular
              </Link>
            </Button>
            <AddHomeShortcutButton />
          </div>
        </div>

        <div className="rounded-3xl border border-teal-900/10 bg-white/70 p-5 shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-teal-900">Como funciona</p>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. Líderes publicam cultos com data, local e cartaz</li>
            <li>2. Todo mundo vê no calendário compartilhado</li>
            <li>3. Você assina uma vez — novos cultos entram sozinhos</li>
          </ol>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Calendário
          </h2>
          <Link
            href="/eventos"
            className="text-sm font-medium text-teal-800 hover:underline"
          >
            Ver lista completa
          </Link>
        </div>
        <EventsCalendar
          events={events}
          churches={churches}
          canPost
          authenticated={canPost}
        />
      </section>

      {ongoing.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Em andamento
            </h2>
            <span className="rounded-full bg-teal-800/10 px-2.5 py-0.5 text-xs font-medium text-teal-900">
              agora
            </span>
          </div>
          <div className="grid gap-4">
            {ongoing.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Próximos eventos
          </h2>
          <PostEventButton size="sm" authenticated={canPost} />
        </div>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-6 py-10 text-center">
            <p className="text-muted-foreground">
              {ongoing.length > 0
                ? "Nenhum outro evento futuro no momento."
                : "Nenhum evento futuro ainda. Líderes, publiquem o próximo culto!"}
            </p>
            {ongoing.length === 0 && (
              <div className="mt-4 flex justify-center">
                <PostEventButton authenticated={canPost} />
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
