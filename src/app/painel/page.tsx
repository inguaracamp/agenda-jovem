import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatEventRange } from "@/lib/date";
import { Plus, Pencil } from "lucide-react";
import { DeleteEventButton } from "@/components/delete-event-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Painel" };

export default async function PainelPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const events = await prisma.event.findMany({
    where:
      session.user.role === "ADMIN"
        ? undefined
        : { createdById: session.user.id },
    include: { church: true },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Olá, {session.user.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {session.user.role === "ADMIN"
              ? "Você vê todos os eventos da rede."
              : "Gerencie os cultos da sua igreja."}
          </p>
        </div>
        <Button asChild>
          <Link href="/painel/novo">
            <Plus className="size-4" />
            Novo evento
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-6 py-12 text-center text-muted-foreground">
          Nenhum evento ainda. Publique o primeiro culto!
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white/70">
          <ul className="divide-y">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.church.name} · {formatEventRange(event.startsAt, event.endsAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/painel/${event.id}/editar`}>
                      <Pencil className="size-3.5" />
                      Editar
                    </Link>
                  </Button>
                  <DeleteEventButton id={event.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
