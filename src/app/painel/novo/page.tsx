import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EventForm } from "@/components/event-form";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Novo evento" };

export default async function NovoEventoPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!dbUser) {
    redirect("/login?callbackUrl=/painel/novo");
  }

  const churches = await prisma.church.findMany({ orderBy: { name: "asc" } });

  if (churches.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Cadastre uma igreja primeiro
        </h1>
        <p className="text-muted-foreground">
          Para publicar um evento, é preciso ter pelo menos uma igreja na rede.
        </p>
        <Button asChild>
          <Link href={dbUser.role === "ADMIN" ? "/admin" : "/cadastro"}>
            {dbUser.role === "ADMIN" ? "Ir para o admin" : "Criar conta com igreja"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Novo evento
        </h1>
        <p className="mt-1 text-muted-foreground">
          Preencha os dados e envie o cartaz do culto.
        </p>
      </div>
      <div className="rounded-2xl border bg-white/80 p-5 sm:p-6">
        <EventForm
          churches={churches}
          defaultChurchId={dbUser.churchId}
          lockChurch={dbUser.role !== "ADMIN" && !!dbUser.churchId}
        />
      </div>
    </div>
  );
}
