import { CopyFeedButton } from "@/components/copy-feed-button";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/app-url";
import { Rss, Smartphone } from "lucide-react";

export const metadata = { title: "Assinar agenda" };
export const dynamic = "force-dynamic";

export default async function AssinarPage() {
  const appUrl = await getAppUrl();
  const httpsFeed = `${appUrl}/api/calendar.ics`;
  const webcalFeed = httpsFeed.replace(/^https?:/, "webcal:");
  const isLocal =
    appUrl.includes("localhost") || appUrl.includes("127.0.0.1");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-teal-800/70">
          <Rss className="size-4" />
          Assinatura
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Assine uma vez. Todos os cultos entram sozinhos.
        </h1>
        <p className="text-muted-foreground">
          Cole o link abaixo no Google Agenda, Apple Calendar ou Outlook. Quando
          um líder publicar um culto novo, ele aparece automaticamente na sua
          agenda.
        </p>
      </div>

      {isLocal && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Em localhost o Google Agenda <strong>não consegue</strong> assinar o
          feed (os servidores do Google não alcançam o seu PC). Use o botão
          Apple no mesmo aparelho, ou publique o site e atualize{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_APP_URL</code>{" "}
          com a URL pública.
        </p>
      )}

      <div className="space-y-3 rounded-2xl border bg-white/80 p-5">
        <p className="text-sm font-medium">Link do calendário</p>
        <code className="block overflow-x-auto rounded-xl bg-muted px-3 py-3 text-sm">
          {httpsFeed}
        </code>
        <div className="flex flex-wrap gap-2">
          <CopyFeedButton value={httpsFeed} />
          <Button asChild variant="outline">
            <a href={webcalFeed}>
              <Smartphone className="size-4" />
              Abrir no Apple Calendar
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={httpsFeed} target="_blank" rel="noreferrer">
              Baixar .ics
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">
            Google Agenda
          </h2>
          <p className="mt-1">
            Configurações → Adicionar calendário → De URL → cole o link acima.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">
            Apple Calendar (iPhone)
          </h2>
          <p className="mt-1">
            Ajustes → Calendário → Contas → Adicionar → Outra → Assinatura de
            calendário → use o botão &quot;Abrir no Apple Calendar&quot; ou cole o
            link com <code>webcal://</code>.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">
            Outlook
          </h2>
          <p className="mt-1">
            Adicionar calendário → Assinar da Web → cole o link HTTPS.
          </p>
        </div>
      </div>
    </div>
  );
}
