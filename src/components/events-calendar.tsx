"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { Church, Event } from "@prisma/client";
import { ChurchFilter } from "@/components/church-filter";
import { PostEventButton } from "@/components/post-event-button";

type CalendarEvent = Event & { church: Church };

type Props = {
  events: CalendarEvent[];
  churches: Church[];
  initialChurchId?: string;
  canPost?: boolean;
};

export function EventsCalendar({
  events,
  churches,
  initialChurchId,
  canPost = false,
}: Props) {
  const router = useRouter();
  const [churchId, setChurchId] = useState(initialChurchId ?? "all");

  const filtered = useMemo(
    () =>
      churchId === "all"
        ? events
        : events.filter((e) => e.churchId === churchId),
    [events, churchId],
  );

  const fcEvents = filtered.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startsAt,
    end: event.endsAt,
    backgroundColor: event.church.color,
    borderColor: event.church.color,
    extendedProps: { church: event.church.name },
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ChurchFilter
          churches={churches}
          value={churchId}
          onChange={setChurchId}
        />
        {canPost && (
          <PostEventButton size="sm" className="shrink-0" />
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card p-3 sm:p-4 [&_.fc]:font-sans [&_.fc-button]:rounded-lg [&_.fc-button]:border-border [&_.fc-button]:bg-background [&_.fc-button]:capitalize [&_.fc-button-primary:not(:disabled)]:bg-primary [&_.fc-button-primary:not(:disabled)]:border-primary [&_.fc-col-header-cell-cushion]:py-2 [&_.fc-col-header-cell-cushion]:text-xs [&_.fc-col-header-cell-cushion]:font-semibold [&_.fc-col-header-cell-cushion]:uppercase [&_.fc-col-header-cell-cushion]:tracking-wide [&_.fc-col-header-cell-cushion]:text-muted-foreground [&_.fc-daygrid-day-number]:p-2 [&_.fc-daygrid-day-number]:text-sm [&_.fc-event]:cursor-pointer [&_.fc-event]:rounded-md [&_.fc-event]:border-0 [&_.fc-event]:px-1 [&_.fc-event]:text-xs [&_.fc-toolbar-title]:font-heading [&_.fc-toolbar-title]:text-xl [&_.fc-toolbar-title]:font-semibold">
        <FullCalendar
          plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="pt-br"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listMonth",
          }}
          buttonText={{
            today: "Hoje",
            month: "Mês",
            list: "Lista",
          }}
          height="auto"
          events={fcEvents}
          eventClick={(info) => {
            info.jsEvent.preventDefault();
            router.push(`/eventos/${info.event.id}`);
          }}
          eventContent={(arg) => (
            <div className="overflow-hidden px-1 py-0.5 leading-tight">
              <div className="truncate font-medium">{arg.event.title}</div>
              <div className="truncate opacity-80">
                {arg.event.extendedProps.church}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
