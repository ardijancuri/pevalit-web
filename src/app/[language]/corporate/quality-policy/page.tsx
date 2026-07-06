import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { getLocalizedContent } from "@/lib/content";
import { getLanguageAlternates, getUiCopy, localizePath } from "@/lib/localization";
import { getRouteLanguage } from "@/lib/server-language";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language: languageParam } = await params;
  const language = getRouteLanguage(languageParam);
  const { corporate } = getLocalizedContent(language);

  return {
    title: corporate.qualityPolicy.title,
    description: corporate.qualityPolicy.intro,
    alternates: {
      canonical: localizePath("/corporate/quality-policy", language),
      languages: getLanguageAlternates("/corporate/quality-policy")
    }
  };
}

export default async function QualityPolicyPage({ params }: Props) {
  const { language: languageParam } = await params;
  const language = getRouteLanguage(languageParam);
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
