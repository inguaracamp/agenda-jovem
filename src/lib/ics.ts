import ical, { ICalCalendarMethod } from "ical-generator";
import { DateTime } from "luxon";
import type { Event, Church } from "@prisma/client";
import { formatChurchAddress } from "@/lib/address";

type EventWithChurch = Event & { church: Church };

const PRODID = {
  company: "AgendaJovem",
  product: "Agenda de Cultos",
  language: "PT-BR" as const,
};

const TZ = "America/Sao_Paulo";

export function buildEventIcs(event: EventWithChurch, baseUrl: string) {
  const calendar = ical({
    name: "AgendaJovem",
    prodId: PRODID,
    method: ICalCalendarMethod.PUBLISH,
    timezone: TZ,
  });

  addEvent(calendar, event, baseUrl);
  return calendar;
}

export function buildFeedIcs(events: EventWithChurch[], baseUrl: string) {
  const calendar = ical({
    name: "AgendaJovem — Rede de Cultos",
    description: "Agenda compartilhada de cultos e eventos da rede de jovens",
    prodId: PRODID,
    method: ICalCalendarMethod.PUBLISH,
    timezone: TZ,
    ttl: 60 * 60,
    source: `${baseUrl}/api/calendar.ics`,
    url: `${baseUrl}/api/calendar.ics`,
  });

  for (const event of events) {
    addEvent(calendar, event, baseUrl);
  }

  return calendar;
}

function toZoned(date: Date) {
  return DateTime.fromJSDate(date, { zone: "utc" }).setZone(TZ);
}

function addEvent(
  calendar: ReturnType<typeof ical>,
  event: EventWithChurch,
  baseUrl: string,
) {
  const detailUrl = `${baseUrl}/eventos/${event.id}`;
  const churchAddress = formatChurchAddress(event.church);
  const description = [
    event.description,
    "",
    `Igreja: ${event.church.name}`,
    `Endereço: ${churchAddress}`,
    event.posterUrl ? `Cartaz: ${absoluteUrl(baseUrl, event.posterUrl)}` : null,
    `Mais info: ${detailUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  calendar.createEvent({
    id: `${event.id}@agenda-jovem`,
    start: toZoned(event.startsAt),
    end: toZoned(event.endsAt),
    timezone: TZ,
    summary: `${event.title} — ${event.church.name}`,
    description,
    location: churchAddress || event.location,
    url: detailUrl,
    stamp: DateTime.utc(),
  });
}

function absoluteUrl(baseUrl: string, path: string) {
  if (path.startsWith("http")) return path;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getBaseUrl(request?: Request) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.AUTH_URL) {
    return process.env.AUTH_URL.replace(/\/$/, "");
  }
  if (request) {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}`;
  }
  return "https://agendas-jovens.vercel.app";
}

export function outlookSubscribeUrl(feedUrl: string, name = "AgendaJovem") {
  const params = new URLSearchParams({
    url: feedUrl,
    name,
  });
  return `https://outlook.live.com/calendar/0/addfromweb?${params.toString()}`;
}

export function outlookOfficeSubscribeUrl(
  feedUrl: string,
  name = "AgendaJovem",
) {
  const params = new URLSearchParams({
    url: feedUrl,
    name,
  });
  return `https://outlook.office.com/calendar/0/addfromweb?${params.toString()}`;
}
