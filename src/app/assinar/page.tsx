import { CopyFeedButton } from "@/components/copy-feed-button";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/app-url";
import {
  outlookOfficeSubscribeUrl,
  outlookSubscribeUrl,
} from "@/lib/ics";
import { CalendarPlus, Rss, Smartphone } from "lucide-react";

export const metadata = { title: "Assinar agenda" };
export const dynamic = "force-dynamic";

export default async function AssinarPage() {
  const appUrl = await getAppUrl();
  const httpsFeed = `${appUrl}/api/calendar.ics`;
  const webcalFeed = httpsFeed.replace(/^https?:/, "webcal:");
  const outlookPersonal = outlookSubscribeUrl(httpsFeed);
  const outlookWork = outlookOfficeSubscribeUrl(httpsFeed);
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
          Em localhost o Outlook/Google <strong>não conseguem</strong> assinar o
          feed (os servidores deles não alcançam o seu PC). Use a URL de
          produção na Vercel.
        </p>
      )}

      <div className="space-y-3 rounded-2xl border bg-white/80 p-5">
        <p className="text-sm font-medium">Link do calendário</p>
        <code className="block overflow-x-auto rounded-xl bg-muted px-3 py-3 text-sm break-all">
          {httpsFeed}
        </code>
        <div className="flex flex-wrap gap-2">
          <CopyFeedButton value={httpsFeed} />
          <Button asChild variant="outline">
            <a href={httpsFeed} target="_blank" rel="noreferrer">
              Baixar / abrir .ics
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border bg-white/80 p-5">
        <p className="text-sm font-medium">Abrir direto no app</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <a href={outlookPersonal} target="_blank" rel="noreferrer">
              <CalendarPlus className="size-4" />
              Outlook (pessoal)
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={outlookWork} target="_blank" rel="noreferrer">
              <CalendarPlus className="size-4" />
              Outlook (trabalho/escola)
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={webcalFeed}>
              <Smartphone className="size-4" />
              Apple Calendar
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">
            Outlook (passo a passo)
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              Clique em <strong>Outlook (pessoal)</strong> ou{" "}
              <strong>trabalho/escola</strong> acima, ou
            </li>
            <li>
              No Outlook web: <em>Adicionar calendário</em> →{" "}
              <em>Assinar da web</em>
            </li>
            <li>Cole o link HTTPS do calendário e salve</li>
          </ol>
          <p className="mt-2">
            No app Outlook do Windows: Arquivo → Conta → Calendários de
            internet → Novo → cole o link.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">
            Google Agenda
          </h2>
          <p className="mt-1">
            Configurações → Adicionar calendário → De URL → cole o link HTTPS.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">
            Apple Calendar (iPhone)
          </h2>
          <p className="mt-1">
            Use o botão Apple Calendar, ou: Ajustes → Calendário → Contas →
            Adicionar → Outra → Assinatura de calendário.
          </p>
        </div>
      </div>
    </div>
  );
}
