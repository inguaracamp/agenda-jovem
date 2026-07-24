import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validators";
import { brasiliaLocalToUtc } from "@/lib/date";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { church: true, createdBy: { select: { id: true, name: true } } },
  });

  if (!event) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const canEdit =
    session.user.role === "ADMIN" || existing.createdById === session.user.id;
  if (!canEdit) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
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

  if (endsAt <= startsAt) {
    return NextResponse.json(
      { error: "O fim deve ser depois do início" },
      { status: 400 },
    );
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      type: data.type,
      churchId:
        session.user.role === "ADMIN" ? data.churchId : existing.churchId,
      startsAt,
      endsAt,
      location: data.location,
      description: data.description ?? "",
      posterUrl: data.posterUrl ?? null,
    },
    include: { church: true },
  });

  return NextResponse.json(event);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const canDelete =
    session.user.role === "ADMIN" || existing.createdById === session.user.id;
  if (!canDelete) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
