import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { EventsList } from "@/components/events-list";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Eventos",
};

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ igreja?: string }>;
}) {
  const { igreja } = await searchParams;
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  const now = new Date();

  const [events, churches] = await Promise.all([
    prisma.event.findMany({
      where: { endsAt: { gte: now } },
      include: { church: true },
      orderBy: { startsAt: "asc" },
    }),
    prisma.church.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Eventos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Em andamento e próximos. Filtre por igreja e abra o detalhe.
          </p>
        </div>
      </div>
      <EventsList
        events={events}
        churches={churches}
        initialChurchId={igreja}
        canPost
        authenticated={isLoggedIn}
      />
    </div>
  );
}
