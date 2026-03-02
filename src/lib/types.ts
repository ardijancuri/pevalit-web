import { z } from "zod";

export const navItemSchema = z.object({
  label: z.string(),
  href: z.string()
});

export const siteSchema = z.object({
  companyName: z.string(),
  tagline: z.string(),
  description: z.string(),
  primaryCta: z.object({ label: z.string(), href: z.string() }),
  secondaryCta: z.object({ label: z.string(), href: z.string() }),
  contact: z.object({ email: z.string().email(), phone: z.string(), address: z.string() }),
  navigation: z.array(navItemSchema),
  footerLinks: z.array(navItemSchema)
});

export const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  heroImage: z.string()
});

export const productSchema = z.object({
  slug: z.string(),
  name: z.string(),
  categorySlug: z.string(),
  summary: z.string(),
  applications: z.array(z.string()),
  benefits: z.array(z.string()),
  technicalSpecs: z.array(z.object({ label: z.string(), value: z.string() })),
  documents: z.array(z.object({ title: z.string(), url: z.string() })),
  seo: z.object({ title: z.string(), description: z.string() })
});

export const catalogSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  fileUrl: z.string(),
  previewImage: z.string()
});

export const corporateSchema = z.object({
  about: z.object({
    title: z.string(),
    intro: z.string(),
    sections: z.array(z.object({ heading: z.string(), body: z.string() }))
  }),
  qualityPolicy: z.object({
    title: z.string(),
    intro: z.string(),
    points: z.array(z.string())
  })
});

export type SiteData = z.infer<typeof siteSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
export type Corporate = z.infer<typeof corporateSchema>;