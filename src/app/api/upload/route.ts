import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Envie uma imagem (JPG, PNG ou WEBP)" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Imagem maior que 5MB" },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `cartazes/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Produção (Vercel): Blob. Local: pasta public/uploads
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ url: blob.url });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const localName = filename.replace("cartazes/", "");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, localName), bytes);

    return NextResponse.json({ url: `/uploads/${localName}` });
  } catch (error) {
    console.error("POST /api/upload", error);
    return NextResponse.json(
      { error: "Falha no upload. Tente novamente." },
      { status: 500 },
    );
  }
}
