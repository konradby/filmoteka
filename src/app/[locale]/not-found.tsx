import Link from "next/link";

import { defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) {
  const resolvedParams = params ? await params : undefined;
  const locale = (resolvedParams?.locale ?? defaultLocale) as Locale;
  const dictionary = getDictionary(locale);

  return (
    <main className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {dictionary.errors.notFound}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-6 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        {dictionary.movie.backToSearch}
      </Link>
    </main>
  );
}
