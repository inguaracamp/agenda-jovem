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

export function mapsUrl(church: AddressParts) {
  const q = encodeURIComponent(formatChurchAddressQuery(church));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function wazeUrl(church: AddressParts) {
  const q = encodeURIComponent(formatChurchAddressQuery(church));
  return `https://waze.com/ul?q=${q}&navigate=yes`;
}

/** Aceita 00000000 ou 00000-000 e normaliza para 00000-000 */
export function normalizeCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length !== 8) return value.trim();
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
