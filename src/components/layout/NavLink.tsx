"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getSearchBasePath } from "@/lib/search/build-search-url";
import { interactiveLinkClassName } from "@/lib/ui/classes";

interface NavLinkProps {
  href: string;
  locale: string;
  children: React.ReactNode;
  matchPath?: "search" | "favorites";
}

export const NavLink = ({
  href,
  locale,
  children,
  matchPath,
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive =
    matchPath === "favorites"
      ? pathname === `/${locale}/favorites`
      : pathname === getSearchBasePath(locale) ||
        pathname.startsWith(`${getSearchBasePath(locale)}/`);

  return (
    <Link
      href={href}
      className={`${interactiveLinkClassName} text-muted transition-colors hover:text-accent ${
        isActive ? "text-accent" : ""
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
