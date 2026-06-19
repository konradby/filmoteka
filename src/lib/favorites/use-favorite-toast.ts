import type { Dictionary } from "@/i18n/get-dictionary";
import { formatMessage } from "@/i18n/get-dictionary";
import type { FavoriteActionResult } from "@/lib/favorites/types";
import { useToast } from "@/lib/ui/toast/context";

export function useFavoriteToast(dictionary: Dictionary) {
  const { showToast } = useToast();

  return (result: FavoriteActionResult, title: string) => {
    if (result.ok) {
      showToast({
        variant: "success",
        message: formatMessage(
          result.action === "add"
            ? dictionary.toast.addSuccess
            : dictionary.toast.removeSuccess,
          { title },
        ),
      });
      return;
    }

    showToast({
      variant: "error",
      message: dictionary.toast.error,
    });
  };
}
