import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { CalendarDays, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Calendário" },
  { href: "/eventos", label: "Eventos" },
  { href: "/igrejas", label: "Igrejas" },
  { href: "/assinar", label: "Assinar agenda" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-heading text-lg font-semibold tracking-tight text-foreground">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <CalendarDays className="size-5" />
          </span>
          <span>
            Agenda<span className="text-primary">Jovem</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            {session?.user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/painel">Painel</Link>
                </Button>
                {session.user.role === "ADMIN" && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button type="submit" variant="outline" size="sm">
                    Sair
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/cadastro">Criar conta</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/login">Entrar</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-lg border border-input bg-background md:hidden"
              aria-label="Menu"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-4">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-3 h-px bg-border" />
                {session?.user ? (
                  <>
                    <Link href="/painel" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                      Painel
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link href="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                        Admin
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link href="/cadastro" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                      Criar conta
                    </Link>
                    <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                      Entrar
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
