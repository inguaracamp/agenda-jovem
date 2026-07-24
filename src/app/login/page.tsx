import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Área do líder
        </h1>
        <p className="text-muted-foreground">
          Entre para publicar e editar cultos da sua igreja.
        </p>
      </div>
      <div className="rounded-2xl border bg-white/80 p-6 shadow-sm">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando...</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-teal-800 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
