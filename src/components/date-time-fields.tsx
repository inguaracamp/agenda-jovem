"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string; // yyyy-MM-ddTHH:mm
};

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

function splitValue(value?: string) {
  if (!value || !value.includes("T")) {
    return { date: "", hour: "19", minute: "00" };
  }
  const [date, time = "19:00"] = value.split("T");
  const [hour = "19", rawMinute = "00"] = time.split(":");
  const rounded = Math.min(55, Math.round(Number(rawMinute) / 5) * 5);
  const minute = String(Number.isFinite(rounded) ? rounded : 0).padStart(2, "0");
  return {
    date,
    hour,
    minute: MINUTES.includes(minute) ? minute : "00",
  };
}
export function DateTimeFields({ name, label, required, defaultValue }: Props) {
  const id = useId();
  const initial = splitValue(defaultValue);
  const [date, setDate] = useState(initial.date);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  const combined =
    date && hour && minute ? `${date}T${hour}:${minute}` : "";

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-date`}>{label}</Label>
      <input type="hidden" name={name} value={combined} />

      <div className="space-y-2 rounded-xl border border-border/70 bg-muted/20 p-3">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Data</p>
          <Input
            id={`${id}-date`}
            type="date"
            required={required}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              // Fecha o pop-up nativo da data após a seleção
              requestAnimationFrame(() => e.target.blur());
            }}
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Horário
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Horas"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="flex h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
              required={required}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">horas</span>

            <select
              aria-label="Minutos"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="flex h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
              required={required}
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">minutos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
