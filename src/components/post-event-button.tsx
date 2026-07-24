"use client";

import Link from "next/link";
import { PlusCircle, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const POST_PATH = "/painel/novo";
const loginHref = `/login?callbackUrl=${encodeURIComponent(POST_PATH)}`;
const signupHref = `/cadastro?callbackUrl=${encodeURIComponent(POST_PATH)}`;

type Props = {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  iconOnly?: boolean;
  /** Se false, abre diálogo pedindo login ou criar conta */
  authenticated?: boolean;
};

export function PostEventButton({
  className,
  size = "default",
  label = "Postar evento",
  iconOnly = false,
  authenticated = false,
}: Props) {
  if (authenticated) {
    return (
      <Button
        asChild
        size={iconOnly ? "icon" : size}
        className={cn(className)}
        title={iconOnly ? label : undefined}
        aria-label={iconOnly ? label : undefined}
      >
        <Link href={POST_PATH}>
          <PlusCircle className={iconOnly ? "size-5" : "size-4"} />
          {!iconOnly && label}
        </Link>
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            size={iconOnly ? "icon" : size}
            className={cn(className)}
            title={iconOnly ? label : undefined}
            aria-label={iconOnly ? label : undefined}
          />
        }
      >
        <PlusCircle className={iconOnly ? "size-5" : "size-4"} />
        {!iconOnly && label}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publique o próximo culto</DialogTitle>
          <DialogDescription>
            Para postar um evento você precisa estar logado como líder. Entre na
            sua conta ou crie uma agora — leva só um minuto.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-stretch">
          <Button asChild variant="outline" className="sm:flex-1">
            <Link href={signupHref}>
              <UserPlus className="size-4" />
              Criar conta
            </Link>
          </Button>
          <Button asChild className="sm:flex-1">
            <Link href={loginHref}>
              <LogIn className="size-4" />
              Entrar
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
