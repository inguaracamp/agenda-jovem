import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { churchSchema, leaderSchema } from "@/lib/validators";
import { hash } from "bcryptjs";

export async function GET() {
  const churches = await prisma.church.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { events: true, users: true } } },
  });
  return NextResponse.json(churches);
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Só admin" }, { status: 403 });
  }

  const body = await request.json();

  if (body.kind === "leader") {
    const parsed = leaderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 },
      );
    }
    const data = parsed.data;
    const passwordHash = await hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        churchId: data.churchId || null,
      },
    });
    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      { status: 201 },
    );
  }

  const parsed = churchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }

  const church = await prisma.church.create({ data: parsed.data });
  return NextResponse.json(church, { status: 201 });
}
