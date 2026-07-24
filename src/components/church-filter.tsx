"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Church } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  churches: Church[];
  value: string;
  onChange: (value: string) => void;
};

function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="size-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
      aria-hidden
    />
  );
}

export function ChurchFilter({ churches, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = churches.find((c) => c.id === value);
  const label = selected?.name ?? "Todas as igrejas";
  const color = selected?.color ?? "#94a3b8";

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className="relative flex min-w-[220px] flex-col gap-1.5 sm:min-w-[260px]"
    >
      <Label htmlFor="church-filter" className="text-xs text-muted-foreground">
        Filtrar por igreja
      </Label>
      <button
        id="church-filter"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-full items-center gap-2 rounded-lg border border-input bg-background px-3 text-left text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ColorDot color={color} />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby="church-filter"
          className="absolute top-[calc(100%+0.35rem)] right-0 left-0 z-50 max-h-64 overflow-y-auto rounded-lg border border-border bg-background py-1 shadow-md"
        >
          {churches.map((church) => (
            <li key={church.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === church.id}
                onClick={() => choose(church.id)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
                  value === church.id && "bg-muted font-medium",
                )}
              >
                <ColorDot color={church.color} />
                <span className="truncate">{church.name}</span>
              </button>
            </li>
          ))}
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={value === "all"}
              onClick={() => choose("all")}
              className={cn(
                "flex w-full items-center gap-2 border-t border-border/70 px-3 py-2 text-left text-sm hover:bg-muted",
                value === "all" && "bg-muted font-medium",
              )}
            >
              <ColorDot color="#94a3b8" />
              <span className="truncate">Todas as igrejas</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
