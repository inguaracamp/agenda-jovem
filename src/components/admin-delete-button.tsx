"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

type Props = {
  endpoint: string;
  confirmMessage: string;
  label?: string;
};

export function AdminDeleteButton({
  endpoint,
  confirmMessage,
  label = "Remover",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
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
      className="shrink-0 text-destructive hover:text-destructive"
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
      {label}
    </Button>
  );
}
