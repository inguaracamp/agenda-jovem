import type { Church } from "@prisma/client";

type AddressParts = Pick<
  Church,
  "name" | "address" | "neighborhood" | "city" | "cep"
>;

export function formatChurchAddress(church: AddressParts) {
  const parts = [
    church.address,
    church.neighborhood,
    church.city,
    church.cep ? `CEP ${church.cep}` : null,
  ].filter(Boolean);
  return parts.join(" — ");
}

export function formatChurchAddressQuery(church: AddressParts) {
  return [church.address, church.neighborhood, church.city, church.cep, church.name]
    .filter(Boolean)
    .join(", ");
}

export function mapsUrl(queryOrChurch: string | AddressParts) {
  const query =
    typeof queryOrChurch === "string"
      ? queryOrChurch
      : formatChurchAddressQuery(queryOrChurch);
  const q = encodeURIComponent(query.trim());
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function wazeUrl(queryOrChurch: string | AddressParts) {
  const query =
    typeof queryOrChurch === "string"
      ? queryOrChurch
      : formatChurchAddressQuery(queryOrChurch);
  const q = encodeURIComponent(query.trim());
  return `https://waze.com/ul?q=${q}&navigate=yes`;
}

/** Melhor texto de busca: local do evento + endereço da igreja */
export function eventNavigationQuery(
  church: AddressParts,
  eventLocation?: string | null,
) {
  const churchQuery = formatChurchAddressQuery(church);
  const location = eventLocation?.trim();
  if (!location || location === churchQuery || location === formatChurchAddress(church)) {
    return churchQuery;
  }
  return `${location}, ${church.city}`;
}

/** Aceita 00000000 ou 00000-000 e normaliza para 00000-000 */
export function normalizeCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length !== 8) return value.trim();
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
