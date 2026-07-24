import { Suspense } from "react";
import { RegisterForm } from "@/components/register-form";

export const metadata = { title: "Criar conta" };

export default function CadastroPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Criar conta
        </h1>
        <p className="text-muted-foreground">
          Cadastre-se como líder e adicione a igreja da sua rede.
        </p>
      </div>
      <div className="rounded-2xl border bg-white/80 p-6 shadow-sm">
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">Carregando...</p>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
