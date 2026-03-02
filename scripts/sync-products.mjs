import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const BASE_URL = process.env.ASSET_SOURCE_URL || "https://pevalit.com";
const DRY_RUN = process.argv.includes("--dry-run");

const CATEGORIES_PATH = path.join(ROOT, "src", "content", "en", "categories.json");
const PRODUCTS_PATH = path.join(ROOT, "src", "content", "en", "products.json");
const OUTPUT_IMAGES_DIR = path.join(ROOT, "public", "images", "imported");
const OUTPUT_PDFS_DIR = path.join(ROOT, "public", "catalogs", "imported");
const REPORT_PATH = path.join(ROOT, "scripts", "sync-products-report.json");
const BACKUPS_DIR = path.join(ROOT, "scripts", "backups");

const REJECT_IMAGE_PATTERNS = [/\/flags\//i, /favicon/i, /logo/i, /core\/modules/i, /\.svg$/i];
const LOCALES = ["sq", "mk", "de", "en"];

function decodeHtmlEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function normalizeText(value) {
  return decodeHtmlEntities(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function canonicalPath(url) {
  let pathName = url.pathname;
  for (const locale of LOCALES) {
    const prefix = `/${locale}/`;
    if (pathName.startsWith(prefix)) {
      pathName = `/${pathName.slice(prefix.length)}`;
      break;
    }
  }
  return pathName.replace(/\/+/g, "/");
}

function canonicalizeUrl(input, base, kind) {
  let url;
  try {
    url = new URL(input, base);
  } catch {
    return null;
  }
  const pathName = canonicalPath(url);
  if (kind === "category" && !pathName.includes("/product-category/")) return null;
  if (kind === "product" && !pathName.includes("/product/")) return null;
  url.pathname = pathName;
  url.hash = "";
  url.search = "";
  return url.toString();
}

function extractAttr(html, attr) {
  const regex = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, "gi");
  const result = [];
  let match = regex.exec(html);
  while (match) {
    result.push(match[1]);
    match = regex.exec(html);
  }
  return result;
}

function pickPrimaryImage(imageUrls) {
  for (const url of imageUrls) {
    if (REJECT_IMAGE_PATTERNS.some((pattern) => pattern.test(url))) continue;
    if (!/\.(jpg|jpeg|png|webp|avif)(\?|$)/i.test(url)) continue;
    return url;
  }
  return null;
}

function fileNameFromUrl(rawUrl, fallbackExt) {
  const url = new URL(rawUrl);
  const file = path.basename(url.pathname);
  if (file && file.includes(".")) return file;
  const hash = crypto.createHash("sha1").update(rawUrl).digest("hex").slice(0, 12);
  return `asset-${hash}${fallbackExt}`;
}

async function fetchHtml(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response.text();
}

async function download(url, outDir, webPrefix, fallbackExt) {
  const fileName = fileNameFromUrl(url, fallbackExt);
  const filePath = path.join(outDir, fileName);
  const webPath = `${webPrefix}/${fileName}`;

  if (DRY_RUN) {
    return { downloaded: false, webPath };
  }

  await mkdir(outDir, { recursive: true });
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    return { downloaded: false, webPath, error: `HTTP ${response.status}` };
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
  return { downloaded: true, webPath };
}

async function backupFile(filePath) {
  await mkdir(BACKUPS_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[.:]/g, "-");
  const backupPath = path.join(BACKUPS_DIR, `${path.basename(filePath, ".json")}.${stamp}.json`);
  await copyFile(filePath, backupPath);
  return backupPath;
}

function productTitleFromHtml(html) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "";
  const clean = normalizeText(title).replace(/[-–—]\s*Pevalit$/i, "").trim();
  return clean || "Product";
}

function categoryTitleFromHtml(html) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "";
  const clean = normalizeText(title).replace(/[-–—]\s*Pevalit$/i, "").trim();
  return clean || "Category";
}

async function main() {
  const allProductsUrl = new URL("/all-products/", BASE_URL).toString();
  const allProductsHtml = await fetchHtml(allProductsUrl);
  const categoryLinks = [...new Set(
    extractAttr(allProductsHtml, "href")
      .map((href) => canonicalizeUrl(href, allProductsUrl, "category"))
      .filter(Boolean)
  )];

  const categoryRecords = [];
  const productMap = new Map();
  const downloads = { images: 0, pdfs: 0 };
  const failures = [];

  for (const categoryUrl of categoryLinks) {
    const categoryHtml = await fetchHtml(categoryUrl);
    const categoryTitle = categoryTitleFromHtml(categoryHtml);
    const categorySlug = categoryUrl.match(/\/product-category\/([^/]+)\//i)?.[1] || slugify(categoryTitle);

    const productLinks = [...new Set(
      extractAttr(categoryHtml, "href")
        .map((href) => canonicalizeUrl(href, categoryUrl, "product"))
        .filter(Boolean)
    )];

    const productSlugsInCategory = [];

    for (const productUrl of productLinks) {
      const productSlug = productUrl.match(/\/product\/([^/]+)\//i)?.[1];
      if (!productSlug) continue;
      productSlugsInCategory.push(productSlug);

      if (productMap.has(productSlug)) {
        continue;
      }

      const productHtml = await fetchHtml(productUrl);
      const name = productTitleFromHtml(productHtml);

      const imgCandidates = extractAttr(productHtml, "src")
        .concat(extractAttr(productHtml, "data-src"))
        .map((src) => {
          try {
            return new URL(src, productUrl).toString();
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const primaryImageUrl = pickPrimaryImage(imgCandidates);
      let imageWebPath = "/images/imported/Pevalit-Catalogue-DE.jpg";
      if (primaryImageUrl) {
        const imageDownload = await download(primaryImageUrl, OUTPUT_IMAGES_DIR, "/images/imported", ".jpg");
        if (imageDownload.downloaded) downloads.images += 1;
        if (imageDownload.error) failures.push({ type: "image", productSlug, url: primaryImageUrl, error: imageDownload.error });
        imageWebPath = imageDownload.webPath;
      }

      const pdfLinks = [...new Set(
        extractAttr(productHtml, "href")
          .map((href) => {
            try {
              return new URL(href, productUrl).toString();
            } catch {
              return null;
            }
          })
          .filter((href) => href && /\.pdf(\?|$)/i.test(href))
      )];

      const documents = [];
      for (const pdfUrl of pdfLinks) {
        const pdfDownload = await download(pdfUrl, OUTPUT_PDFS_DIR, "/catalogs/imported", ".pdf");
        if (pdfDownload.downloaded) downloads.pdfs += 1;
        if (pdfDownload.error) {
          failures.push({ type: "pdf", productSlug, url: pdfUrl, error: pdfDownload.error });
          continue;
        }
        const titleFromFile = fileNameFromUrl(pdfUrl, ".pdf").replace(/[-_]+/g, " ").replace(/\.pdf$/i, "").trim();
        documents.push({ title: titleFromFile || "Product Document", url: pdfDownload.webPath });
      }

      productMap.set(productSlug, {
        slug: productSlug,
        name,
        categorySlug,
        imageUrl: imageWebPath,
        summary: `${name} imported from pevalit.com.`,
        applications: [`Category: ${categoryTitle}`],
        benefits: ["Imported product data from legacy website."],
        technicalSpecs: [
          { label: "Source", value: "https://pevalit.com" }
        ],
        documents,
        seo: {
          title: `${name} | PEVALIT`,
          description: `${name} imported from pevalit.com legacy product page.`
        }
      });
    }

    const heroFromFirstProduct = productSlugsInCategory.length ? productMap.get(productSlugsInCategory[0])?.imageUrl : null;
    categoryRecords.push({
      slug: categorySlug,
      name: categoryTitle,
      description: `${categoryTitle} products imported from pevalit.com.`,
      heroImage: heroFromFirstProduct || "/images/imported/Pevalit-Catalogue-DE.jpg"
    });
  }

  const products = [...productMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  const categories = categoryRecords.sort((a, b) => a.name.localeCompare(b.name));

  let categoryBackupPath = null;
  let productBackupPath = null;
  if (!DRY_RUN) {
    categoryBackupPath = await backupFile(CATEGORIES_PATH);
    productBackupPath = await backupFile(PRODUCTS_PATH);
    await writeFile(CATEGORIES_PATH, `${JSON.stringify(categories, null, 2)}\n`, "utf8");
    await writeFile(PRODUCTS_PATH, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  }

  const report = {
    generatedAt: new Date().toISOString(),
    source: BASE_URL,
    dryRun: DRY_RUN,
    categoryCount: categories.length,
    productCount: products.length,
    downloads,
    backups: {
      categories: categoryBackupPath,
      products: productBackupPath
    },
    failures
  };
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Sync complete. Categories: ${categories.length}, products: ${products.length}`);
  console.log(`Report: ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
