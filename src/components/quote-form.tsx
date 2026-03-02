"use client";

import { FormEvent, useEffect, useState } from "react";

declare global {
  interface Window {
    hcaptcha?: {
      render: (container: string | HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => void;
    };
  }
}

type QuoteFormProps = {
  productSlug?: string;
};

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const captchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

export function QuoteForm({ productSlug }: QuoteFormProps) {
  const [captchaToken, setCaptchaToken] = useState("");
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle", message: "" });

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  useEffect(() => {
    if (!captchaSiteKey) return;

    const script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.hcaptcha) {
        window.hcaptcha.render("#hcaptcha-widget", {
          sitekey: captchaSiteKey,
          callback: (token) => setCaptchaToken(token)
        });
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("captchaToken", captchaToken);
    if (startedAt) {
      formData.append("startedAt", startedAt);
    }
    if (productSlug) {
      formData.append("productSlug", productSlug);
    }

    setSubmitState({ status: "submitting", message: "Sending your request..." });

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    const payload = (await response.json()) as { message: string };
    if (response.ok) {
      event.currentTarget.reset();
      setCaptchaToken("");
      setSubmitState({ status: "success", message: payload.message });
      return;
    }

    setSubmitState({ status: "error", message: payload.message || "Unable to submit your request right now." });
  }

  return (
    <form className="card p-6" onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold">Request a Quote</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Share your application details and our team will respond with the best-fit recommendation.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm text-[var(--muted)]">
          Name
          <input className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2" name="name" required />
        </label>
        <label className="text-sm text-[var(--muted)]">
          Email
          <input className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2" type="email" name="email" required />
        </label>
        <label className="text-sm text-[var(--muted)]">
          Company
          <input className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2" name="company" required />
        </label>
        <label className="text-sm text-[var(--muted)]">
          Phone
          <input className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2" name="phone" />
        </label>
        <label className="text-sm text-[var(--muted)] md:col-span-2">
          Country
          <input className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2" name="country" required />
        </label>
        <label className="text-sm text-[var(--muted)] md:col-span-2">
          Message
          <textarea className="mt-1 min-h-28 w-full rounded-lg border border-[var(--line)] px-3 py-2" name="message" required />
        </label>
      </div>

      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" name="website" aria-hidden="true" />

      {captchaSiteKey ? (
        <div className="mt-4" id="hcaptcha-widget" />
      ) : (
        <p className="mt-4 text-xs text-[var(--muted)]">
          hCaptcha site key is not configured. Set `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` for spam protection.
        </p>
      )}

      <button
        className="mt-6 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-strong)] disabled:opacity-65"
        disabled={submitState.status === "submitting"}
        type="submit"
      >
        {submitState.status === "submitting" ? "Submitting..." : "Send Request"}
      </button>
      {submitState.message ? (
        <p
          className={`mt-3 text-sm ${submitState.status === "success" ? "text-emerald-700" : "text-red-700"}`}
          role="status"
        >
          {submitState.message}
        </p>
      ) : null}
    </form>
  );
}
