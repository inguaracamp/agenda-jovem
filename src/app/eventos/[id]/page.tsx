import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatEventRange } from "@/lib/date";
import {
  eventNavigationQuery,
  formatChurchAddress,
  mapsUrl,
  wazeUrl,
} from "@/lib/address";
import { getAppUrl, whatsappShareUrl } from "@/lib/app-url";
import { eventTypeLabels } from "@/lib/validators";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteEventButton } from "@/components/delete-event-button";
import { cn } from "@/lib/utils";
import {
  CalendarPlus,
  MapPin,
  Share2,
  ArrowLeft,
  Navigation,
  Pencil,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  return { title: event?.title ?? "Evento" };
}

export default async function EventoDetailPage({ params }: Props) {
  const { id } = await params;
  const [session, event, appUrl] = await Promise.all([
    auth(),
    prisma.event.findUnique({
      where: { id },
      include: {
        church: true,
        createdBy: { select: { id: true, name: true } },
      },
    }),
    getAppUrl(),
  ]);

  if (!event) notFound();

  const canManage =
    !!session?.user &&
    (session.user.role === "ADMIN" || session.user.id === event.createdById);

  const churchAddress = formatChurchAddress(event.church);
  const navQuery = eventNavigationQuery(event.church, event.location);
  const googleMaps = mapsUrl(navQuery);
  const waze = wazeUrl(navQuery);

  const eventUrl = `${appUrl}/eventos/${event.id}`;
  const whatsappHref = whatsappShareUrl(
    `${event.title} — ${event.church.name}\n${formatEventRange(event.startsAt, event.endsAt)}\n${churchAddress}\n\n${eventUrl}`,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/eventos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>

        {canManage && (
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/painel/${event.id}/editar`}>
                <Pencil className="size-3.5" />
                Editar
              </Link>
            </Button>
            <DeleteEventButton id={event.id} redirectTo="/eventos" />
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge
              style={{
                backgroundColor: `${event.church.color}18`,
                color: event.church.color,
              }}
            >
              {event.church.name}
            </Badge>
            <Badge variant="outline">{eventTypeLabels[event.type]}</Badge>
          </div>

          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {event.title}
          </h1>

          <p className="text-lg text-muted-foreground">
            {formatEventRange(event.startsAt, event.endsAt)}
          </p>

          <div className="space-y-3 rounded-2xl border bg-white/70 p-4">
            <p className="flex items-start gap-2 text-foreground/90">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-800" />
              <span>
                <span className="block font-medium">{event.church.name}</span>
                <span className="text-sm text-muted-foreground">
                  {churchAddress}
                </span>
                {event.location && event.location !== churchAddress && (
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Local do evento: {event.location}
                  </span>
                )}
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              <a
                href={googleMaps}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                <Navigation className="size-4" />
                Abrir no Maps
              </a>
              <a
                href={waze}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
              >
                <Navigation className="size-4" />
                Abrir no Waze
              </a>
            </div>
          </div>

          {event.description?.trim() ? (
            <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-foreground/90">
              {event.description}
            </div>
          ) : null}

          <p className="text-sm text-muted-foreground">
            Publicado por {event.createdBy.name} · {event.church.city}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`/api/events/${event.id}/ics`}
              className={cn(buttonVariants())}
            >
              <CalendarPlus className="size-4" />
              Adicionar à minha agenda
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Share2 className="size-4" />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border bg-muted shadow-sm">
          {event.posterUrl ? (
            <Image
              src={event.posterUrl}
              alt={`Cartaz de ${event.title}`}
              fill
              className="object-cover"
              sizes="340px"
              priority
            />
          ) : (
            <div
              className="flex h-full items-center justify-center p-6 text-center"
              style={{
                background: `linear-gradient(160deg, ${event.church.color}33, ${event.church.color}66)`,
              }}
            >
              <div>
                <p className="font-heading text-2xl font-semibold">{event.title}</p>
                <p className="mt-2 text-sm opacity-80">{event.church.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
