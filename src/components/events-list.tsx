"use client";

import { useMemo, useState } from "react";
import type { Church, Event } from "@prisma/client";
import { EventCard } from "@/components/event-card";
import { ChurchFilter } from "@/components/church-filter";
import { PostEventButton } from "@/components/post-event-button";

type EventItem = Event & { church: Church };

type Props = {
  events: EventItem[];
  churches: Church[];
  initialChurchId?: string;
  canPost?: boolean;
  authenticated?: boolean;
};

export function EventsList({
  events,
  churches,
  initialChurchId,
  canPost = false,
  authenticated = false,
}: Props) {
  const [churchId, setChurchId] = useState(initialChurchId ?? "all");

  const filtered = useMemo(
    () =>
      churchId === "all"
        ? events
        : events.filter((e) => e.churchId === churchId),
    [events, churchId],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ChurchFilter
          churches={churches}
          value={churchId}
          onChange={setChurchId}
        />
        {canPost && (
          <PostEventButton
            size="sm"
            className="shrink-0"
            authenticated={authenticated}
          />
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
          Nenhum evento encontrado para este filtro.
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
