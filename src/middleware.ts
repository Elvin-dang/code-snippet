import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/login", "/signup"];
const nonLocaleRoutes = ["/api", "/trpc"];
const locales = ["en", "vi"];
const defaultLocale = "en";

function getLocale(request: Request) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const negotiator = new Negotiator({ headers });
  const languages = negotiator.languages();

  return match(languages, locales, defaultLocale);
}

const isPublicRoute = (pathname: string) => {
  const localePrefix = `/${locales.find((l) => pathname.startsWith(`/${l}/`))}`;
  const pathWithoutLocale = localePrefix ? pathname.replace(localePrefix, "") : pathname;

  return publicRoutes.some((route) => pathWithoutLocale.startsWith(route));
};

function detectLocale(path: string) {
  const found = locales.find((l) => path.startsWith(`/${l}`));
  return found || defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (token && isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL(`/${detectLocale(pathname)}/login`, request.url));
  }

  if (nonLocaleRoutes.some((route) => pathname.startsWith(route))) {
    return;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    //Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
