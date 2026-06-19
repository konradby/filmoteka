"use client";

import { useEffect } from "react";

import type { Locale } from "@/i18n/config";

interface LocaleHtmlLangProps {
  locale: Locale;
}

export function LocaleHtmlLang({ locale }: LocaleHtmlLangProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
