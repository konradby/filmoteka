import { FavoritesList } from "@/components/favorites/FavoritesList";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);

  return (
    <main
      id={`main-content-${locale}`}
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.favorites.title}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {dictionary.favorites.subtitle}
        </p>
      </div>
      <FavoritesList locale={locale} dictionary={dictionary} />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.favorites.title,
    description: dictionary.favorites.subtitle,
  };
}
