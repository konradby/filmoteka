<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Zmienne środowiskowe

Każda nowa zmienna (`process.env.*`) musi być od razu dodana do `.env.example` z krótkim komentarzem (cel, wymagana/opcjonalna, domyślna wartość). Nie commituj `.env` ani `.env.local`.
