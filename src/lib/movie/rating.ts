export function parseImdbRating(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const rating = Number.parseFloat(value);

  if (Number.isNaN(rating) || rating <= 0) {
    return null;
  }

  return Math.min(rating, 10);
}

export function getStarFillStates(
  rating10: number,
): Array<"full" | "half" | "empty"> {
  const rating5 = (rating10 / 10) * 5;

  return Array.from({ length: 5 }, (_, index) => {
    const diff = rating5 - index;

    if (diff >= 1) {
      return "full";
    }

    if (diff >= 0.5) {
      return "half";
    }

    return "empty";
  });
}
