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
import { buildPageMetadata, getLocalizedUrl } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

interface MoviePageProps {
  params: Promise<{ locale: string; imdbId: string }>;
}

export const generateMetadata = async ({
  params,
}: MoviePageProps): Promise<Metadata> => {
  const { locale: localeParam, imdbId } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const path = `/movie/${imdbId}`;

  try {
    const movie = await getMovieDetails(imdbId);
    const title = formatMessage(dictionary.meta.movieTitle, {
      title: movie.Title,
      year: movie.Year,
    });
    const description = movie.Plot || dictionary.meta.defaultDescription;
    const poster = isValidPosterUrl(movie.Poster) ? movie.Poster : undefined;

    return buildPageMetadata({
      locale,
      title,
      description,
      path,
      openGraph: {
        title: movie.Title,
        description,
        type: "video.movie",
        images: poster ? [{ url: poster, alt: movie.Title }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: movie.Title,
        description,
        images: poster ? [poster] : undefined,
      },
    });
  } catch {
    return buildPageMetadata({
      locale,
      title: dictionary.errors.notFound,
      description: dictionary.meta.defaultDescription,
      path,
    });
  }
}

const MoviePage = async ({ params }: MoviePageProps) => {
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

  const jsonLd = buildMovieJsonLd(movie, getLocalizedUrl(locale, `/movie/${imdbId}`));

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
};

export default MoviePage;
