import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "./i18n";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Если это корень "/", показываем ARM, но НЕ делаем redirect
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/arm";
    return NextResponse.rewrite(url); // ВАЖНО: rewrite, а не redirect
  }

  // 2. Все остальные локали работают как обычно
  return createMiddleware({
    locales,
    defaultLocale: "arm",
    localeDetection: false,
  })(request);
}

export const config = {
  // Обрабатываем корень и локали
  matcher: ["/", "/(ru|en|arm)/:path*"],
};
