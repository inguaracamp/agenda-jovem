import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatChurchAddress } from "@/lib/address";

export const dynamic = "force-dynamic";

export const metadata = { title: "Igrejas" };

export default async function IgrejasPage() {
  const churches = await prisma.church.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { events: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Igrejas da rede
        </h1>
        <p className="mt-2 text-muted-foreground">
          Cada cor no calendário corresponde a uma igreja.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {churches.map((church) => (
          <Link
            key={church.id}
            href={`/eventos?igreja=${church.id}`}
            className="rounded-2xl border bg-white/70 p-5 transition hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span
                className="size-4 rounded-full"
                style={{ backgroundColor: church.color }}
              />
              <h2 className="font-heading text-lg font-semibold">{church.name}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatChurchAddress(church)}
            </p>
            <p className="mt-4 text-sm font-medium text-teal-800">
              {church._count.events} evento(s) · ver na lista
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
