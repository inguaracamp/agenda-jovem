"use client";

import type { Church } from "@prisma/client";
import { cn } from "@/lib/utils";

type Props = {
  churches: Church[];
  value: string;
  onChange: (value: string) => void;
};

export function ChurchFilter({ churches, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterChip
        active={value === "all"}
        onClick={() => onChange("all")}
        label="Todas as igrejas"
      />
      {churches.map((church) => (
        <FilterChip
          key={church.id}
          active={value === church.id}
          onClick={() => onChange(church.id)}
          label={church.name}
          color={church.color}
        />
      ))}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
      )}
    >
      {color && (
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {label}
    </button>
  );
}
