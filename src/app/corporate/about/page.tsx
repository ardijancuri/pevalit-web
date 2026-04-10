import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { getLocalizedContent } from "@/lib/content";
import { getUiCopy } from "@/lib/localization";
import { getCurrentLanguage } from "@/lib/server-language";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const { corporate } = getLocalizedContent(language);

  return {
    title: corporate.about.title,
    description: corporate.about.intro
  };
}

export default async function AboutPage() {
  const language = await getCurrentLanguage();
  const { corporate } = getLocalizedContent(language);
  const ui = getUiCopy(language);

  return (
    <>
      <PageIntro eyebrow={ui.corporatePage.eyebrow} title={corporate.about.title} description={corporate.about.intro} />
      <section className="section-block section-muted pt-0">
        <div className="site-container columns-1 gap-4 md:columns-2">
          {corporate.about.sections.map((section) => (
            <article className="card mb-4 inline-block w-full break-inside-avoid p-6" key={section.heading}>
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
