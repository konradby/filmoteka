import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppProviders } from "@/components/providers/AppProviders";
import { FavoriteButton } from "@/components/movie/FavoriteButton";
import { getDictionary } from "@/i18n/get-dictionary";
import { resetFavoritesStoreForTests } from "@/lib/favorites/context";

const movie = {
  imdbID: "tt0372784",
  Title: "Batman Begins",
  Year: "2005",
  Poster: "N/A",
  Type: "movie",
};

function renderFavoriteButton() {
  const dictionary = getDictionary("en");

  return render(
    <AppProviders dictionary={dictionary}>
      <FavoriteButton movie={movie} dictionary={dictionary} />
    </AppProviders>,
  );
}

describe("FavoriteButton", () => {
  beforeEach(() => {
    localStorage.clear();
    resetFavoritesStoreForTests();
  });

  it("toggles favorite state and aria-pressed", async () => {
    const user = userEvent.setup();
    renderFavoriteButton();

    const button = screen.getByRole("button", {
      name: "Toggle favorite for Batman Begins",
    });

    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent("Remove from favorites");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("shows success toast when favorite is added", async () => {
    const user = userEvent.setup();
    renderFavoriteButton();

    await user.click(
      screen.getByRole("button", {
        name: "Toggle favorite for Batman Begins",
      }),
    );

    expect(
      screen.getByText('Added “Batman Begins” to favorites.'),
    ).toBeInTheDocument();
  });

  it("shows error toast when saving fails", async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Quota exceeded");
    });

    renderFavoriteButton();

    await user.click(
      screen.getByRole("button", {
        name: "Toggle favorite for Batman Begins",
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not save your change. Please try again.",
    );

    setItemSpy.mockRestore();
  });
});
