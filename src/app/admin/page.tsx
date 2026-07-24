import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminChurchForm, AdminLeaderForm } from "@/components/admin-forms";
import { AdminDeleteButton } from "@/components/admin-delete-button";
import { formatEventRange } from "@/lib/date";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/painel");

  const [churches, leaders, events] = await Promise.all([
    prisma.church.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { events: true, users: true } } },
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      include: { church: true },
    }),
    prisma.event.findMany({
      orderBy: { startsAt: "desc" },
      include: { church: true },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Administração
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie igrejas, líderes e eventos da rede.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">Igrejas</h2>
        <div className="overflow-hidden rounded-2xl border bg-white/70">
          {churches.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Nenhuma igreja cadastrada.
            </p>
          ) : (
            <ul className="divide-y">
              {churches.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
                >
                  <span
                    className="mt-1 size-3 shrink-0 rounded-full sm:mt-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.address}, {c.neighborhood} — {c.city} · CEP {c.cep}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {c._count.events} eventos · {c._count.users} líderes
                    </p>
                  </div>
                  <AdminDeleteButton
                    endpoint={`/api/churches/${c.id}`}
                    confirmMessage={`Remover a igreja "${c.name}"? Os eventos dela também serão apagados.`}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <AdminChurchForm />
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">Líderes</h2>
        <div className="overflow-hidden rounded-2xl border bg-white/70">
          <ul className="divide-y">
            {leaders.map((u) => (
              <li
                key={u.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {u.name}{" "}
                    <span className="text-xs font-normal uppercase text-muted-foreground">
                      {u.role}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {u.email}
                    {u.church ? ` · ${u.church.name}` : ""}
                  </p>
                </div>
                {u.id !== session.user.id ? (
                  <AdminDeleteButton
                    endpoint={`/api/users/${u.id}`}
                    confirmMessage={`Remover "${u.name}"? Os eventos criados por esta pessoa também serão apagados.`}
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">Você</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <AdminLeaderForm churches={churches} />
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">Eventos</h2>
        <div className="overflow-hidden rounded-2xl border bg-white/70">
          {events.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Nenhum evento cadastrado.
            </p>
          ) : (
            <ul className="divide-y">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.church.name} ·{" "}
                      {formatEventRange(event.startsAt, event.endsAt)}
                    </p>
                  </div>
                  <AdminDeleteButton
                    endpoint={`/api/events/${event.id}`}
                    confirmMessage={`Remover o evento "${event.title}"?`}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
