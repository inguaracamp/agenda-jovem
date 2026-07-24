"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const CHURCH_COLORS = [
  "#0F766E",
  "#B45309",
  "#1D4ED8",
  "#BE123C",
  "#7C3AED",
  "#047857",
];

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLeader, setIsLeader] = useState(true);
  const [color, setColor] = useState(CHURCH_COLORS[0]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isLeader) {
      setError("No momento só líderes podem criar conta e cadastrar a igreja.");
      return;
    }

    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email,
          password,
          role: "LEADER",
          churchName: form.get("churchName"),
          churchCity: form.get("churchCity"),
          churchAddress: form.get("churchAddress"),
          churchNeighborhood: form.get("churchNeighborhood"),
          churchCep: form.get("churchCep"),
          churchColor: color,
        }),
      });

      const text = await res.text();
      let data: { error?: string; id?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as { error?: string; id?: string };
        } catch {
          throw new Error("Resposta inválida do servidor. Tente novamente.");
        }
      }
      if (!res.ok) {
        throw new Error(data.error || "Não foi possível criar a conta");
      }
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (login?.error) {
        router.push("/login");
        return;
      }

      router.push("/painel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Seu nome</Label>
        <Input id="name" name="name" required placeholder="Como você se chama" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      <fieldset className="space-y-2 rounded-xl border border-border p-3">
        <legend className="px-1 text-sm font-medium">Tipo de conta</legend>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted/60">
          <input
            type="radio"
            name="accountType"
            checked={isLeader}
            onChange={() => setIsLeader(true)}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-medium">Sou líder</span>
            <span className="text-xs text-muted-foreground">
              Posso publicar cultos e cadastrar minha igreja.
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted/60">
          <input
            type="radio"
            name="accountType"
            checked={!isLeader}
            onChange={() => setIsLeader(false)}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-medium">Sou membro</span>
            <span className="text-xs text-muted-foreground">
              Membros não precisam de conta — a agenda é pública.
            </span>
          </span>
        </label>
      </fieldset>

      {isLeader && (
        <div className="space-y-3 rounded-xl border border-teal-900/10 bg-teal-900/[0.03] p-3">
          <p className="text-sm font-medium text-teal-900">Sua igreja</p>
          <div className="space-y-2">
            <Label htmlFor="churchName">Nome da igreja</Label>
            <Input
              id="churchName"
              name="churchName"
              required={isLeader}
              placeholder="Ex.: Igreja Central"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="churchCity">Cidade</Label>
            <Input
              id="churchCity"
              name="churchCity"
              required={isLeader}
              placeholder="Ex.: Rio de Janeiro"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="churchAddress">Endereço</Label>
            <Input
              id="churchAddress"
              name="churchAddress"
              required={isLeader}
              placeholder="Ex.: Rua das Flores, 123"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="churchNeighborhood">Bairro</Label>
              <Input
                id="churchNeighborhood"
                name="churchNeighborhood"
                required={isLeader}
                placeholder="Ex.: Centro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="churchCep">CEP</Label>
              <Input
                id="churchCep"
                name="churchCep"
                required={isLeader}
                inputMode="numeric"
                placeholder="00000-000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Cor no calendário</Label>
            <div className="flex flex-wrap gap-2">
              {CHURCH_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="size-8 rounded-full border-2 transition"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "#0f172a" : "transparent",
                  }}
                  aria-label={`Cor ${c}`}
                />
              ))}
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-12 cursor-pointer p-1"
                aria-label="Escolher cor"
              />
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading || !isLeader}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {isLeader ? "Criar conta e igreja" : "Selecione “Sou líder”"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-teal-800 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
