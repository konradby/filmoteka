import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "@/components/search/Pagination";
import { getDictionary } from "@/i18n/get-dictionary";

describe("Pagination", () => {
  const dictionary = getDictionary("en");

  it("renders page info and navigation links", () => {
    render(
      <Pagination
        locale="en"
        dictionary={dictionary}
        currentPage={2}
        totalPages={5}
        query="batman"
      />,
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/en?q=batman",
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/en?q=batman&page=3",
    );
  });

  it("preserves year and type filters in links", () => {
    render(
      <Pagination
        locale="pl"
        dictionary={dictionary}
        currentPage={1}
        totalPages={3}
        query="batman"
        year="2008"
        type="movie"
      />,
    );

    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/pl?q=batman&year=2008&type=movie&page=2",
    );
  });

  it("hides pagination when only one page exists", () => {
    const { container } = render(
      <Pagination
        locale="en"
        dictionary={dictionary}
        currentPage={1}
        totalPages={1}
        query="batman"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
