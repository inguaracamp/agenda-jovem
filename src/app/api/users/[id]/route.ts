import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Só admin" }, { status: 403 });
    }

    const { id } = await params;

    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Você não pode remover a própria conta" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.event.deleteMany({ where: { createdById: id } });
      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/users/[id]", error);
    return NextResponse.json(
      { error: "Não foi possível remover o líder" },
      { status: 500 },
    );
  }
}
