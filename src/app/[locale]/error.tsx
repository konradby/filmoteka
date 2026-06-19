"use client";

import { LocaleError } from "@/components/ui/LocaleError";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { useParams } from "next/navigation";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale: string }>();
  const locale = (params.locale ?? "pl") as Locale;
  const dictionary = getDictionary(locale);

  return <LocaleError error={error} reset={reset} dictionary={dictionary} />;
}
