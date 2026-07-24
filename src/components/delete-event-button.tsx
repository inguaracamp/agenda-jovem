"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

type Props = {
  id: string;
  redirectTo?: string;
};

export function DeleteEventButton({ id, redirectTo }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Remover este evento?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const text = await res.text();
      let data: { error?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as { error?: string };
        } catch {
          /* ignore */
        }
      }
      if (!res.ok) {
        alert(data.error || "Não foi possível remover");
        return;
      }
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onDelete}
      disabled={loading}
      className="text-destructive hover:text-destructive"
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
      Remover
    </Button>
  );
}
