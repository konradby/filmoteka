import { formatMessage, type Dictionary } from "@/i18n/get-dictionary";
import {
  getStarFillStates,
  parseImdbRating,
} from "@/lib/movie/rating";

interface StarRatingProps {
  imdbRating: string;
  dictionary: Dictionary;
  className?: string;
  showValue?: boolean;
}

function StarIcon({ state }: { state: "full" | "half" | "empty" }) {
  return (
    <span className="relative inline-block h-3.5 w-3.5" aria-hidden="true">
      <svg
        viewBox="0 0 20 20"
        className="h-3.5 w-3.5 text-border"
        fill="currentColor"
      >
        <path d="M10 1.5 12.6 7l6 0.9-4.3 4.2 1 5.9L10 15.8l-5.3 2.8 1-5.9L1.4 7.9l6-.9L10 1.5Z" />
      </svg>
      {state !== "empty" && (
        <span
          className="absolute inset-0 overflow-hidden text-accent"
          style={{ width: state === "half" ? "50%" : "100%" }}
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M10 1.5 12.6 7l6 0.9-4.3 4.2 1 5.9L10 15.8l-5.3 2.8 1-5.9L1.4 7.9l6-.9L10 1.5Z" />
          </svg>
        </span>
      )}
    </span>
  );
}

export function StarRating({
  imdbRating,
  dictionary,
  className = "",
  showValue = true,
}: StarRatingProps) {
  const rating = parseImdbRating(imdbRating);

  if (rating === null) {
    return null;
  }

  const stars = getStarFillStates(rating);
  const label = formatMessage(dictionary.a11y.imdbRating, {
    rating: rating.toFixed(1),
  });

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={label}
      title={label}
    >
      <div className="flex items-center gap-0.5">
        {stars.map((state, index) => (
          <StarIcon key={index} state={state} />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-semibold tabular-nums text-accent">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
