import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  buildMovieJsonLd,
  MovieDetails,
} from "@/components/movie/MovieDetails";
import type { Locale } from "@/i18n/config";
import { formatMessage, getDictionary } from "@/i18n/get-dictionary";
import { getMovieDetails } from "@/lib/omdb/client";
import { isValidPosterUrl } from "@/lib/omdb/constants";
import { OmdbNotFoundError } from "@/lib/omdb/errors";

export const dynamic = "force-dynamic";

interface MoviePageProps {
  params: Promise<{ locale: string; imdbId: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { locale: localeParam, imdbId } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);

  try {
    const movie = await getMovieDetails(imdbId);

    return {
      title: formatMessage(dictionary.meta.movieTitle, {
        title: movie.Title,
        year: movie.Year,
      }),
      description:
        movie.Plot !== "N/A" ? movie.Plot : dictionary.meta.defaultDescription,
      openGraph: {
        title: movie.Title,
        description: movie.Plot !== "N/A" ? movie.Plot : undefined,
        images: isValidPosterUrl(movie.Poster)
          ? [{ url: movie.Poster, alt: movie.Title }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: movie.Title,
        description: movie.Plot !== "N/A" ? movie.Plot : undefined,
        images: isValidPosterUrl(movie.Poster) ? [movie.Poster] : undefined,
      },
    };
  } catch {
    return {
      title: dictionary.errors.notFound,
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { locale: localeParam, imdbId } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);

  let movie;
  try {
    movie = await getMovieDetails(imdbId);
  } catch (error) {
    if (error instanceof OmdbNotFoundError) {
      notFound();
    }
    throw error;
  }

  const jsonLd = buildMovieJsonLd(movie);

  return (
    <main
      id={`main-content-${locale}`}
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MovieDetails movie={movie} locale={locale} dictionary={dictionary} />
    </main>
  );
}
