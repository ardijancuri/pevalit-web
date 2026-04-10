"use client";

import { FormEvent, useEffect, useState } from "react";
import { trackQuoteSubmit } from "@/lib/analytics";
import type { LanguageCode, UiCopy } from "@/lib/localization";

declare global {
  interface Window {
    hcaptcha?: {
      render: (
        container: string | HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; hl?: string }
      ) => void;
    };
  }
}

type QuoteFormProps = {
  language: LanguageCode;
  labels: UiCopy["quoteForm"];
  productSlug?: string;
};

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  requestId?: string;
};

const captchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

export function QuoteForm({ language, labels, productSlug }: QuoteFormProps) {
  const [captchaToken, setCaptchaToken] = useState("");
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle", message: "" });

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  useEffect(() => {
    if (!captchaSiteKey) return;

    const widget = document.getElementById("hcaptcha-widget");
    if (widget) {
      widget.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src = `https://js.hcaptcha.com/1/api.js?render=explicit&hl=${language}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.hcaptcha) {
        window.hcaptcha.render("#hcaptcha-widget", {
          sitekey: captchaSiteKey,
          callback: (token) => setCaptchaToken(token),
          hl: language
        });
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [language]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("captchaToken", captchaToken);
    formData.append("language", language);
    if (startedAt) {
      formData.append("startedAt", startedAt);
    }
    if (productSlug) {
      formData.append("productSlug", productSlug);
    }

    setSubmitState({ status: "submitting", message: labels.sendingRequest });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });

      let payload: { message?: string; requestId?: string } = {};
      try {
        payload = (await response.json()) as { message?: string; requestId?: string };
      } catch {
        payload = {};
      }

      if (response.ok) {
        event.currentTarget.reset();
        setCaptchaToken("");
        trackQuoteSubmit("success", productSlug);
        setSubmitState({
          status: "success",
          message: payload.message || labels.success,
          requestId: payload.requestId
        });
        return;
      }

      setSubmitState({
        status: "error",
        message: payload.message || labels.unableToSubmit
      });
      trackQuoteSubmit("error", productSlug);
    } catch {
      setSubmitState({
        status: "error",
        message: labels.networkError
      });
      trackQuoteSubmit("error", productSlug);
    }
  }

  return (
    <form className="card p-4 md:p-6" onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold">{labels.title}</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {labels.description}
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm text-[var(--muted)]">
          {labels.name}
          <input className="mt-1 w-full rounded-[8px] border border-[var(--line)] px-3 py-2" name="name" required />
        </label>
        <label className="text-sm text-[var(--muted)]">
          {labels.email}
          <input className="mt-1 w-full rounded-[8px] border border-[var(--line)] px-3 py-2" type="email" name="email" required />
        </label>
        <label className="text-sm text-[var(--muted)]">
          {labels.company}
          <input className="mt-1 w-full rounded-[8px] border border-[var(--line)] px-3 py-2" name="company" required />
        </label>
        <label className="text-sm text-[var(--muted)]">
          {labels.phone}
          <input className="mt-1 w-full rounded-[8px] border border-[var(--line)] px-3 py-2" name="phone" />
        </label>
        <label className="text-sm text-[var(--muted)] md:col-span-2">
          {labels.country}
          <input className="mt-1 w-full rounded-[8px] border border-[var(--line)] px-3 py-2" name="country" required />
        </label>
        <label className="text-sm text-[var(--muted)] md:col-span-2">
          {labels.message}
          <textarea className="mt-1 min-h-28 w-full rounded-[8px] border border-[var(--line)] px-3 py-2" name="message" required />
        </label>
      </div>

      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" name="website" aria-hidden="true" />

      {captchaSiteKey ? (
        <div className="mt-4" id="hcaptcha-widget" />
      ) : null}

      <button
        className="btn-primary mt-6 disabled:opacity-65"
        disabled={submitState.status === "submitting"}
        type="submit"
      >
        {submitState.status === "submitting" ? labels.submitting : labels.sendRequest}
      </button>
      {submitState.message ? (
        <p
          className={`mt-3 text-sm ${submitState.status === "success" ? "text-emerald-700" : "text-red-700"}`}
          role="status"
        >
          {submitState.message}
        </p>
      ) : null}
      {submitState.status === "success" ? (
        <div className="mt-3 rounded-[8px] bg-emerald-50 p-3 text-xs text-emerald-900">
          <p className="font-semibold">{labels.nextStepsTitle}</p>
          <p className="mt-1">{labels.nextStep1}</p>
          <p>{labels.nextStep2}</p>
          <p>{labels.nextStep3}</p>
          {submitState.requestId ? <p className="mt-1 font-medium">{labels.reference}: {submitState.requestId}</p> : null}
        </div>
      ) : null}
    </form>
  );
}
