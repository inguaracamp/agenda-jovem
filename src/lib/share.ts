/** Textos prontos para divulgação (WhatsApp, Instagram, etc.) */

export const SITE_SHARE_TITLE =
  "AgendaJovem — todos os cultos da rede num só lugar";

export const SITE_SHARE_DESCRIPTION =
  "Chega de perder culto no grupo. Veja datas, locais e cartazes da rede de jovens — e assine a agenda direto no celular.";

export function siteWhatsAppMessage(appUrl: string) {
  return [
    "📅 *AgendaJovem*",
    "",
    "Todos os cultos e eventos da rede de jovens num só lugar.",
    "Veja a agenda, baixe os cartazes e assine no celular.",
    "",
    `👉 ${appUrl}`,
  ].join("\n");
}
