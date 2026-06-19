import Image from "next/image";

import type { Dictionary } from "@/i18n/get-dictionary";

interface LandingHeroProps {
  dictionary: Dictionary;
  children: React.ReactNode;
}

const featureKeys = ["titles", "details", "favorites"] as const;

export function LandingHero({ dictionary, children }: LandingHeroProps) {
  return (
    <section className="relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden">
      <Image
        src="/landing-hero-bg.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/82 to-background"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,197,24,0.12),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-4xl flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent backdrop-blur-sm">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {dictionary.landing.eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance text-foreground drop-shadow-sm sm:text-6xl">
            {dictionary.landing.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            {dictionary.landing.subtitle}
          </p>
        </div>

        <div className="mt-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-surface/55 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-5">
          {children}
          <p className="mt-4 text-center text-sm text-muted">
            {dictionary.landing.hint}
          </p>
        </div>

        <ul className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {featureKeys.map((key) => (
            <li
              key={key}
              className="rounded-xl border border-border/60 bg-surface/40 px-4 py-3 text-center backdrop-blur-sm"
            >
              <p className="text-sm font-semibold text-foreground">
                {dictionary.landing.features[key].title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {dictionary.landing.features[key].description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
