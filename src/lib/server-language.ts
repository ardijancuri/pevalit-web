import { cookies } from "next/headers";
import { LANGUAGE_COOKIE_NAME, resolveLanguage } from "@/lib/localization";

export async function getCurrentLanguage() {
  const cookieStore = await cookies();
  return resolveLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);
}
