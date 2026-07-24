export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6"
      role="status"
      aria-live="polite"
      aria-label="Carregando AgendaJovem"
    >
      <div className="relative flex size-16 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-teal-800/15 animate-ping"
          style={{ animationDuration: "1.4s" }}
        />
        <span className="relative flex size-14 items-center justify-center rounded-2xl bg-teal-800 text-teal-50 shadow-lg shadow-teal-900/20">
          <svg
            viewBox="0 0 24 24"
            className="size-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
      </div>

      <div className="space-y-2 text-center">
        <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Agenda<span className="text-teal-800">Jovem</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Preparando a agenda da rede…
        </p>
      </div>

      <div
        aria-hidden
        className="h-1 w-40 overflow-hidden rounded-full bg-teal-900/10"
      >
        <div className="h-full w-1/2 animate-[aj-slide_1.1s_ease-in-out_infinite] rounded-full bg-teal-800" />
      </div>

      <style>{`
        @keyframes aj-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
