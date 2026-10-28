"use client";

import { useSyncExternalStore } from "react";

// Cookie consent for optional cookies (Klaviyo tracking). The basket cookie is
// strictly necessary and doesn't wait for this.

export type Consent = "accepted" | "rejected" | null;

const KEY = "crosps_consent";
const EVENT = "crosps-consent";

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: Exclude<Consent, null>) {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// "unknown" during server render, so nothing flashes before we can read storage.
export function useConsent(): Consent | "unknown" {
  return useSyncExternalStore(subscribe, read, () => "unknown");
}
