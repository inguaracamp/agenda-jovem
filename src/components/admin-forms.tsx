"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function AdminChurchForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/churches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        city: form.get("city"),
        address: form.get("address"),
        neighborhood: form.get("neighborhood"),
        cep: form.get("cep"),
        color: form.get("color"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Erro");
      return;
    }
    setOk(true);
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border p-4">
      <h3 className="font-heading font-semibold">Nova igreja</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" name="city" required placeholder="Ex.: Rio de Janeiro" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" name="address" required placeholder="Ex.: Rua das Flores, 123" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input id="neighborhood" name="neighborhood" required placeholder="Ex.: Centro" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cep">CEP</Label>
          <Input id="cep" name="cep" required placeholder="00000-000" inputMode="numeric" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="color">Cor</Label>
          <Input id="color" name="color" type="color" defaultValue="#0F766E" />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {ok && <p className="text-sm text-teal-700">Igreja criada!</p>}
      <Button type="submit" disabled={loading} size="sm">
        {loading && <Loader2 className="size-4 animate-spin" />}
        Adicionar
      </Button>
    </form>
  );
}

type ChurchOption = { id: string; name: string };

export function AdminLeaderForm({ churches }: { churches: ChurchOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/churches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "leader",
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        churchId: form.get("churchId") || null,
        role: form.get("role") || "LEADER",
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Erro");
      return;
    }
    setOk(true);
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border p-4">
      <h3 className="font-heading font-semibold">Novo líder</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="lname">Nome</Label>
          <Input id="lname" name="name" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lemail">E-mail</Label>
          <Input id="lemail" name="email" type="email" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lpass">Senha</Label>
          <Input id="lpass" name="password" type="password" required minLength={6} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lchurch">Igreja</Label>
          <select
            id="lchurch"
            name="churchId"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="">Sem igreja</option>
            {churches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="lrole">Papel</Label>
          <select
            id="lrole"
            name="role"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            defaultValue="LEADER"
          >
            <option value="LEADER">Líder</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {ok && <p className="text-sm text-teal-700">Líder criado!</p>}
      <Button type="submit" disabled={loading} size="sm">
        {loading && <Loader2 className="size-4 animate-spin" />}
        Criar conta
      </Button>
    </form>
  );
}
