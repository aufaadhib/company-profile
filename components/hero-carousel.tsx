"use client";

import Image from "next/image";
import { A11y, Autoplay, EffectFade, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { usePrefersReducedMotion } from "@/components/use-prefers-reduced-motion";
import type { HeroSlide, SiteContent } from "@/content/site-content";

type HeroCarouselProps = {
  slides: HeroSlide[];
  content: SiteContent;
};

export function HeroCarousel({ slides, content }: HeroCarouselProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="hero" className="hero-carousel relative h-[100svh] min-h-[100svh] overflow-hidden bg-[var(--ink)] text-white lg:min-h-[40rem]">
      <Swiper
        modules={[A11y, Autoplay, EffectFade, Keyboard, Pagination]}
        id="hero-copy"
        key={reducedMotion ? "reduced-motion" : "autoplay"}
        className="absolute inset-0 z-10 h-full w-full"
        wrapperClass="h-full"
        rewind
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1200}
        keyboard={{ enabled: true }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            const label = slides[index].eyebrow.replace("AFANA / ", "").replace("Afana / ", "");
            return `<button type="button" class="${className} hero-pagination__bullet" aria-label="${content.slideLabel} ${index + 1}: ${label}"><span class="hero-pagination__label"><span class="hero-pagination__dot" aria-hidden="true"></span><span>${label}</span></span><span class="hero-pagination__line" aria-hidden="true"></span></button>`;
          },
        }}
        autoplay={{ enabled: !reducedMotion, delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: false }}
        a11y={{
          prevSlideMessage: content.previousLabel,
          nextSlideMessage: content.nextLabel,
          paginationBulletMessage: `${content.slideLabel} {{index}}`,
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative !flex h-full items-center justify-center overflow-hidden px-6 pb-40 pt-36 text-center sm:px-10 sm:pb-44 lg:px-20">
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="100vw"
              loading="eager"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,30,42,.58)_0%,rgba(2,116,151,.15)_38%,rgba(1,30,40,.72)_100%)]" />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(0,39,53,.74)_0%,rgba(0,77,101,.16)_54%,rgba(0,160,207,.12)_100%)]" />
            <span className="sr-only">Slide {index + 1} of {slides.length}</span>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="pointer-events-none absolute inset-0 z-20 flex items-end px-6 pb-36 pt-28 sm:px-10 sm:pb-40 lg:px-20 lg:pb-44 lg:pt-36">
        <div className="min-w-0 max-w-3xl flex-1 text-left">
          <p className="hero-eyebrow mb-4 text-white/80">
            {content.slides[0].eyebrow}
          </p>
          <h1 className="hero-title max-w-3xl text-white">
            {content.heroTitle}
          </h1>
          <p className="hero-description mt-5 max-w-2xl text-white/90">
            {content.heroDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
