import { prisma } from "@/lib/db";
import { buildFeedIcs, getBaseUrl } from "@/lib/ics";

export async function GET(request: Request) {
  const events = await prisma.event.findMany({
    where: { startsAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    include: { church: true },
    orderBy: { startsAt: "asc" },
  });

  const calendar = buildFeedIcs(events, getBaseUrl(request));

  return new Response(calendar.toString(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="agenda-jovem.ics"',
      "Cache-Control": "public, max-age=300",
    },
  });
}
