"use client";

import Image from "next/image";
import { useState } from "react";

import { isValidPosterUrl, POSTER_PLACEHOLDER_SRC } from "@/lib/omdb/constants";

interface MoviePosterProps {
  src: string;
  alt: string;
  sizes: string;
  placeholderLabel: string;
  priority?: boolean;
  decorative?: boolean;
  imageClassName?: string;
}

export const MoviePoster = ({
  src,
  alt,
  sizes,
  placeholderLabel,
  priority = false,
  decorative = false,
  imageClassName = "object-cover",
}: MoviePosterProps) => {
  const [failed, setFailed] = useState(false);
  const canShowImage = isValidPosterUrl(src) && !failed;

  if (!canShowImage) {
    return (
      <Image
        src={POSTER_PLACEHOLDER_SRC}
        alt={decorative ? "" : placeholderLabel}
        aria-hidden={decorative ? true : undefined}
        fill
        sizes={sizes}
        priority={priority}
        className={`${imageClassName} bg-surface-elevated`}
      />
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
