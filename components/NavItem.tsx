"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href?: string;
  children?: React.ReactNode;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  className?: string;
  onClick?: () => void;
  size?: number;
  active?: boolean;
  target?: string;
  rel?: string;
}

// Cocokkan href dengan halaman aktif. Home ("/") harus persis,
// route lain aktif juga untuk sub-halamannya (mis. /blog/xxx).
function useIsActive(href?: string) {
  const pathname = usePathname();

  if (!href || !href.startsWith("/")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavItem({
  href,
  children,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  onClick,
  size,
  active,
  target,
  rel
}: NavItemProps) {
  const routeActive = useIsActive(href);
  const isActive = active ?? routeActive;

  const baseStyles = "inline-flex items-center justify-center gap-1 label-3 transition-colors py-1 pl-2.5 pr-2 rounded-md";
  const hoverStyles = "hover:bg-[var(--background-color-hover)]";
  const activeStyles = isActive ? "bg-[var(--background-color-hover)]" : "";
  const textColor = "text-[var(--text-color-default)]";

  const content = (
    <>
      {LeftIcon && <LeftIcon size={size ? size : 16} />}
      {children}
      {RightIcon && <RightIcon size={size ? size : 16} />}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        aria-current={isActive ? "page" : undefined}
        className={`${baseStyles} ${hoverStyles} ${activeStyles} ${textColor} ${className}`}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button className={`${baseStyles} ${hoverStyles} ${activeStyles} ${textColor} ${className}`} onClick={onClick}>
      {content}
    </button>
  );
}
