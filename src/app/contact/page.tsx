import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { QuoteForm } from "@/components/quote-form";
import { siteData } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact | PEVALIT",
  description: "Contact PEVALIT for technical assistance, product recommendations, and quotation requests."
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Talk to our team about your production requirements."
        description="Use the form to send your request and include your application details for a faster technical response."
      />
      <section className="site-container grid gap-8 pb-20 lg:grid-cols-[1.2fr_1fr]">
        <QuoteForm />
        <aside className="card p-6">
          <h2 className="text-xl font-semibold">Direct Contact</h2>
          <p className="mt-4 text-sm text-[var(--muted)]">Email</p>
          <p className="text-sm font-medium">{siteData.contact.email}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">Phone</p>
          <p className="text-sm font-medium">{siteData.contact.phone}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">Address</p>
          <p className="text-sm font-medium">{siteData.contact.address}</p>
          <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--accent)] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Response Promise</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Technical response within one business day for complete quote requests.</p>
          </div>
        </aside>
      </section>
    </>
  );
}
