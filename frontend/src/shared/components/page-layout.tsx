import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Full page layout for public pages with consistent structure
 * Includes min-height, background, and flex layout
 */
export function PageLayout({
  children,
  className,
}: Readonly<PageLayoutProps>) {
  return (
    <div className={cn(
      "min-h-screen bg-background flex flex-col",
      className
    )}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
  sticky?: boolean;
  background?: 'surface' | 'transparent';
}

/**
 * Page header with consistent styling
 */
export function PageHeader({
  children,
  className,
  bordered = false,
  sticky = false,
  background = 'transparent',
}: Readonly<PageHeaderProps>) {
  return (
    <header className={cn(
      "py-6 px-4",
      sticky && "sticky top-0 z-10 shadow-sm",
      bordered && "border-b border-border",
      background === 'surface' && "bg-muted",
      className
    )}>
      <div className="container mx-auto flex items-center justify-center">
        {children}
      </div>
    </header>
  );
}

interface PageMainProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
}

/**
 * Page main content area with consistent container and padding
 */
export function PageMain({
  children,
  className,
  centered = false,
}: Readonly<PageMainProps>) {
  return (
    <main className={cn(
      "flex-1 px-4 py-8",
      centered && "flex items-center justify-center",
      className
    )}>
      {centered ? (
        children
      ) : (
        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      )}
    </main>
  );
}

interface PageFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Page footer with consistent styling
 */
export function PageFooter({
  children,
  className,
}: Readonly<PageFooterProps>) {
  return (
    <footer className={cn(
      "py-4 text-center text-sm text-muted-foreground",
      className
    )}>
      {children}
    </footer>
  );
}