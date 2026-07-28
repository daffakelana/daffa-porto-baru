"use client";

import { type LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "small";
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const baseStyles = "inline-flex items-center justify-center gap-1 label-3 transition-all";

  const variantStyles = {
    primary: `
      py-2 px-4 rounded-lg
      bg-[var(--primary-base)] text-white
      hover:bg-[var(--primary-strong)]
      active:bg-[var(--primary-strong)] active:ring-2 active:ring-[var(--primary-soft)] active:ring-offset-0
    `,
    small: `
      py-1 px-2 rounded-md
      bg-[var(--background-color-white)] text-[var(--text-color-default)]
      border border-[var(--divider-color)]
      hover:bg-[var(--background-color-hover)]
      active:bg-[var(--background-color-hover)] active:border-[var(--divider-color)] active:border-2
    `,
  };

  const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className} cursor-pointer`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <>
          {LeftIcon && <LeftIcon size={variant === "small" ? 14 : 16} />}
          {children}
          {RightIcon && <RightIcon size={variant === "small" ? 14 : 16} />}
        </>
      )}
    </button>
  );
}
