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
    const church = await prisma.church.findUnique({ where: { id } });
    if (!church) {
      return NextResponse.json({ error: "Igreja não encontrada" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.event.deleteMany({ where: { churchId: id } });
      await tx.user.updateMany({
        where: { churchId: id },
        data: { churchId: null },
      });
      await tx.church.delete({ where: { id } });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/churches/[id]", error);
    return NextResponse.json(
      { error: "Não foi possível remover a igreja" },
      { status: 500 },
    );
  }
}
