"use client";

import type { Dictionary } from "@/i18n/get-dictionary";
import { FavoritesProvider } from "@/lib/favorites/context";
import { ToastProvider } from "@/lib/ui/toast/context";

export const AppProviders = ({
  children,
  dictionary,
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
}) => {
  return (
    <ToastProvider dismissLabel={dictionary.a11y.dismissToast}>
      <FavoritesProvider>{children}</FavoritesProvider>
    </ToastProvider>
  );
}
