"use client";

import { useEffect } from "react";

/** Registers the service worker so the site can be installed as a home shortcut. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    if (window.location.hostname === "localhost") {
      // Still useful locally for testing install UX on some browsers
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Ignore — install button still shows manual instructions
    });
  }, []);

  return null;
}
