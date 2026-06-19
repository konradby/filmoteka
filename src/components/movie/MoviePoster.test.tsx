import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MoviePoster } from "@/components/movie/MoviePoster";
import { getDictionary } from "@/i18n/get-dictionary";

describe("MoviePoster", () => {
  const dictionary = getDictionary("en");

  it("shows placeholder when poster url is missing", () => {
    render(
      <div className="relative aspect-[2/3] w-40">
        <MoviePoster
          src=""
          alt="Test movie poster"
          sizes="160px"
          placeholderLabel={dictionary.movie.noPoster}
        />
      </div>,
    );

    expect(screen.getByText("No poster available")).toBeInTheDocument();
  });

  it("shows placeholder when image fails to load", async () => {
    render(
      <div className="relative aspect-[2/3] w-40">
        <MoviePoster
          src="https://example.com/broken-poster.jpg"
          alt="Test movie poster"
          sizes="160px"
          placeholderLabel={dictionary.movie.noPoster}
        />
      </div>,
    );

    const image = screen.getByRole("img", { name: "Test movie poster" });

    await act(async () => {
      fireEvent.error(image);
    });

    expect(screen.getByText("No poster available")).toBeInTheDocument();
  });
});
