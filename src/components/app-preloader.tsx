"use client";

import { useEffect, useState } from "react";

/** Splash curto no primeiro carregamento da sessão (pré-visualização no celular). */
export function AppPreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("aj-preloaded") === "1") {
      setVisible(false);
      return;
    }

    const minMs = 700;
    const started = performance.now();

    const finish = () => {
      const wait = Math.max(0, minMs - (performance.now() - started));
      window.setTimeout(() => {
        setLeaving(true);
        window.setTimeout(() => {
          sessionStorage.setItem("aj-preloaded", "1");
          setVisible(false);
        }, 320);
      }, wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => window.removeEventListener("load", finish);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[linear-gradient(165deg,#f7f5f0_0%,#e8f5f2_55%,#f3ebe0_100%)] transition-opacity duration-300 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={leaving}
      role="status"
      aria-label="Carregando AgendaJovem"
    >
      <div className="relative mb-6 flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-3xl bg-teal-800/20" />
        <span className="relative flex size-16 items-center justify-center rounded-3xl bg-teal-800 text-teal-50 shadow-xl shadow-teal-900/25">
          <svg
            viewBox="0 0 24 24"
            className="size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
      </div>
      <p className="font-heading text-3xl font-semibold tracking-tight text-foreground">
        Agenda<span className="text-teal-800">Jovem</span>
      </p>
      <p className="mt-2 text-sm text-teal-900/60">
        A agenda da rede, num só lugar
      </p>
    </div>
  );
}
