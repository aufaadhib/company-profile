"use client";

import { useEffect } from "react";

import { scrollToAboutSection } from "@/components/about-section-navigation";

export function AboutSectionHashSync() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollToAboutSection(hash);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) {
        window.cancelAnimationFrame(secondFrame);
      }
    };
  }, []);

  return null;
}
