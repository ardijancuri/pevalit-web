import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const BASE_URL = process.env.ASSET_SOURCE_URL || "https://pevalit.com";
const MAX_PAGES = Number(process.env.MAX_PAGES || 120);
const DRY_RUN = process.argv.includes("--dry-run");

const CONTENT_DIR = path.join(ROOT, "src", "content", "en");
const CATEGORIES_PATH = path.join(CONTENT_DIR, "categories.json");
const PRODUCTS_PATH = path.join(CONTENT_DIR, "products.json");
const CATALOGS_PATH = path.join(CONTENT_DIR, "catalogs.json");

const OUTPUT_IMAGES_DIR = path.join(ROOT, "public", "images", "imported");
const OUTPUT_PDFS_DIR = path.join(ROOT, "public", "catalogs", "imported");
const REPORT_PATH = path.join(ROOT, "scripts", "sync-assets-report.json");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);
const PDF_EXTENSION = ".pdf";
const SKIP_PAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
  ".pdf",
  ".zip",
  ".doc",
  ".docx",
  ".xlsx"
]);
const STOP_WORDS = new Set(["pe", "mb", "and", "for", "with", "the", "product", "range", "additive"]);

function toUrl(input, base) {
  try {
    return new URL(input, base);
  } catch {
    return null;
  }
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenize(...values) {
  const tokens = new Set();
  for (const value of values) {
    for (const part of normalize(value).split(/\s+/g)) {
      if (!part || STOP_WORDS.has(part) || part.length < 2) continue;
      tokens.add(part);
    }
  }
  return [...tokens];
}

function isPdfUrl(url) {
  return url.pathname.toLowerCase().endsWith(PDF_EXTENSION);
}

function isImageUrl(url) {
  const ext = path.extname(url.pathname.toLowerCase());
  return IMAGE_EXTENSIONS.has(ext);
}

function extractAttributeUrls(html, attrName) {
  const regex = new RegExp(`${attrName}\\s*=\\s*["']([^"']+)["']`, "gi");
  const results = [];
  let match = regex.exec(html);
  while (match) {
    results.push(match[1]);
    match = regex.exec(html);
  }
  return results;
}

function extractSrcSetUrls(html) {
  const regex = /srcset\s*=\s*["']([^"']+)["']/gi;
  const results = [];
  let match = regex.exec(html);
  while (match) {
    const parts = match[1].split(",").map((x) => x.trim().split(/\s+/g)[0]).filter(Boolean);
    results.push(...parts);
    match = regex.exec(html);
  }
  return results;
}

function shouldCrawlPage(url, allowedHosts) {
  if (!allowedHosts.has(url.hostname)) return false;
  const ext = path.extname(url.pathname.toLowerCase());
  return !SKIP_PAGE_EXTENSIONS.has(ext);
}

function sanitizeFileName(fileName) {
  const dot = fileName.lastIndexOf(".");
  const base = dot >= 0 ? fileName.slice(0, dot) : fileName;
  const ext = dot >= 0 ? fileName.slice(dot) : "";
  const safeBase = base.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `${safeBase || "asset"}${ext.toLowerCase()}`;
}

function fileNameFromUrl(url, fallbackExt) {
  const raw = path.basename(url.pathname) || "";
  if (raw && raw.includes(".")) return sanitizeFileName(raw);
  const hash = crypto.createHash("sha1").update(url.toString()).digest("hex").slice(0, 10);
  return `asset-${hash}${fallbackExt}`;
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timeout);
  }
}

function pushAsset(assetMap, url, sourcePage) {
  const key = url.toString();
  if (!assetMap.has(key)) {
    assetMap.set(key, { url: key, sourcePages: new Set() });
  }
  assetMap.get(key).sourcePages.add(sourcePage);
}

function scoreAsset(asset, tokens, opts = {}) {
  const haystack = normalize(asset.url);
  const sourceText = normalize(asset.sourcePages.join(" "));
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 5;
    if (sourceText.includes(token)) score += 3;
  }
  if (opts.preferCatalog && haystack.includes("catalog")) score += 4;
  if (opts.preferSafety && (haystack.includes("sds") || haystack.includes("safety"))) score += 6;
  if (opts.preferTechnical && (haystack.includes("tds") || haystack.includes("technical"))) score += 6;
  if (opts.preferPhoto && /(hero|banner|product|gallery)/.test(haystack)) score += 3;
  if (opts.avoidLogo && /(logo|icon|favicon)/.test(haystack)) score -= 6;
  return score;
}

function pickBestAsset(assets, tokens, opts) {
  if (!assets.length) return null;
  let best = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const asset of assets) {
    const score = scoreAsset(asset, tokens, opts);
    if (score > bestScore) {
      bestScore = score;
      best = asset;
    }
  }
  if (!best || bestScore <= 0) return null;
  return best;
}

function toWritableEntries(assetMap) {
  return [...assetMap.values()].map((item) => ({
    url: item.url,
    sourcePages: [...item.sourcePages]
  }));
}

async function crawlWebsite() {
  const base = new URL(BASE_URL);
  const allowedHosts = new Set([base.hostname, `www.${base.hostname.replace(/^www\./, "")}`]);
  const queue = [base.toString()];
  const visited = new Set();

  const imageMap = new Map();
  const pdfMap = new Map();

  while (queue.length && visited.size < MAX_PAGES) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    let response;
    try {
      response = await fetchWithTimeout(current);
    } catch {
      continue;
    }
    if (!response.ok) continue;

    const type = response.headers.get("content-type") || "";
    if (!type.includes("text/html")) continue;
    const html = await response.text();

    const linkCandidates = [
      ...extractAttributeUrls(html, "href"),
      ...extractAttributeUrls(html, "src"),
      ...extractSrcSetUrls(html)
    ];

    for (const item of linkCandidates) {
      const resolved = toUrl(item, current);
      if (!resolved) continue;

      if (isPdfUrl(resolved)) {
        pushAsset(pdfMap, resolved, current);
        continue;
      }

      if (isImageUrl(resolved)) {
        pushAsset(imageMap, resolved, current);
        continue;
      }

      if (shouldCrawlPage(resolved, allowedHosts) && !visited.has(resolved.toString())) {
        queue.push(resolved.toString());
      }
    }
  }

  return {
    pagesVisited: [...visited],
    imageAssets: toWritableEntries(imageMap),
    pdfAssets: toWritableEntries(pdfMap)
  };
}

async function downloadAsset(asset, outputDir, publicPrefix, fallbackExt) {
  const url = new URL(asset.url);
  const fileName = fileNameFromUrl(url, fallbackExt);
  const filePath = path.join(outputDir, fileName);
  const webPath = `${publicPrefix}/${fileName}`;

  if (DRY_RUN) {
    return { ...asset, fileName, filePath, webPath, downloaded: false };
  }

  await mkdir(outputDir, { recursive: true });
  const response = await fetchWithTimeout(asset.url, 30000);
  if (!response.ok) {
    return { ...asset, fileName, filePath, webPath, downloaded: false, error: `HTTP ${response.status}` };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
  return { ...asset, fileName, filePath, webPath, downloaded: true };
}

async function readJson(filePath) {
  const text = await readFile(filePath, "utf8");
  return JSON.parse(text);
}

async function writeJson(filePath, data) {
  const output = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(filePath, output, "utf8");
}

function mapAssets(categories, products, catalogs, imageAssets, pdfAssets) {
  const imagePool = imageAssets.map((item) => ({ ...item, sourcePages: item.sourcePages || [] }));
  const pdfPool = pdfAssets.map((item) => ({ ...item, sourcePages: item.sourcePages || [] }));

  const updates = {
    categories: [],
    products: [],
    catalogs: []
  };

  for (const category of categories) {
    const best = pickBestAsset(imagePool, tokenize(category.slug, category.name), { avoidLogo: true, preferPhoto: true });
    if (best) {
      updates.categories.push({ slug: category.slug, from: category.heroImage, to: best.webPath });
      category.heroImage = best.webPath;
    }
  }

  for (const product of products) {
    const productTokens = tokenize(product.slug, product.name, product.categorySlug);
    const productUpdate = { slug: product.slug, docs: [] };

    for (const doc of product.documents) {
      const preferSafety = /safety|sds/i.test(doc.title);
      const preferTechnical = /technical|tds/i.test(doc.title);
      const best = pickBestAsset(pdfPool, productTokens, { preferSafety, preferTechnical });
      if (best) {
        productUpdate.docs.push({ title: doc.title, from: doc.url, to: best.webPath });
        doc.url = best.webPath;
      }
    }

    if (productUpdate.docs.length) {
      updates.products.push(productUpdate);
    }
  }

  for (const catalog of catalogs) {
    const catalogTokens = tokenize(catalog.slug, catalog.title, catalog.description);
    const bestPdf = pickBestAsset(pdfPool, catalogTokens, { preferCatalog: true });
    const bestImage = pickBestAsset(imagePool, catalogTokens, { preferCatalog: true, avoidLogo: true, preferPhoto: true });

    const row = { slug: catalog.slug };
    if (bestPdf) {
      row.fileUrl = { from: catalog.fileUrl, to: bestPdf.webPath };
      catalog.fileUrl = bestPdf.webPath;
    }
    if (bestImage) {
      row.previewImage = { from: catalog.previewImage, to: bestImage.webPath };
      catalog.previewImage = bestImage.webPath;
    }
    if (row.fileUrl || row.previewImage) {
      updates.catalogs.push(row);
    }
  }

  return updates;
}

async function main() {
  console.log(`Crawling ${BASE_URL} (max pages: ${MAX_PAGES})...`);
  const crawled = await crawlWebsite();
  console.log(`Visited ${crawled.pagesVisited.length} pages.`);
  console.log(`Found ${crawled.imageAssets.length} image URLs and ${crawled.pdfAssets.length} PDF URLs.`);

  const downloadedImages = [];
  for (const image of crawled.imageAssets) {
    downloadedImages.push(await downloadAsset(image, OUTPUT_IMAGES_DIR, "/images/imported", ".jpg"));
  }

  const downloadedPdfs = [];
  for (const pdf of crawled.pdfAssets) {
    downloadedPdfs.push(await downloadAsset(pdf, OUTPUT_PDFS_DIR, "/catalogs/imported", ".pdf"));
  }

  const validImages = downloadedImages.filter((item) => item.downloaded || DRY_RUN);
  const validPdfs = downloadedPdfs.filter((item) => item.downloaded || DRY_RUN);

  const categories = await readJson(CATEGORIES_PATH);
  const products = await readJson(PRODUCTS_PATH);
  const catalogs = await readJson(CATALOGS_PATH);

  const updates = mapAssets(categories, products, catalogs, validImages, validPdfs);

  if (!DRY_RUN) {
    await writeJson(CATEGORIES_PATH, categories);
    await writeJson(PRODUCTS_PATH, products);
    await writeJson(CATALOGS_PATH, catalogs);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    source: BASE_URL,
    dryRun: DRY_RUN,
    visitedPages: crawled.pagesVisited.length,
    found: {
      images: crawled.imageAssets.length,
      pdfs: crawled.pdfAssets.length
    },
    downloaded: {
      images: downloadedImages.filter((item) => item.downloaded).length,
      pdfs: downloadedPdfs.filter((item) => item.downloaded).length
    },
    updates,
    failedDownloads: {
      images: downloadedImages.filter((item) => item.error).map((x) => ({ url: x.url, error: x.error })),
      pdfs: downloadedPdfs.filter((item) => item.error).map((x) => ({ url: x.url, error: x.error }))
    }
  };

  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`Report written to ${REPORT_PATH}`);
  if (DRY_RUN) {
    console.log("Dry run complete. No files were downloaded or JSON files modified.");
  } else {
    console.log("Assets synced and content JSON updated.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
