import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const email = data.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma conta com este e-mail" },
        { status: 409 },
      );
    }

    const passwordHash = await hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const church = await tx.church.create({
        data: {
          name: data.churchName.trim(),
          city: data.churchCity.trim(),
          address: data.churchAddress.trim(),
          neighborhood: data.churchNeighborhood.trim(),
          cep: data.churchCep,
          color: data.churchColor,
        },
      });

      const user = await tx.user.create({
        data: {
          name: data.name.trim(),
          email,
          passwordHash,
          role: "LEADER",
          churchId: church.id,
        },
      });

      return { user, church };
    });

    return NextResponse.json(
      {
        id: result.user.id,
        email: result.user.email,
        churchId: result.church.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/register", error);
    return NextResponse.json(
      { error: "Não foi possível criar a conta. Tente novamente." },
      { status: 500 },
    );
  }
}
