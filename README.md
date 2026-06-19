# IMDB Movies — OMDb Search App

Aplikacja do wyszukiwania filmów i seriali z wykorzystaniem [OMDb API](https://www.omdbapi.com/). Projekt z naciskiem na type safety, SSR, dostępność (WCAG) i SEO.

## Funkcjonalności

- Wyszukiwanie filmów z filtrowaniem po roku premiery i typie (film / serial / odcinek)
- Klasyczna paginacja wyników
- Widok szczegółów filmu (tytuł, opis, gatunek, oceny, poster itp.)
- Lista ulubionych z trwałym zapisem w `localStorage`
- Dwujęzyczny interfejs (PL / EN)
- Obsługa błędów API, responsywny layout, podstawowe wymogi WCAG

## Wymagania

- Node.js 20+
- Klucz API OMDb (darmowa rejestracja na [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx))

## Uruchomienie

1. Sklonuj repozytorium i zainstaluj zależności:

```bash
npm install
```

2. Skopiuj plik env i uzupełnij klucz API (obsługiwane: `.env.local` lub `.env`):

```bash
cp .env.example .env.local
```

3. Uruchom serwer deweloperski:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000). Middleware przekieruje na `/pl` lub `/en` w zależności od języka przeglądarki.

## Skrypty

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Serwer deweloperski |
| `npm run build` | Build produkcyjny |
| `npm run start` | Uruchomienie buildu |
| `npm run lint` | ESLint |
| `npm run typecheck` | Sprawdzenie typów TypeScript |
| `npm run test` | Testy w trybie watch |
| `npm run test:run` | Testy jednorazowo |

## Stack technologiczny

| Narzędzie | Rola |
|-----------|------|
| **Next.js 16** | Framework SSR (App Router) |
| **React 19** | UI |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Stylowanie |
| **Vitest + Testing Library** | Testy jednostkowe |

Klucz API jest używany wyłącznie po stronie serwera (`lib/omdb/`), nigdy nie trafia do przeglądarki.

## Struktura projektu

```
src/
├── app/[locale]/          # Strony (PL/EN routing)
├── components/            # Komponenty UI
├── i18n/                  # Słowniki tłumaczeń
├── lib/omdb/              # Klient OMDb API
├── lib/favorites/         # Ulubione (localStorage)
└── middleware.ts          # Redirect locale
```

## Testy

```bash
npm run test:run
```

Testy obejmują klienta OMDb, storage ulubionych oraz kluczowe komponenty UI.
