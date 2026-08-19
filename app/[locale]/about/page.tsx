import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/about-page";
import { SiteHeader } from "@/components/site-header";
import { aboutPageContent } from "@/content/about-content";
import { siteContent } from "@/content/site-content";

type AboutRouteProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: AboutRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") {
    notFound();
  }

  const content = aboutPageContent.en;

  return {
    title: `${content.title} | Afana`,
    description: content.description,
    alternates: {
      canonical: "/en/about",
      languages: {
        id: "/id/tentang-kami",
        en: "/en/about",
      },
    },
  };
}

export default async function AboutRoute({ params }: AboutRouteProps) {
  const { locale } = await params;
  if (locale !== "en") {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="en" content={siteContent.en} />
      <AboutPage content={aboutPageContent.en} />
    </>
  );
}
