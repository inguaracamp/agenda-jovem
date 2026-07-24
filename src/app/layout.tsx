import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AgendaJovem — Rede de Cultos",
    template: "%s · AgendaJovem",
  },
  description:
    "Calendário compartilhado de cultos e eventos da rede de grupos de jovens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Providers>
          <div className="relative flex min-h-full flex-1 flex-col">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_#0f766e14,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_#b4530910,_transparent_45%),linear-gradient(180deg,#f7f5f0_0%,#eef6f4_100%)]"
            />
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
              {children}
            </main>
            <footer className="border-t border-border/60 py-6 text-center text-sm text-muted-foreground">
              AgendaJovem — um só lugar para a agenda da rede
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
