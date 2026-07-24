import { headers } from "next/headers";

/** URL pública do app (feeds, WhatsApp, etc.) */
export async function getAppUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "http://localhost:3000";

  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export function whatsappShareUrl(text: string) {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
