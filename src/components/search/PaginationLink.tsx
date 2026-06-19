"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";

import type { Dictionary } from "@/i18n/get-dictionary";
import { interactiveLinkClassName } from "@/lib/ui/classes";

interface PaginationLinkProps {
  href: string;
  dictionary: Dictionary;
  rel?: "prev" | "next";
  children: React.ReactNode;
}

export function PaginationLink({
  href,
  dictionary,
  rel,
  children,
}: PaginationLinkProps) {
  return (
    <Link
      href={href}
      rel={rel}
      className={`${interactiveLinkClassName} inline-flex min-h-10 min-w-[7.5rem] items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent`}
    >
      <PaginationLinkLabel dictionary={dictionary}>
        {children}
      </PaginationLinkLabel>
    </Link>
  );
}

function PaginationLinkLabel({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const { pending } = useLinkStatus();

  if (pending) {
    return (
      <span className="inline-flex items-center gap-2 text-accent">
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent"
        />
        <span>{dictionary.search.loading}</span>
      </span>
    );
  }

  return <>{children}</>;
}
