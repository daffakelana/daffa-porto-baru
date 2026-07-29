"use client";

import { type LucideIcon } from "lucide-react";

interface ButtonSecondaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  isLoading?: boolean;
}

export function ButtonSecondary({
  children,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonSecondaryProps) {
  const isDisabled = disabled || isLoading;

  const baseStyles =
    "inline-flex items-center justify-center gap-1.5 label-3 transition-all py-2 px-4 rounded-lg";

  const variantStyles = `
    bg-[var(--background-color-white)] text-[var(--text-color-default)]
    border border-[var(--divider-color)]
    hover:bg-[var(--background-color-hover)]
    active:bg-[var(--background-color-hover)]
    active:ring-2 active:ring-[var(--divider-color)] active:ring-offset-0
  `;

  const disabledStyles = isDisabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <>
          {LeftIcon && <LeftIcon size={16} />}
          {children}
          {RightIcon && <RightIcon size={16} />}
        </>
      )}
    </button>
  );
}