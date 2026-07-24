import { prisma } from "@/lib/db";
import { buildEventIcs, getBaseUrl } from "@/lib/ics";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { church: true },
  });

  if (!event) {
    return new Response("Evento não encontrado", { status: 404 });
  }

  const baseUrl = getBaseUrl(request);
  const calendar = buildEventIcs(event, baseUrl);
  const filename = `${event.title.replace(/[^\w]+/g, "-").toLowerCase()}.ics`;

  return new Response(calendar.toString(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-cache",
    },
  });
}
