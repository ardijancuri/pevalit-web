import { permanentRedirect } from "next/navigation";
import { localizePath } from "@/lib/localization";
import { getRouteLanguage } from "@/lib/server-language";

type Props = {
  params: Promise<{ language: string }>;
};

export default async function CorporatePage({ params }: Props) {
  const { language: languageParam } = await params;
  const language = getRouteLanguage(languageParam);

  permanentRedirect(localizePath("/corporate/about", language));
}
