"use client";

import { useLayoutEffect } from "react";

import { scrollToAboutSection } from "@/components/about-section-navigation";

export function AboutSectionHashSync() {
  useLayoutEffect(() => {
    if (window.location.hash) {
      scrollToAboutSection(window.location.hash);
    }
  }, []);

  return null;
}
