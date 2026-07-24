import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const APP_TZ = "America/Sao_Paulo";

export function toBrasiliaDate(date: Date | string) {
  return formatInTimeZone(date, APP_TZ, "dd/MM/yyyy", { locale: ptBR });
}

export function toBrasiliaTime(date: Date | string) {
  return formatInTimeZone(date, APP_TZ, "HH:mm", { locale: ptBR });
}

export function toBrasiliaDateTime(date: Date | string) {
  return formatInTimeZone(date, APP_TZ, "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR,
  });
}

/** Converte datetime-local (horário de Brasília) para Date UTC */
export function brasiliaLocalToUtc(local: string) {
  return fromZonedTime(local, APP_TZ);
}

export function formatEventRange(startsAt: Date, endsAt: Date) {
  const sameDay =
    formatInTimeZone(startsAt, APP_TZ, "yyyy-MM-dd") ===
    formatInTimeZone(endsAt, APP_TZ, "yyyy-MM-dd");

  if (sameDay) {
    return `${toBrasiliaDate(startsAt)} · ${toBrasiliaTime(startsAt)}–${toBrasiliaTime(endsAt)}`;
  }

  return `${toBrasiliaDateTime(startsAt)} → ${toBrasiliaDateTime(endsAt)}`;
}

export function formatShortDate(date: Date) {
  return format(date, "d MMM", { locale: ptBR });
}
