export type FavoriteAction = "add" | "remove";

export interface FavoriteMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export type FavoriteActionResult =
  | { ok: true; action: FavoriteAction }
  | { ok: false; action: FavoriteAction };
