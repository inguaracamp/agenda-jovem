import { prisma } from "@/lib/db";
import { buildFeedIcs, getBaseUrl } from "@/lib/ics";

export async function GET(request: Request) {
  const events = await prisma.event.findMany({
    where: {
      // inclui andamento + futuros + últimos 7 dias
      endsAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    include: { church: true },
    orderBy: { startsAt: "asc" },
  });

  const calendar = buildFeedIcs(events, getBaseUrl(request));
  const body = calendar.toString();

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="agenda-jovem.ics"',
      "Cache-Control": "public, max-age=300",
      // ajuda clientes (Outlook/Google) a assinar o feed
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
