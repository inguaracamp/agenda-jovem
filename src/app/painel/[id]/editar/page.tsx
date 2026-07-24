import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { EventForm } from "@/components/event-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  return { title: event ? `Editar · ${event.title}` : "Editar" };
}

export default async function EditarEventoPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const canEdit =
    session.user.role === "ADMIN" || event.createdById === session.user.id;
  if (!canEdit) redirect("/painel");

  const churches = await prisma.church.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Editar evento
        </h1>
        <p className="mt-1 text-muted-foreground">{event.title}</p>
      </div>
      <div className="rounded-2xl border bg-white/80 p-5 sm:p-6">
        <EventForm
          churches={churches}
          event={event}
          lockChurch={session.user.role !== "ADMIN"}
        />
      </div>
    </div>
  );
}
