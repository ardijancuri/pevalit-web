import type { LanguageCode } from "@/lib/localization";

type SeoConfig = {
  title: string;
  description: string;
  keywords: string[];
};

const SEO_BY_LANGUAGE: Record<LanguageCode, SeoConfig> = {
  en: {
    title: "PEVALIT | Construction Products and Technical Systems",
    description:
      "PEVALIT supplies construction products including tile adhesives, facade adhesives, plasters, paints, grouts, waterproofing systems, EPS boards, sealants, and technical product documentation.",
    keywords: [
      "PEVALIT",
      "construction products",
      "technical systems",
      "tile adhesives",
      "facade adhesives",
      "decorative plasters",
      "waterproofing systems",
      "EPS boards",
      "grouts",
      "sealants"
    ]
  },
  sq: {
    title: "PEVALIT | Produkte Ndertimi dhe Sisteme Teknike",
    description:
      "PEVALIT furnizon produkte ndertimi si ngjites per pllaka, ngjites fasade, suva, bojera, fuga, sisteme hidroizolimi, pllaka EPS, silikone dhe dokumentacion teknik per produkte.",
    keywords: [
      "PEVALIT",
      "produkte ndertimi",
      "sisteme teknike",
      "ngjites per pllaka",
      "ngjites fasade",
      "suva dekorative",
      "hidroizolim",
      "pllaka EPS",
      "fuga",
      "silikone"
    ]
  },
  mk: {
    title: "PEVALIT | Gradezni Proizvodi i Tehnicki Sistemi",
    description:
      "PEVALIT snabduva gradezni proizvodi kako lepila za plocki, fasadni lepila, malteri, boi, fugi, sistemi za hidroizolacija, EPS ploci, silikoni i tehnicka dokumentacija za proizvodi.",
    keywords: [
      "PEVALIT",
      "gradezni proizvodi",
      "tehnicki sistemi",
      "lepila za plocki",
      "fasadni lepila",
      "dekorativni malteri",
      "hidroizolacija",
      "EPS ploci",
      "fugi",
      "silikoni"
    ]
  },
  de: {
    title: "PEVALIT | Bauprodukte und Technische Systeme",
    description:
      "PEVALIT liefert Bauprodukte wie Fliesenkleber, Fassadenkleber, Putze, Farben, Fugenmassen, Abdichtungssysteme, EPS-Platten, Dichtstoffe und technische Produktdokumentation.",
    keywords: [
      "PEVALIT",
      "Bauprodukte",
      "technische Systeme",
      "Fliesenkleber",
      "Fassadenkleber",
      "Dekorputz",
      "Abdichtungssysteme",
      "EPS Platten",
      "Fugenmassen",
      "Dichtstoffe"
    ]
  }
};

export function getSeoConfig(language: LanguageCode) {
  return SEO_BY_LANGUAGE[language];
}
