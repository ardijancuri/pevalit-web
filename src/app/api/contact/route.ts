import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import crypto from "node:crypto";
import { getUiCopy, resolveLanguage } from "@/lib/localization";

const requestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  phone: z.string().optional(),
  country: z.string().min(2),
  message: z.string().min(10),
  productSlug: z.string().optional(),
  language: z.string().optional(),
  captchaToken: z.string().optional(),
  website: z.string().optional(),
  startedAt: z.string().optional()
});

const resendKey = process.env.RESEND_API_KEY;
const hcaptchaSecret = process.env.HCAPTCHA_SECRET;
const recipient = process.env.CONTACT_TO_EMAIL || "sales@pevalit.com";
const sender = process.env.CONTACT_FROM_EMAIL || "PEVALIT <no-reply@pevalit.com>";
const autoReplyEnabled = process.env.CONTACT_AUTOREPLY_ENABLED === "true";

async function verifyHCaptcha(captchaToken?: string) {
  if (!hcaptchaSecret) return true;
  if (!captchaToken) return false;

  const result = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: hcaptchaSecret, response: captchaToken })
  });

  const payload = (await result.json()) as { success?: boolean };
  return Boolean(payload.success);
}

export async function POST(request: Request) {
  const body = await request.json();
  const language = resolveLanguage(typeof body?.language === "string" ? body.language : null);
  const copy = getUiCopy(language);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: copy.api.invalidFormData, fieldErrors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.website) {
    return NextResponse.json({ success: true, message: copy.api.requestSubmitted });
  }

  const startedAt = Number(data.startedAt ?? Date.now());
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2000) {
    return NextResponse.json({ success: false, message: copy.api.retryRequest }, { status: 429 });
  }

  const captchaValid = await verifyHCaptcha(data.captchaToken);
  if (!captchaValid) {
    return NextResponse.json({ success: false, message: copy.api.captchaFailed }, { status: 400 });
  }

  if (!resendKey) {
    return NextResponse.json(
      { success: false, message: copy.api.emailNotConfigured },
      { status: 500 }
    );
  }

  const resend = new Resend(resendKey);
  const requestId = `RQ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  await resend.emails.send({
    from: sender,
    to: recipient,
    subject: `Quote request ${requestId}${data.productSlug ? `: ${data.productSlug}` : ""}`,
    text: [
      `Request ID: ${requestId}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company}`,
      `Phone: ${data.phone || "-"}`,
      `Country: ${data.country}`,
      `Product: ${data.productSlug || "-"}`,
      "",
      "Message:",
      data.message
    ].join("\n")
  });

  if (autoReplyEnabled) {
    await resend.emails.send({
      from: sender,
      to: data.email,
      subject: `${copy.api.autoReplySubject} (${requestId})`,
      text: [
        `${copy.api.autoReplyGreeting} ${data.name},`,
        "",
        copy.api.autoReplyThanks,
        copy.api.autoReplyReceived,
        "",
        `${copy.api.autoReplyReference}: ${requestId}`,
        "",
        copy.api.autoReplySignature
      ].join("\n")
    });
  }

  return NextResponse.json({
    success: true,
    message: copy.quoteForm.success,
    requestId
  });
}
