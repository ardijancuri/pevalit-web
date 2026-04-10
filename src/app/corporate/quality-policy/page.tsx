import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { getLocalizedContent } from "@/lib/content";
import { getUiCopy } from "@/lib/localization";
import { getCurrentLanguage } from "@/lib/server-language";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const { corporate } = getLocalizedContent(language);

  return {
    title: corporate.qualityPolicy.title,
    description: corporate.qualityPolicy.intro
  };
}

export default async function QualityPolicyPage() {
  const language = await getCurrentLanguage();
  const { corporate } = getLocalizedContent(language);
  const ui = getUiCopy(language);

  return (
    <>
      <PageIntro
        eyebrow={ui.corporatePage.eyebrow}
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
