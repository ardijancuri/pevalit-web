#!/usr/bin/env python
from __future__ import annotations

import argparse
import hashlib
import io
import json
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
CATALOGS_JSON = ROOT / "src" / "content" / "en" / "catalogs.json"
TEXT_OUTPUT_ROOT = ROOT / "src" / "content" / "en" / "catalog-extracted"
IMAGE_OUTPUT_ROOT = ROOT / "public" / "images" / "catalog-extracted"


@dataclass
class ExtractConfig:
    min_width: int
    min_height: int
    clean: bool


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract page text and reusable images from catalog PDFs."
    )
    parser.add_argument(
        "--slug",
        action="append",
        help="Catalog slug to extract (repeat for multiple). Default: catalog-en",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Extract all catalogs from src/content/en/catalogs.json",
    )
    parser.add_argument(
        "--min-width",
        type=int,
        default=300,
        help="Minimum extracted image width in pixels (default: 300)",
    )
    parser.add_argument(
        "--min-height",
        type=int,
        default=200,
        help="Minimum extracted image height in pixels (default: 200)",
    )
    parser.add_argument(
        "--no-clean",
        action="store_true",
        help="Do not delete existing output folders before extraction",
    )
    return parser.parse_args()


def load_catalogs() -> list[dict[str, Any]]:
    data = json.loads(CATALOGS_JSON.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("catalogs.json must contain an array")
    return data


def normalize_text(raw: str) -> str:
    lines = [line.strip() for line in raw.splitlines()]
    lines = [line for line in lines if line]
    return "\n".join(lines)


def get_image_size(blob: bytes) -> tuple[int, int] | None:
    try:
        with Image.open(io.BytesIO(blob)) as image:
            return image.size
    except Exception:
        return None


def ensure_directory(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def extract_catalog(catalog: dict[str, Any], config: ExtractConfig) -> dict[str, Any]:
    slug = catalog["slug"]
    source_file_url: str = catalog["fileUrl"]
    source_pdf = ROOT / "public" / source_file_url.lstrip("/")
    if not source_pdf.exists():
        raise FileNotFoundError(f"Missing source PDF for {slug}: {source_pdf}")

    image_dir = IMAGE_OUTPUT_ROOT / slug
    if config.clean and image_dir.exists():
        shutil.rmtree(image_dir)
    ensure_directory(image_dir)
    ensure_directory(TEXT_OUTPUT_ROOT)

    doc = fitz.open(source_pdf)
    image_by_hash: dict[str, dict[str, Any]] = {}
    pages: list[dict[str, Any]] = []

    for page_index, page in enumerate(doc, start=1):
        page_text = normalize_text(page.get_text("text"))
        page_image_refs: list[dict[str, Any]] = []
        seen_page_images: set[str] = set()

        for image_info in page.get_images(full=True):
            xref = image_info[0]
            extracted = doc.extract_image(xref)
            blob: bytes | None = extracted.get("image")
            ext: str = extracted.get("ext", "png")
            if not blob:
                continue

            dimensions = get_image_size(blob)
            if not dimensions:
                continue
            width, height = dimensions
            if width < config.min_width or height < config.min_height:
                continue

            digest = hashlib.sha1(blob).hexdigest()
            if digest not in image_by_hash:
                filename = f"img-{len(image_by_hash) + 1:04d}-{digest[:10]}.{ext}"
                target_path = image_dir / filename
                target_path.write_bytes(blob)
                image_by_hash[digest] = {
                    "file": f"/images/catalog-extracted/{slug}/{filename}",
                    "width": width,
                    "height": height,
                }

            image_ref = image_by_hash[digest]
            ref_key = image_ref["file"]
            if ref_key in seen_page_images:
                continue
            seen_page_images.add(ref_key)
            page_image_refs.append(image_ref)

        pages.append(
            {
                "page": page_index,
                "text": page_text,
                "images": page_image_refs,
            }
        )

    payload = {
        "slug": slug,
        "title": catalog["title"],
        "sourcePdf": source_file_url,
        "pageCount": len(pages),
        "imageCount": len(image_by_hash),
        "filters": {
            "minWidth": config.min_width,
            "minHeight": config.min_height,
        },
        "pages": pages,
    }
    output_json = TEXT_OUTPUT_ROOT / f"{slug}.json"
    output_json.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding="utf-8")

    return {
        "slug": slug,
        "sourcePdf": source_file_url,
        "outputJson": str(output_json.relative_to(ROOT)).replace("\\", "/"),
        "imageDir": str(image_dir.relative_to(ROOT)).replace("\\", "/"),
        "pageCount": payload["pageCount"],
        "imageCount": payload["imageCount"],
        "filters": payload["filters"],
    }


def main() -> None:
    args = parse_args()
    catalogs = load_catalogs()
    by_slug = {item["slug"]: item for item in catalogs}

    if args.all:
        selected_slugs = [item["slug"] for item in catalogs]
    elif args.slug:
        selected_slugs = args.slug
    else:
        selected_slugs = ["catalog-en"]

    missing = [slug for slug in selected_slugs if slug not in by_slug]
    if missing:
        raise ValueError(f"Unknown catalog slug(s): {', '.join(missing)}")

    config = ExtractConfig(
        min_width=args.min_width,
        min_height=args.min_height,
        clean=not args.no_clean,
    )

    summaries: list[dict[str, Any]] = []
    for slug in selected_slugs:
        summary = extract_catalog(by_slug[slug], config)
        summaries.append(summary)
        print(
            f"Extracted {slug}: pages={summary['pageCount']}, "
            f"images={summary['imageCount']} -> {summary['outputJson']}"
        )

    index_payload = {
        "generatedBy": "scripts/extract-catalog-content.py",
        "catalogs": summaries,
    }
    index_path = TEXT_OUTPUT_ROOT / "index.json"
    index_path.write_text(json.dumps(index_payload, ensure_ascii=True, indent=2), encoding="utf-8")
    print(f"Wrote index: {index_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
