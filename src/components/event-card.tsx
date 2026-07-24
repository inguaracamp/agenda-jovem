import Link from "next/link";
import Image from "next/image";
import type { Church, Event } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatEventRange } from "@/lib/date";
import { eventTypeLabels } from "@/lib/validators";
import { MapPin } from "lucide-react";

type EventCardProps = {
  event: Event & { church: Church };
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/eventos/${event.id}`}
      className="group grid overflow-hidden rounded-2xl border border-border/70 bg-card transition hover:border-primary/30 hover:shadow-md sm:grid-cols-[140px_1fr]"
    >
      <div
        className="relative min-h-36 bg-muted sm:min-h-full"
        style={{
          background: `linear-gradient(145deg, ${event.church.color}22, ${event.church.color}55)`,
        }}
      >
        {event.posterUrl ? (
          <Image
            src={event.posterUrl}
            alt={`Cartaz de ${event.title}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="140px"
          />
        ) : (
          <div className="flex h-full min-h-36 items-center justify-center p-4 text-center text-sm font-medium text-foreground/70">
            {event.church.name}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            style={{
              backgroundColor: `${event.church.color}18`,
              color: event.church.color,
              borderColor: `${event.church.color}33`,
            }}
          >
            {event.church.name}
          </Badge>
          <Badge variant="outline">{eventTypeLabels[event.type]}</Badge>
        </div>
        <h3 className="font-heading text-lg font-semibold tracking-tight group-hover:text-primary">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatEventRange(event.startsAt, event.endsAt)}
        </p>
        <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </p>
      </div>
    </Link>
  );
}
