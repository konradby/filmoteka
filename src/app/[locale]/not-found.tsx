import Link from "next/link";

import { defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interactiveLinkClassName } from "@/lib/ui/classes";

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
      <h1 className="text-4xl font-bold text-accent">404</h1>
      <p className="mt-2 text-muted">{dictionary.errors.notFound}</p>
      <Link
        href={`/${locale}`}
        className={`${interactiveLinkClassName} mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover`}
      >
        {dictionary.movie.backToSearch}
      </Link>
    </main>
  );
}
