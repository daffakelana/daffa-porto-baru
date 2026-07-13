"use client";

// Dropdown bergaya shadcn: dibangun di atas Radix, tapi memakai token warna
// (--background-color-white, --divider-color, dll) dan utility tipografi (label-3)
// milik project ini. Animasi buka/tutup didefinisikan di globals.css.

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-lg border p-1 shadow-lg",
        "bg-[var(--background-color-white)] text-[var(--text-color-default)]",
        "data-[state=open]:animate-[dropdown-in_150ms_ease-out]",
        "data-[state=closed]:animate-[dropdown-out_120ms_ease-in]",
        className
      )}
      style={{
        borderColor: "var(--divider-color)",
        transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
      }}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  active?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, active, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "label-3 relative flex cursor-pointer select-none items-center justify-between gap-4 rounded-md px-2 py-1.5 outline-none transition-colors",
      "focus:bg-[var(--background-color-hover)] data-[highlighted]:bg-[var(--background-color-hover)]",
      className
    )}
    style={{ color: active ? "var(--primary-strong)" : "var(--text-color-default)" }}
    {...props}
  >
    {children}
    {active && <Check size={16} style={{ color: "var(--primary-strong)" }} />}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
