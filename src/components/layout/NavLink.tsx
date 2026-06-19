"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { interactiveLinkClassName } from "@/lib/ui/classes";

interface NavLinkProps {
  href: string;
  locale: string;
  children: React.ReactNode;
  matchPath?: "home" | "favorites";
}

export function NavLink({
  href,
  locale,
  children,
  matchPath,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    matchPath === "favorites"
      ? pathname === `/${locale}/favorites`
      : pathname === `/${locale}`;

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
