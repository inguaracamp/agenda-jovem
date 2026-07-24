import { headers } from "next/headers";

/** Domínio de produção (fallback quando a env não está definida). */
export const PRODUCTION_APP_URL = "https://agendas-jovens.vercel.app";

/** URL pública do app (feeds, WhatsApp, etc.) */
export async function getAppUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv && !fromEnv.includes("localhost")) return fromEnv;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host && !host.includes("localhost")) {
    const proto = h.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }

  if (fromEnv) return fromEnv;
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? "http";
    return `${proto}://${host}`;
  }

  return PRODUCTION_APP_URL;
}

export function whatsappShareUrl(text: string) {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
