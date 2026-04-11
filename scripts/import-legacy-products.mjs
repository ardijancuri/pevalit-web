import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public", "images", "imported");
const PUBLIC_PDFS_DIR = path.join(ROOT, "public", "catalogs", "imported");
const PRODUCT_INDEX_URL = "https://pevalit.com/wp-json/wp/v2/product?per_page=100";
const PRODUCT_CATEGORY_URL = "https://pevalit.com/wp-json/wp/v2/product_category?per_page=100";
const USER_AGENT = "Mozilla/5.0 (compatible; Codex Legacy Product Import)";

const LANGUAGES = [
  { code: "en", prefix: "", applicationHeading: "Application", technicalHeading: "Technical Parameters" },
  { code: "sq", prefix: "/sq", applicationHeading: "Aplikimi", technicalHeading: "Parametrat teknik" },
  {
    code: "mk",
    prefix: "/mk",
    applicationHeading: "\u0410\u043f\u043b\u0438\u043a\u0430\u0446\u0438\u0458\u0430",
    technicalHeading: "\u0422\u0435\u0445\u043d\u0438\u0447\u043a\u0438 \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0438"
  },
  { code: "de", prefix: "/de", applicationHeading: "Anwendung", technicalHeading: "Technische Daten" }
];

const CATEGORY_ENTRY_BY_LANGUAGE = {
  en: {
    slug: "self-leveling-compounds",
    name: "Self Leveling Compounds",
    description: "Self Leveling Compounds product range.",
    heroImage: "/images/imported/29.jpg"
  },
  sq: {
    slug: "self-leveling-compounds",
    name: "Masa Vet\u00ebniveluese",
    description: "Gama e produkteve t\u00eb masave vet\u00ebniveluese.",
    heroImage: "/images/imported/29.jpg"
  },
  mk: {
    slug: "self-leveling-compounds",
    name: "\u0421\u0430\u043c\u043e\u043d\u0438\u0432\u0435\u043b\u0438\u0440\u0430\u0447\u043a\u0438 \u043c\u0430\u0441\u0438",
    description: "\u041f\u0430\u043b\u0435\u0442\u0430 \u043d\u0430 \u0441\u0430\u043c\u043e\u043d\u0438\u0432\u0435\u043b\u0438\u0440\u0430\u0447\u043a\u0438 \u043c\u0430\u0441\u0438.",
    heroImage: "/images/imported/29.jpg"
  },
  de: {
    slug: "self-leveling-compounds",
    name: "Selbstverlaufsmassen",
    description: "Produktreihe der Selbstverlaufsmassen.",
    heroImage: "/images/imported/29.jpg"
  }
};

const SECTION_HEADINGS = new Set(
  LANGUAGES.flatMap((language) => [language.applicationHeading.toLowerCase(), language.technicalHeading.toLowerCase()])
);

const SECTION_STOP_LINES = new Set([
  "image",
  "home",
  "startseite",
  "products",
  "produkte",
  "catalogs",
  "kataloge",
  "corporate",
  "unternehmen",
  "contact",
  "kontakt",
  "english",
  "albanian",
  "macedonian",
  "german"
]);

function repairMojibake(input) {
  if (!/[\u00c3\u00c2\u00d0\u00d1\u00e2]/.test(input)) {
    return input;
  }

  try {
    const repaired = Buffer.from(input, "latin1").toString("utf8");
    const originalNoise = (input.match(/[\u00c3\u00c2\u00d0\u00d1\u00e2][^\s]*/g) ?? []).length;
    const repairedNoise = (repaired.match(/[\u00c3\u00c2\u00d0\u00d1\u00e2][^\s]*/g) ?? []).length;
    return repairedNoise < originalNoise ? repaired : input;
  } catch {
    return input;
  }
}

function decodeHtmlEntities(input) {
  return repairMojibake(
    input
      .replace(/&#038;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
      .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  );
}

function htmlFragmentToText(fragment) {
  return decodeHtmlEntities(fragment)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function normalizeText(text) {
  return repairMojibake(decodeHtmlEntities(text))
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+\./g, ".")
    .replace(/\s+,/g, ",")
    .trim();
}

function getPageLines(html) {
  return htmlFragmentToText(html)
    .split("\n")
    .map((line) => normalizeText(line))
    .filter(Boolean);
}

function getSectionLines(html, heading) {
  const normalizedHeading = heading.toLowerCase();
  const lines = getPageLines(html);
  const startIndex = lines.findIndex((line) => line.toLowerCase() === normalizedHeading);
  if (startIndex === -1) {
    return [];
  }

  const sectionLines = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const normalizedLine = line.toLowerCase();
    if (SECTION_HEADINGS.has(normalizedLine) || SECTION_STOP_LINES.has(normalizedLine)) {
      break;
    }

    sectionLines.push(line);
  }

  return sectionLines;
}

function sectionLinesToItems(lines) {
  if (lines.length === 0) {
    return [];
  }

  const items = [];
  for (const rawLine of lines) {
    const startsBullet = /^[-\u2013\u2014]/u.test(rawLine);
    const line = normalizeText(rawLine.replace(/^[-\u2013\u2014]\s*/u, ""));
    if (!line) {
      continue;
    }

    if (startsBullet || items.length === 0) {
      items.push(line);
      continue;
    }

    items[items.length - 1] = normalizeText(`${items[items.length - 1]} ${line}`);
  }

  return items;
}

function itemsToTechnicalSpecs(items) {
  const technicalSpecs = [];

  for (const item of items) {
    const colonIndex = item.indexOf(":");
    if (colonIndex === -1) {
      if (technicalSpecs.length > 0) {
        const previous = technicalSpecs[technicalSpecs.length - 1];
        previous.value = normalizeText(`${previous.value} ${item}`);
      } else {
        technicalSpecs.push({ label: "", value: normalizeText(item) });
      }
      continue;
    }

    const label = normalizeText(item.slice(0, colonIndex));
    const value = normalizeText(item.slice(colonIndex + 1));

    if (!label && technicalSpecs.length > 0) {
      const previous = technicalSpecs[technicalSpecs.length - 1];
      previous.value = normalizeText(`${previous.value} ${value}`);
      continue;
    }

    technicalSpecs.push({ label, value });
  }

  return technicalSpecs;
}

function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function sanitizePdfText(text) {
  return text
    .replace(/\u00b0/g, " deg ")
    .replace(/\u00b2/g, "2")
    .replace(/\u00b3/g, "3")
    .replace(/\u2264/g, "<=")
    .replace(/\u2265/g, ">=")
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/\u2192/g, "->")
    .replace(/\u2193/g, "down ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

function wrapPdfLine(text, maxChars = 88) {
  const words = sanitizePdfText(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [""];
  }

  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function buildSimplePdf(productName, technicalSpecs) {
  const headerLines = [
    "PEVALIT Technical Parameters",
    sanitizePdfText(productName),
    "",
    ...technicalSpecs.flatMap((spec) => wrapPdfLine(spec.label ? `${spec.label}: ${spec.value}` : spec.value))
  ];

  const maxLinesPerPage = 42;
  const pages = [];
  for (let index = 0; index < headerLines.length; index += maxLinesPerPage) {
    pages.push(headerLines.slice(index, index + maxLinesPerPage));
  }

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("{{PAGES_OBJECT}}");
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds = [];

  for (const lines of pages) {
    const streamLines = ["BT", "/F1 12 Tf", "50 780 Td", "16 TL"];
    for (const line of lines) {
      streamLines.push(`(${escapePdfText(line)}) Tj`);
      streamLines.push("T*");
    }
    streamLines.push("ET");

    const stream = streamLines.join("\n");
    const contentId = addObject(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    pageIds.push(pageId);
  }

  objects[pagesId - 1] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) {
    throw new Error(`Request failed for ${url} with status ${response.status}`);
  }

  const text = new TextDecoder("utf-8").decode(await response.arrayBuffer());
  return JSON.parse(text);
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) {
    throw new Error(`Request failed for ${url} with status ${response.status}`);
  }

  return new TextDecoder("utf-8").decode(await response.arrayBuffer());
}

async function fetchBuffer(url) {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) {
    throw new Error(`Request failed for ${url} with status ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadIfMissing(url, destinationPath) {
  if (await fileExists(destinationPath)) {
    return;
  }

  const buffer = await fetchBuffer(url);
  await fs.writeFile(destinationPath, buffer);
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function getLocalizedProductUrl(language, slug) {
  return `https://pevalit.com${language.prefix}/product/${slug}/`;
}

function getLocalAssetPath(url, publicDirName) {
  const fileName = decodeURIComponent(path.basename(new URL(url).pathname));
  return `/${publicDirName}/imported/${fileName}`;
}

function buildProductDocument(pdfUrl, productName) {
  return {
    title: `${productName} Technical Parameters`,
    url: getLocalAssetPath(pdfUrl, "catalogs")
  };
}

async function main() {
  await ensureDir(PUBLIC_IMAGES_DIR);
  await ensureDir(PUBLIC_PDFS_DIR);

  const legacyProducts = await fetchJson(PRODUCT_INDEX_URL);
  const legacyCategories = await fetchJson(PRODUCT_CATEGORY_URL);
  const categorySlugById = new Map(legacyCategories.map((category) => [category.id, category.slug]));

  const featuredMediaIds = [...new Set(legacyProducts.map((product) => product.featured_media).filter(Boolean))];
  const featuredMediaEntries = await mapLimit(featuredMediaIds, 8, async (id) => {
    const media = await fetchJson(`https://pevalit.com/wp-json/wp/v2/media/${id}`);
    return [id, media];
  });
  const featuredMediaById = new Map(featuredMediaEntries);

  const productMediaEntries = await mapLimit(legacyProducts, 8, async (product) => {
    const media = await fetchJson(`https://pevalit.com/wp-json/wp/v2/media?parent=${product.id}&per_page=50`);
    return [product.slug, media];
  });
  const mediaByProductSlug = new Map(productMediaEntries);

  const localizedPageEntries = await mapLimit(
    legacyProducts.flatMap((product) => LANGUAGES.map((language) => ({ slug: product.slug, language }))),
    10,
    async ({ slug, language }) => {
      const html = await fetchText(getLocalizedProductUrl(language, slug));
      return [`${language.code}:${slug}`, html];
    }
  );
  const localizedHtmlByKey = new Map(localizedPageEntries);

  const imagesToDownload = new Map();
  const pdfsToDownload = new Map();
  const generatedPdfProducts = [];
  const productsByLanguage = Object.fromEntries(LANGUAGES.map((language) => [language.code, []]));

  for (const legacyProduct of legacyProducts) {
    const productName = normalizeText(legacyProduct.title.rendered);
    const categorySlug = categorySlugById.get(legacyProduct.product_category[0]) ?? "plasters";
    const featuredMedia = featuredMediaById.get(legacyProduct.featured_media);
    const imageUrl = featuredMedia ? getLocalAssetPath(featuredMedia.source_url, "images") : "/images/imported/Pevalit-Catalogue-DE.jpg";
    if (featuredMedia?.source_url) {
      imagesToDownload.set(featuredMedia.source_url, path.join(PUBLIC_IMAGES_DIR, path.basename(new URL(featuredMedia.source_url).pathname)));
    }

    const media = mediaByProductSlug.get(legacyProduct.slug) ?? [];
    const pdfAttachments = media.filter((item) => item.mime_type === "application/pdf");
    const chosenPdf = pdfAttachments[0] ?? null;
    if (chosenPdf?.source_url) {
      pdfsToDownload.set(chosenPdf.source_url, path.join(PUBLIC_PDFS_DIR, path.basename(new URL(chosenPdf.source_url).pathname)));
    }

    let englishTechnicalSpecs = [];
    for (const language of LANGUAGES) {
      const html = localizedHtmlByKey.get(`${language.code}:${legacyProduct.slug}`) ?? "";
      const applications = sectionLinesToItems(getSectionLines(html, language.applicationHeading));
      const technicalSpecs = itemsToTechnicalSpecs(sectionLinesToItems(getSectionLines(html, language.technicalHeading)));

      if (language.code === "en") {
        englishTechnicalSpecs = technicalSpecs;
      }

      const documents = [];
      if (chosenPdf?.source_url) {
        documents.push(buildProductDocument(chosenPdf.source_url, productName));
      }

      productsByLanguage[language.code].push({
        slug: legacyProduct.slug,
        name: productName,
        categorySlug,
        imageUrl,
        summary: productName,
        applications,
        benefits: [],
        technicalSpecs,
        documents,
        seo: {
          title: `${productName} | PEVALIT`,
          description: productName
        }
      });
    }

    if (!chosenPdf?.source_url) {
      const generatedFileName = `${legacyProduct.slug}-technical-parameters.pdf`;
      const generatedFilePath = path.join(PUBLIC_PDFS_DIR, generatedFileName);
      const generatedPdf = buildSimplePdf(productName, englishTechnicalSpecs);
      await fs.writeFile(generatedFilePath, generatedPdf);
      generatedPdfProducts.push(legacyProduct.slug);

      for (const language of LANGUAGES) {
        const product = productsByLanguage[language.code][productsByLanguage[language.code].length - 1];
        product.documents = [
          {
            title: `${productName} Technical Parameters`,
            url: `/catalogs/imported/${generatedFileName}`
          }
        ];
      }
    }
  }

  await mapLimit([...imagesToDownload.entries()], 6, async ([url, destinationPath]) => {
    await downloadIfMissing(url, destinationPath);
  });
  await mapLimit([...pdfsToDownload.entries()], 6, async ([url, destinationPath]) => {
    await downloadIfMissing(url, destinationPath);
  });

  for (const language of LANGUAGES) {
    const productPath = path.join(ROOT, "src", "content", language.code, "products.json");
    await fs.writeFile(productPath, `${JSON.stringify(productsByLanguage[language.code], null, 2)}\n`, "utf8");
  }

  for (const language of LANGUAGES) {
    const categoryPath = path.join(ROOT, "src", "content", language.code, "categories.json");
    const categories = JSON.parse(await fs.readFile(categoryPath, "utf8"));
    const missingCategory = CATEGORY_ENTRY_BY_LANGUAGE[language.code];
    if (!categories.some((category) => category.slug === missingCategory.slug)) {
      const insertAfterIndex = categories.findIndex((category) => category.slug === "polyurethane-adhesive-foam");
      if (insertAfterIndex === -1) {
        categories.push(missingCategory);
      } else {
        categories.splice(insertAfterIndex + 1, 0, missingCategory);
      }
      await fs.writeFile(categoryPath, `${JSON.stringify(categories, null, 2)}\n`, "utf8");
    }
  }

  const summary = {
    totalProducts: legacyProducts.length,
    generatedPdfProducts,
    downloadedImages: imagesToDownload.size,
    downloadedPdfs: pdfsToDownload.size,
    categoryCount: legacyCategories.length
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
