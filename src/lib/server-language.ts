import { notFound } from "next/navigation";
import { isLanguageCode, type LanguageCode } from "@/lib/localization";

export function getRouteLanguage(value: string): LanguageCode {
  if (!isLanguageCode(value)) {
    notFound();
  }

  return value;
}
