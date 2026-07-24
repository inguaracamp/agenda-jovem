import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import { AppPreloader } from "@/components/app-preloader";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://agendas-jovens.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AgendaJovem — todos os cultos da rede num só lugar",
    template: "%s · AgendaJovem",
  },
  description:
    "Chega de perder culto no grupo. Veja datas, locais e cartazes da rede de jovens — e assine a agenda direto no celular.",
  applicationName: "AgendaJovem",
  keywords: [
    "agenda jovem",
    "cultos",
    "grupos de jovens",
    "calendário de igrejas",
    "eventos cristãos",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "AgendaJovem",
    title: "AgendaJovem — todos os cultos da rede num só lugar",
    description:
      "Chega de perder culto no grupo. Veja datas, locais e cartazes da rede de jovens — e assine a agenda direto no celular.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgendaJovem — todos os cultos da rede num só lugar",
    description:
      "Chega de perder culto no grupo. Veja datas, locais e cartazes da rede de jovens — e assine a agenda direto no celular.",
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgendaJovem",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
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
          <ServiceWorkerRegister />
          <AppPreloader />
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
