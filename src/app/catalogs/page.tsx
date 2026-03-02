import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { catalogs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catalogs | PEVALIT",
  description: "Browse PEVALIT catalogs with inline preview and direct download links."
};

export default function CatalogsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Catalogs"
        title="Technical catalogs with quick preview and direct download."
        description="Review portfolio documents without leaving the page, then download the latest PDF version."
      />
      <section className="site-container grid gap-6 pb-20">
        {catalogs.map((catalog) => (
          <article className="card overflow-hidden" key={catalog.slug}>
            <div className="grid gap-4 p-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
              <div>
                <h2 className="text-xl font-semibold">{catalog.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{catalog.description}</p>
                <Link
                  href={catalog.fileUrl}
                  className="mt-4 inline-block rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-strong)]"
                >
                  Download PDF
                </Link>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white p-2">
                <iframe title={`${catalog.title} preview`} src={catalog.fileUrl} className="h-60 w-full rounded-lg" />
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
