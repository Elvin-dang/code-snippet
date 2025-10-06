import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { getToken } from "next-auth/jwt";
import { locales, defaultLocale, detectLocale } from "@/lib/utils";

const publicRoutes = ["/snippets", "/tags", "users"];
const authRoutes = ["/login", "/signup"];
const privateRoutes = ["/snippets/new", "/snippets/edit"];
const nonLocaleRoutes = ["/api", "/trpc"];

function getLocale(request: Request) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const negotiator = new Negotiator({ headers });
  const languages = negotiator.languages();

  return match(languages, locales, defaultLocale);
}

const routeMatches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname.startsWith(route));

const isPrivateRoute = (pathname: string) =>
  privateRoutes.some((route) => {
    if (route === "/snippets/new") return pathname === route;
    if (route === "/snippets/edit") return /\/snippets\/[^/]+\/edit/.test(pathname);
    return pathname.startsWith(route);
  });

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (nonLocaleRoutes.some((r) => pathname.startsWith(r))) return;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const cookieLang = request.cookies.get("lang")?.value;
    const locale = cookieLang && locales.includes(cookieLang) ? cookieLang : getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${searchParams ? `?${searchParams}` : ""}`, request.url)
    );
  }

  const locale = detectLocale(pathname, locales, defaultLocale);
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  if (token && routeMatches(pathWithoutLocale, authRoutes)) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (
    !routeMatches(pathWithoutLocale, privateRoutes) &&
    !routeMatches(pathWithoutLocale, publicRoutes)
  ) {
    if (token && pathWithoutLocale === "/")
      return NextResponse.redirect(new URL(`/snippets`, request.url));
    return;
  }

  if (!token && isPrivateRoute(pathWithoutLocale)) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return;
}

export const config = {
  matcher: [
    //Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
