"use client";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

type EventPayload = {
  event: string;
  [key: string]: unknown;
};

function pushDataLayerEvent(payload: EventPayload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function trackCtaClick(label: string, location: string) {
  pushDataLayerEvent({
    event: "cta_click",
    label,
    location
  });
}

export function trackQuoteSubmit(status: "success" | "error", productSlug?: string) {
  pushDataLayerEvent({
    event: "quote_submit",
    status,
    productSlug: productSlug || null
  });
}

