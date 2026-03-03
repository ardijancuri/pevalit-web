import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { siteData } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pevalit.com"),
  title: {
    default: `${siteData.companyName} | Additives and Compounds`,
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
    title: `${siteData.companyName} | Additives and Compounds`,
    description: siteData.description,
    type: "website",
    url: "/",
    siteName: siteData.companyName,
    locale: "en_US",
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
    title: `${siteData.companyName} | Additives and Compounds`,
    description: siteData.description,
    images: [socialImage]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteData.companyName,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://pevalit.com",
    email: siteData.contact.email,
    telephone: siteData.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteData.contact.address
    }
  };

  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
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
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
