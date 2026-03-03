import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pevalit.com"),
  title: `${siteData.companyName} | Additives and Compounds`,
  description: siteData.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteData.companyName} | Additives and Compounds`,
    description: siteData.description,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteData.companyName} | Additives and Compounds`,
    description: siteData.description
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
