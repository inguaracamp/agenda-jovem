"use client";

import { useEffect, useMemo, useState } from "react";
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
  authenticated?: boolean;
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

export function EventsCalendar({
  events,
  churches,
  initialChurchId,
  canPost = false,
  authenticated = false,
}: Props) {
  const router = useRouter();
  const isMobile = useIsMobile();
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
      <div className="flex flex-wrap items-end justify-between gap-3">
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

      <div className="agenda-calendar overflow-hidden rounded-2xl border border-border/70 bg-card p-2 sm:p-4">
        <FullCalendar
          key={isMobile ? "mobile" : "desktop"}
          plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="pt-br"
          headerToolbar={
            isMobile
              ? {
                  start: "prev,next",
                  center: "title",
                  end: "today",
                }
              : {
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,listMonth",
                }
          }
          footerToolbar={
            isMobile
              ? {
                  center: "dayGridMonth,listMonth",
                }
              : false
          }
          titleFormat={
            isMobile
              ? { year: "numeric", month: "short" }
              : { year: "numeric", month: "long" }
          }
          buttonText={{
            today: "Hoje",
            month: "Mês",
            list: "Lista",
          }}
          height="auto"
          contentHeight="auto"
          stickyHeaderDates={false}
          dayMaxEvents={isMobile ? 2 : true}
          moreLinkClick="popover"
          events={fcEvents}
          eventClick={(info) => {
            info.jsEvent.preventDefault();
            router.push(`/eventos/${info.event.id}`);
          }}
          eventContent={(arg) => (
            <div className="overflow-hidden px-1 py-0.5 leading-tight">
              <div className="truncate font-medium">{arg.event.title}</div>
              {!isMobile && (
                <div className="truncate opacity-80">
                  {arg.event.extendedProps.church}
                </div>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
