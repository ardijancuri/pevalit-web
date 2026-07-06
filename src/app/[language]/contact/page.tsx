import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { QuoteForm } from "@/components/quote-form";
import { getLocalizedContent } from "@/lib/content";
import { getLanguageAlternates, getUiCopy, localizePath } from "@/lib/localization";
import { getRouteLanguage } from "@/lib/server-language";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language: languageParam } = await params;
  const language = getRouteLanguage(languageParam);
  const ui = getUiCopy(language);

  return {
    title: ui.contactPage.eyebrow,
    description: ui.contactPage.description,
    alternates: {
      canonical: localizePath("/contact", language),
      languages: getLanguageAlternates("/contact")
    }
  };
}

export default async function ContactPage({ params }: Props) {
  const { language: languageParam } = await params;
  const language = getRouteLanguage(languageParam);
  const { siteData } = getLocalizedContent(language);
  const ui = getUiCopy(language);

  return (
    <>
      <PageIntro
        eyebrow={ui.contactPage.eyebrow}
        title={ui.contactPage.title}
        description={ui.contactPage.description}
      />
      <section className="section-block bg-white">
        <div className="site-container grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <QuoteForm key={language} language={language} labels={ui.quoteForm} />
          <aside className="card p-4 md:p-6">
            <h2 className="text-xl font-semibold">{ui.contactPage.directContact}</h2>
            <p className="mt-4 text-sm text-[var(--muted)]">{ui.contactPage.email}</p>
            <p className="text-sm font-medium">
              <a href={`mailto:${siteData.contact.email}`} className="hover:text-[var(--brand)]">
                {siteData.contact.email}
              </a>
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">{ui.contactPage.phone}</p>
            <p className="text-sm font-medium">
              <a href={`tel:${siteData.contact.phone.replace(/\s+/g, "")}`} className="hover:text-[var(--brand)]">
                {siteData.contact.phone}
              </a>
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">{ui.contactPage.fax}</p>
            <p className="text-sm font-medium">{siteData.contact.fax}</p>
            <p className="mt-4 text-sm text-[var(--muted)]">{ui.contactPage.address}</p>
            <p className="text-sm font-medium">{siteData.contact.address}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
