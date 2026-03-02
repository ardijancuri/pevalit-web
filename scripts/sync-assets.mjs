import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const BASE_URL = process.env.ASSET_SOURCE_URL || "https://pevalit.com";
const MAX_PAGES = Number(process.env.MAX_PAGES || 120);
const DRY_RUN = process.argv.includes("--dry-run");
const scopeArg = process.argv.find((arg) => arg.startsWith("--scope="));
const SCOPE = (scopeArg?.split("=")[1] || "products").toLowerCase();

const CONTENT_DIR = path.join(ROOT, "src", "content", "en");
const PRODUCTS_PATH = path.join(CONTENT_DIR, "products.json");
const OUTPUT_IMAGES_DIR = path.join(ROOT, "public", "images", "imported");
const OUTPUT_PDFS_DIR = path.join(ROOT, "public", "catalogs", "imported");
const REPORT_PATH = path.join(ROOT, "scripts", "sync-assets-report.json");
const BACKUPS_DIR = path.join(ROOT, "scripts", "backups");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);
const PDF_EXTENSION = ".pdf";
const SKIP_PAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg", ".pdf", ".zip", ".doc", ".docx", ".xlsx"
]);
const STOP_WORDS = new Set(["pe", "mb", "and", "for", "with", "the", "product", "range", "additive"]);
const REJECT_IMAGE_PATTERNS = [
  /\/flags\//i,
  /favicon/i,
  /logo/i,
  /core\/modules/i,
  /\ben_us\b/i,
  /\bde_de\b/i,
  /\bmk_mk\b/i,
  /\bsq\b/i
];
const PRODUCT_PAGE_ALIASES = {
  "pe-fr-700": ["g220"],
  "pe-color-black-100": ["g200"]
};

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

function slugify(value) {
  return normalize(value).replace(/\s+/g, "-");
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

function toWritableEntries(assetMap) {
  return [...assetMap.values()].map((item) => ({
    url: item.url,
    sourcePages: [...item.sourcePages]
  }));
}

function mergeAssetEntries(baseEntries, extraEntries) {
  const merged = new Map(baseEntries.map((entry) => [entry.url, { ...entry, sourcePages: [...entry.sourcePages] }]));
  for (const entry of extraEntries) {
    if (!merged.has(entry.url)) {
      merged.set(entry.url, { ...entry, sourcePages: [...entry.sourcePages] });
      continue;
    }
    const existing = merged.get(entry.url);
    const combined = new Set([...(existing.sourcePages || []), ...(entry.sourcePages || [])]);
    existing.sourcePages = [...combined];
  }
  return [...merged.values()];
}

function estimateImageQuality(asset) {
  const name = asset.fileName.toLowerCase();
  if (/-(\d+)x(\d+)\./.test(name)) {
    const [, w, h] = name.match(/-(\d+)x(\d+)\./) || [];
    return Number(w || 0) * Number(h || 0);
  }
  if (/\b(300x|150x|120x|80x)\b/.test(name)) return 100;
  return 1_000_000;
}

function isRejectedImage(url) {
  return REJECT_IMAGE_PATTERNS.some((pattern) => pattern.test(url));
}

function productSlugVariants(product) {
  const set = new Set();
  set.add(product.slug);

  const fromName = slugify(product.name);
  if (fromName) set.add(fromName);

  const noPeSlug = product.slug.replace(/^pe-/, "");
  if (noPeSlug) set.add(noPeSlug);

  const noPeName = fromName.replace(/^pe-/, "");
  if (noPeName) set.add(noPeName);
  for (const alias of PRODUCT_PAGE_ALIASES[product.slug] || []) {
    set.add(alias);
  }

  return [...set];
}

function fileStem(fileName) {
  return fileName.replace(/\.[^.]+$/, "").toLowerCase();
}

function strongFileMatch(stem, slugVariants) {
  return slugVariants.some((variant) => {
    const compact = variant.replace(/-/g, "");
    return stem.includes(variant) || stem.includes(compact);
  });
}

function exactProductPageMatch(sourcePages, slugs) {
  return sourcePages.some((page) => {
    const normalized = page.replace(/\/+$/, "");
    return slugs.some((slug) => normalized.endsWith(`/product/${slug}`));
  });
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
      ...extractAttributeUrls(html, "data-src"),
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

async function crawlTargetProductPages(products) {
  const assets = [];
  for (const product of products) {
    const targetSlugs = [product.slug, ...(PRODUCT_PAGE_ALIASES[product.slug] || [])];
    for (const targetSlug of targetSlugs) {
      const targetUrl = new URL(`/product/${targetSlug}/`, BASE_URL).toString();
      let response;
      try {
        response = await fetchWithTimeout(targetUrl, 20000);
      } catch {
        continue;
      }
      if (!response.ok) continue;
      const type = response.headers.get("content-type") || "";
      if (!type.includes("text/html")) continue;
      const html = await response.text();
      const linkCandidates = [
        ...extractAttributeUrls(html, "src"),
        ...extractAttributeUrls(html, "data-src"),
        ...extractSrcSetUrls(html)
      ];
      const seen = new Set();
      for (const item of linkCandidates) {
        const resolved = toUrl(item, targetUrl);
        if (!resolved || !isImageUrl(resolved)) continue;
        const key = resolved.toString();
        if (seen.has(key)) continue;
        seen.add(key);
        assets.push({ url: key, sourcePages: [targetUrl] });
      }
    }
  }
  return assets;
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

function mapProductImages(products, imageAssets, targetedProductImages) {
  const validImages = imageAssets.filter((asset) => !isRejectedImage(asset.url));
  const updates = [];
  const unmatched = [];
  const rejected = [];

  for (const product of products) {
    const slugVariants = productSlugVariants(product);
    const candidates = [];

    for (const asset of validImages) {
      const stem = fileStem(asset.fileName);
      const allowedProductSlugs = [product.slug, ...(PRODUCT_PAGE_ALIASES[product.slug] || [])];
      const exactPage =
        exactProductPageMatch(asset.sourcePages, allowedProductSlugs) ||
        (targetedProductImages.get(product.slug)?.has(asset.url) ?? false);
      const strongName = strongFileMatch(stem, slugVariants);

      if (!exactPage && !strongName) {
        rejected.push({
          product: product.slug,
          asset: asset.webPath,
          reason: "no_strong_match"
        });
        continue;
      }

      const quality = estimateImageQuality(asset);
      const score = (exactPage ? 1000 : 0) + (strongName ? 500 : 0) + quality;
      candidates.push({ asset, exactPage, strongName, score, quality });
    }

    if (!candidates.length) {
      unmatched.push({ slug: product.slug, name: product.name, currentImageUrl: product.imageUrl });
      continue;
    }

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];

    if (best.asset.webPath !== product.imageUrl) {
      updates.push({
        slug: product.slug,
        from: product.imageUrl,
        to: best.asset.webPath,
        evidence: {
          exactProductPage: best.exactPage,
          strongFileMatch: best.strongName,
          sourcePages: best.asset.sourcePages
        }
      });
      product.imageUrl = best.asset.webPath;
    }
  }

  return { updates, unmatched, rejected };
}

async function backupProductsFile() {
  await mkdir(BACKUPS_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[.:]/g, "-");
  const backupPath = path.join(BACKUPS_DIR, `products.${stamp}.json`);
  await copyFile(PRODUCTS_PATH, backupPath);
  return backupPath;
}

async function main() {
  if (SCOPE !== "products") {
    throw new Error(`Unsupported scope '${SCOPE}'. Use --scope=products.`);
  }

  console.log(`Crawling ${BASE_URL} (max pages: ${MAX_PAGES})...`);
  const crawled = await crawlWebsite();
  const products = await readJson(PRODUCTS_PATH);
  const targetPageAssets = await crawlTargetProductPages(products);
  crawled.imageAssets = mergeAssetEntries(crawled.imageAssets, targetPageAssets);
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

  const validImages = downloadedImages
    .filter((item) => item.downloaded || DRY_RUN)
    .map((item) => ({ ...item, sourcePages: item.sourcePages || [] }));

  const targetedProductImages = new Map();
  for (const item of targetPageAssets) {
    if (!item.sourcePages?.length) continue;
    const source = item.sourcePages[0].replace(/\/+$/, "");
    const slug = source.split("/").pop();
    if (!slug) continue;
    if (!targetedProductImages.has(slug)) targetedProductImages.set(slug, new Set());
    targetedProductImages.get(slug).add(item.url);
  }

  const mapping = mapProductImages(products, validImages, targetedProductImages);

  let backupPath = null;
  if (!DRY_RUN) {
    backupPath = await backupProductsFile();
    try {
      await writeJson(PRODUCTS_PATH, products);
    } catch (error) {
      await copyFile(backupPath, PRODUCTS_PATH);
      throw error;
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    source: BASE_URL,
    dryRun: DRY_RUN,
    scope: SCOPE,
    visitedPages: crawled.pagesVisited.length,
    found: {
      images: crawled.imageAssets.length,
      pdfs: crawled.pdfAssets.length
    },
    downloaded: {
      images: downloadedImages.filter((item) => item.downloaded).length,
      pdfs: downloadedPdfs.filter((item) => item.downloaded).length
    },
    backupPath,
    productsMatched: mapping.updates,
    productsUnmatched: mapping.unmatched,
    productsRejectedCandidates: mapping.rejected.slice(0, 500),
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
    console.log(`Product image sync complete. Matched ${mapping.updates.length}, unmatched ${mapping.unmatched.length}.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
