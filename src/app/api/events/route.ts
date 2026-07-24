import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validators";
import { brasiliaLocalToUtc } from "@/lib/date";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const churchId = searchParams.get("churchId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const events = await prisma.event.findMany({
    where: {
      ...(churchId ? { churchId } : {}),
      ...(from || to
        ? {
            startsAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    include: { church: true, createdBy: { select: { id: true, name: true } } },
    orderBy: { startsAt: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!dbUser) {
      return NextResponse.json(
        { error: "Sessão inválida. Saia e entre novamente." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const startsAt = brasiliaLocalToUtc(data.startsAt);
    const endsAt = brasiliaLocalToUtc(data.endsAt);

    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      return NextResponse.json(
        { error: "Data ou horário inválidos" },
        { status: 400 },
      );
    }

    if (endsAt <= startsAt) {
      return NextResponse.json(
        { error: "O fim deve ser depois do início" },
        { status: 400 },
      );
    }

    const churchId =
      dbUser.role === "ADMIN"
        ? data.churchId
        : (dbUser.churchId ?? data.churchId);

    if (!churchId) {
      return NextResponse.json(
        { error: "Líder sem igreja vinculada. Cadastre ou selecione uma igreja." },
        { status: 400 },
      );
    }

    const church = await prisma.church.findUnique({ where: { id: churchId } });
    if (!church) {
      return NextResponse.json(
        { error: "Igreja não encontrada. Atualize a página e tente de novo." },
        { status: 400 },
      );
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        type: data.type,
        churchId,
        createdById: dbUser.id,
        startsAt,
        endsAt,
        location: data.location,
        description: data.description ?? "",
        posterUrl: data.posterUrl || null,
      },
      include: { church: true },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/events", error);
    return NextResponse.json(
      { error: "Não foi possível publicar o evento. Tente novamente." },
      { status: 500 },
    );
  }
}
