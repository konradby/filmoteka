import { RESULTS_PER_PAGE } from "@/lib/omdb/constants";

export const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const interactiveLinkClassName = `cursor-pointer ${focusRingClassName}`;

export const interactiveButtonClassName = `cursor-pointer ${focusRingClassName}`;

export const interactiveInputClassName = `cursor-text ${focusRingClassName}`;

export const interactiveSelectClassName = `cursor-pointer ${focusRingClassName}`;

export const movieGridClassName =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

export const MOVIE_GRID_SIZE = RESULTS_PER_PAGE;
