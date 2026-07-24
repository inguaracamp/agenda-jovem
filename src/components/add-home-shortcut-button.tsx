"use client";

import { useEffect, useState } from "react";
import { Home, Share, Smartphone } from "lucide-react";
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

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Props = {
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
};

function isIos() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export function AddHomeShortcutButton({
  className,
  size = "default",
  variant = "outline",
}: Props) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIos(isIos());
    setInstalled(isStandalone());

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function installNative() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  const label = "Atalho na tela";

  if (deferred) {
    return (
      <Button
        type="button"
        size={size}
        variant={variant}
        className={cn(className)}
        onClick={installNative}
      >
        <Home className="size-4" />
        {label}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size={size} variant={variant} className={cn(className)} />
        }
      >
        <Home className="size-4" />
        {label}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar atalho na tela</DialogTitle>
          <DialogDescription>
            Coloque o AgendaJovem na tela inicial do celular. O ícone abre o
            site direto, como um app.
          </DialogDescription>
        </DialogHeader>

        {ios ? (
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-800/10 text-teal-900">
                <Share className="size-3.5" />
              </span>
              <span>
                Toque em <strong className="text-foreground">Compartilhar</strong>{" "}
                (ícone de quadrado com seta) na barra do Safari.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-800/10 text-teal-900">
                <Home className="size-3.5" />
              </span>
              <span>
                Role e escolha{" "}
                <strong className="text-foreground">Adicionar à Tela de Início</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-800/10 text-teal-900">
                <Smartphone className="size-3.5" />
              </span>
              <span>
                Confirme em <strong className="text-foreground">Adicionar</strong>.
                Pronto — o atalho abre a agenda.
              </span>
            </li>
          </ol>
        ) : (
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-800/10 font-medium text-teal-900">
                1
              </span>
              <span>
                Abra o menu do navegador{" "}
                <strong className="text-foreground">(⋮ ou ⋯)</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-800/10 font-medium text-teal-900">
                2
              </span>
              <span>
                Toque em{" "}
                <strong className="text-foreground">
                  Adicionar à tela inicial
                </strong>{" "}
                / <strong className="text-foreground">Instalar app</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-800/10 font-medium text-teal-900">
                3
              </span>
              <span>
                Confirme — o ícone AgendaJovem abre o site.
              </span>
            </li>
          </ol>
        )}

        <DialogFooter>
          <Button type="button" onClick={() => setOpen(false)}>
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
