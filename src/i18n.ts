import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Determine the locale from cookies, headers, or other methods
  const cookieStore = cookies();
  const localeCookie = (await cookieStore).get("locale");
  const defaultLocale = "ka";
  const supportedLocales = ["en", "ka"];

  let locale = defaultLocale;

  if (localeCookie && supportedLocales.includes(localeCookie.value)) {
    locale = localeCookie.value;
  } else {
    const acceptLanguage = (await cookieStore).get("Accept-Language");
    if (acceptLanguage) {
      const preferredLocales = acceptLanguage.value
        .split(",")
        .map((lang) => lang.split(";")[0]);
      locale =
        preferredLocales.find((lang) => supportedLocales.includes(lang)) ||
        defaultLocale;
    }
  }

  // Load the messages for the determined locale
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
