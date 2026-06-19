import type { Locale } from "@/i18n/config";

import en from "@/i18n/dictionaries/en.json";
import pl from "@/i18n/dictionaries/pl.json";

const dictionaries = { pl, en } as const;

export type Dictionary = (typeof dictionaries)["pl"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  );
}
