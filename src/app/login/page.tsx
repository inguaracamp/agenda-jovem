import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { LoginSignupLinks } from "@/components/login-signup-links";

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
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">Carregando...</p>
          }
        >
          <LoginForm />
        </Suspense>
        <Suspense fallback={null}>
          <LoginSignupLinks />
        </Suspense>
      </div>
    </div>
  );
}
