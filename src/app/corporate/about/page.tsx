import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { corporate } from "@/lib/content";

export const metadata: Metadata = {
  title: "About | PEVALIT",
  description: corporate.about.intro
};

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="Corporate" title={corporate.about.title} description={corporate.about.intro} />
      <section className="site-container pb-6">
        <Image
          src={corporate.about.heroImage}
          alt={corporate.about.title}
          width={1200}
          height={700}
          className="mx-auto w-full max-w-2xl rounded-2xl border border-[var(--line)] object-cover"
          loading="lazy"
        />
      </section>
      <section className="site-container grid gap-4 pb-20 md:grid-cols-2">
        {corporate.about.sections.map((section) => (
          <article className="card p-6" key={section.heading}>
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">{section.body}</p>
          </article>
        ))}
      </section>
    </>
  );
}
