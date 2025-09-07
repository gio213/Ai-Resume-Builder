import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/stripe-webhook-checkout",
  "/tos",
]);

export default clerkMiddleware(async (auth, request) => {
  const res = NextResponse.next();

  // Ensure locale cookie exists for i18n and SEO hreflang
  const localeCookie = request.cookies.get("locale");
  if (!localeCookie) {
    const acceptLang = request.headers.get("accept-language") || "";
    const preferred = acceptLang.split(",")[0]?.split("-")[0];
    const locale = preferred === "en" ? "en" : "ka";
    res.cookies.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return res;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
