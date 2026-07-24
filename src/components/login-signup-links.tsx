"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function LoginSignupLinks() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/painel";
  const signupHref = `/cadastro?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <p className="mt-4 text-center text-sm text-muted-foreground">
      Ainda não tem conta?{" "}
      <Link
        href={signupHref}
        className="font-medium text-teal-800 hover:underline"
      >
        Criar conta
      </Link>
    </p>
  );
}
