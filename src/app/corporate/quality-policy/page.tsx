import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { corporate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Quality Policy | PEVALIT",
  description: corporate.qualityPolicy.intro
};

export default function QualityPolicyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Corporate"
        title={corporate.qualityPolicy.title}
        description={corporate.qualityPolicy.intro}
      />
      <section className="section-block bg-white">
        <div className="site-container">
          <article className="card p-6">
            <ul className="list-disc space-y-3 pl-5 text-sm text-[var(--muted)]">
              {corporate.qualityPolicy.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}
