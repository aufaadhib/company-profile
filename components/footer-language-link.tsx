"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getOtherLocaleHref } from "@/content/site-content";
import type { Locale } from "@/content/site-content";

type FooterLanguageLinkProps = {
  locale: Locale;
  label: string;
};

export function FooterLanguageLink({ locale, label }: FooterLanguageLinkProps) {
  const pathname = usePathname();
  const href = getOtherLocaleHref(pathname, locale);

  return (
    <Link href={href} className="text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
      {label}
    </Link>
  );
}
