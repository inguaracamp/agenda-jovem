"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Church, Event, EventType } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { APP_TZ } from "@/lib/date";
import { DateTimeFields } from "@/components/date-time-fields";
import { Loader2, Upload, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";

type Props = {
  churches: Church[];
  defaultChurchId?: string | null;
  lockChurch?: boolean;
  event?: Event;
};

function toLocalInput(date: Date) {
  return formatInTimeZone(date, APP_TZ, "yyyy-MM-dd'T'HH:mm");
}

export function EventForm({
  churches,
  defaultChurchId,
  lockChurch,
  event,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState(event?.posterUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState<EventType>(event?.type ?? "CULTO");
  const [churchId, setChurchId] = useState(
    event?.churchId ?? defaultChurchId ?? churches[0]?.id ?? "",
  );

  async function onUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as { url?: string; error?: string };
        } catch {
          throw new Error("Falha no upload. Tente novamente.");
        }
      }
      if (!res.ok) throw new Error(data.error || "Falha no upload");
      if (!data.url) throw new Error("Upload sem URL de retorno");
      // cache-bust para a prévia atualizar na hora
      setPosterUrl(`${data.url}?v=${Date.now()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  function posterPathForSave() {
    if (!posterUrl) return null;
    // remove ?v=... antes de gravar
    return posterUrl.split("?")[0] || null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      title: String(form.get("title") || ""),
      type,
      churchId,
      startsAt: String(form.get("startsAt") || ""),
      endsAt: String(form.get("endsAt") || ""),
      location: String(form.get("location") || ""),
      description: String(form.get("description") || ""),
      posterUrl: posterPathForSave(),
    };

    try {
      const res = await fetch(
        event ? `/api/events/${event.id}` : "/api/events",
        {
          method: event ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const text = await res.text();
      let data: { id?: string; error?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as { id?: string; error?: string };
        } catch {
          throw new Error("Resposta inválida do servidor. Tente novamente.");
        }
      }

      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar");
      }
      if (!data.id) {
        throw new Error("Evento criado, mas sem ID na resposta.");
      }

      router.push(`/eventos/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={event?.title}
            placeholder="Culto de Jovens"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="CULTO">Culto</option>
            <option value="FESTIVIDADE">Festividade/Congresso</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="churchId">Igreja</Label>
          <select
            id="churchId"
            value={churchId}
            onChange={(e) => setChurchId(e.target.value)}
            disabled={lockChurch}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm disabled:opacity-50"
          >
            {churches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <DateTimeFields
          name="startsAt"
          label="Início"
          required
          defaultValue={event ? toLocalInput(event.startsAt) : undefined}
        />

        <DateTimeFields
          name="endsAt"
          label="Fim"
          required
          defaultValue={event ? toLocalInput(event.endsAt) : undefined}
        />

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            name="location"
            required
            defaultValue={event?.location}
            placeholder="Endereço ou nome do local"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={event?.description}
            placeholder="Detalhes do culto, temas, avisos..."
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label>Cartaz {event ? "(pode trocar ou remover)" : "(opcional)"}</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex flex-col gap-2 sm:min-w-56">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-muted/70">
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : posterUrl ? (
                  <ImagePlus className="size-4" />
                ) : (
                  <Upload className="size-4" />
                )}
                {uploading
                  ? "Enviando..."
                  : posterUrl
                    ? "Trocar imagem"
                    : "Enviar imagem"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const input = e.currentTarget;
                    const file = input.files?.[0];
                    if (file) void onUpload(file);
                    input.value = "";
                  }}
                />
              </label>
              {posterUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setPosterUrl("")}
                >
                  <Trash2 className="size-3.5" />
                  Remover cartaz
                </Button>
              )}
            </div>
            {posterUrl ? (
              <div className="relative h-40 w-28 overflow-hidden rounded-xl border bg-muted">
                <Image
                  key={posterUrl}
                  src={posterUrl.split("?")[0]!}
                  alt="Prévia do cartaz"
                  fill
                  className="object-cover"
                  sizes="112px"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-40 w-28 items-center justify-center rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                Sem cartaz
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG ou WEBP até 5MB. Depois de trocar, clique em{" "}
            {event ? "Salvar alterações" : "Publicar evento"}.
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {event ? "Salvar alterações" : "Publicar evento"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
