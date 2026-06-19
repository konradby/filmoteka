"use client";

import Image from "next/image";
import { useState } from "react";

import { isValidPosterUrl } from "@/lib/omdb/constants";

interface MoviePosterProps {
  src: string;
  alt: string;
  sizes: string;
  placeholderLabel: string;
  priority?: boolean;
  decorative?: boolean;
  imageClassName?: string;
}

export function MoviePoster({
  src,
  alt,
  sizes,
  placeholderLabel,
  priority = false,
  decorative = false,
  imageClassName = "object-cover",
}: MoviePosterProps) {
  const [failed, setFailed] = useState(false);
  const canShowImage = isValidPosterUrl(src) && !failed;

  if (!canShowImage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-surface-elevated px-4 text-center text-sm text-muted">
        {placeholderLabel}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? true : undefined}
      fill
      sizes={sizes}
      priority={priority}
      className={imageClassName}
      onError={() => setFailed(true)}
    />
  );
}
