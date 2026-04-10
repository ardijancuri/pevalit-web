import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getLocalizedContent } from "@/lib/content";
import { getUiCopy, OPEN_GRAPH_LOCALE } from "@/lib/localization";
import { getCurrentLanguage } from "@/lib/server-language";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const socialImage = "/images/og/pevalit-og.jpg";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const { siteData } = getLocalizedContent(language);
  const ui = getUiCopy(language);
  const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pevalit.com");
  const defaultTitle = `${siteData.companyName} | ${ui.metadata.defaultTitleSuffix}`;

  return {
    metadataBase: baseUrl,
    title: {
      default: defaultTitle,
      template: `%s | ${siteData.companyName}`
    },
    description: siteData.description,
    keywords: [
      "polymer additives",
      "construction chemistry",
      "tile adhesive additives",
      "drymix mortar",
      "technical compounds",
      "PEVALIT"
    ],
    authors: [{ name: siteData.companyName }],
    creator: siteData.companyName,
    publisher: siteData.companyName,
    alternates: { canonical: "/" },
    robots: {
      index: true,
      follow: true
    },
    icons: {
      icon: "/images/imported/favicon-pevalit.png",
      shortcut: "/images/imported/favicon-pevalit.png",
      apple: "/images/imported/favicon-pevalit.png"
    },
    openGraph: {
      title: defaultTitle,
      description: siteData.description,
      type: "website",
      url: "/",
      siteName: siteData.companyName,
      locale: OPEN_GRAPH_LOCALE[language],
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: `${siteData.companyName} social cover`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: siteData.description,
      images: [socialImage]
    }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const language = await getCurrentLanguage();
  const content = getLocalizedContent(language);
  const ui = getUiCopy(language);
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: content.siteData.companyName,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://pevalit.com",
    email: content.siteData.contact.email,
    telephone: content.siteData.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.siteData.contact.address
    }
  };

  return (
    <html lang={language} className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body suppressHydrationWarning style={{ fontFamily: "var(--font-body), sans-serif" }}>
        {gaId ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" /> : null}
        {gaId ? (
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
        <SiteHeader
          companyName={content.siteData.companyName}
          navigation={content.siteData.navigation}
          productsByCategory={content.productsByCategory}
          initialLanguage={language}
          labels={ui.languageSwitcher}
        />
        <main>{children}</main>
        <SiteFooter siteData={content.siteData} language={language} labels={ui.footer} />
      </body>
    </html>
  );
}
