import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { FavoriteButton } from "@/components/movie/FavoriteButton";
import { getDictionary } from "@/i18n/get-dictionary";
import { FavoritesProvider, resetFavoritesStoreForTests } from "@/lib/favorites/context";

const movie = {
  imdbID: "tt0372784",
  Title: "Batman Begins",
  Year: "2005",
  Poster: "N/A",
  Type: "movie",
};

function renderFavoriteButton() {
  return render(
    <FavoritesProvider>
      <FavoriteButton movie={movie} dictionary={getDictionary("en")} />
    </FavoritesProvider>,
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
});
