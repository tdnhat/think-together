"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface NavbarIconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: "default" | "outline";
}

export function NavbarIconButton({
  className,
  variant = "outline",
  ...props
}: NavbarIconButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      className={cn(
        "relative h-10 w-10 rounded-xl transition-colors",
        variant === "outline" &&
          "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        variant === "default" &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      {...props}
    />
  );
}

