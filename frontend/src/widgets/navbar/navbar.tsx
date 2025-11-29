"use client";

import Link from "next/link";
import { useState } from "react";

import { GraduationCap, Menu, X } from "lucide-react";

import { Button } from "@/shared";
import { Separator } from "@/shared/ui/separator";
import { useAuth } from "@/features/auth";
import { ROUTES } from "@/config/routes";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 relative bg-[var(--bg-page)]/95 backdrop-blur">
      <Separator className="absolute bottom-0 left-0 right-0" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <GraduationCap className="h-8 w-8 text-[var(--brand-primary)]" />
            <span className="text-xl font-heading font-bold text-[var(--text-primary)]">ThinkTogether</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 text-[var(--text-secondary)] md:flex">
            <Link href={ROUTES.public.home} className="transition-opacity hover:opacity-70">
              Trang chủ
            </Link>
            <Link href={ROUTES.quiz.browse} className="transition-opacity hover:opacity-70">
              Bộ câu hỏi
            </Link>
            <Link href={ROUTES.leaderboard} className="transition-opacity hover:opacity-70">
              Bảng xếp hạng
            </Link>
            <Link href={ROUTES.public.about} className="transition-opacity hover:opacity-70">
              Giới thiệu
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <Button
                asChild
                variant="default"
                className="rounded-xl"
              >
                <Link href={ROUTES.dashboard.home}>Vào ứng dụng</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="neutral"
                  className="rounded-xl"
                >
                  <Link href={ROUTES.auth.login}>Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="rounded-xl"
                >
                  <Link href={ROUTES.auth.signup}>Đăng ký</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            type="button"
            variant="neutral"
            size="icon"
            className="md:hidden rounded-xl border-none bg-transparent p-2 text-[var(--text-primary)] shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-[var(--bg-surface)] hover:shadow-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="py-4 md:hidden">
            <Separator className="mb-4" />
            <div className="flex flex-col gap-4 text-[var(--text-secondary)]">
              <Link
                href={ROUTES.public.home}
                className="transition-opacity hover:opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href={ROUTES.quiz.browse}
                className="transition-opacity hover:opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bộ câu hỏi
              </Link>
              <Link
                href={ROUTES.leaderboard}
                className="transition-opacity hover:opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bảng xếp hạng
              </Link>
              <Link
                href={ROUTES.public.about}
                className="transition-opacity hover:opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated ? (
                  <Button
                    asChild
                    variant="default"
                    className="rounded-xl"
                  >
                    <Link href={ROUTES.dashboard.home} onClick={() => setMobileMenuOpen(false)}>
                      Vào ứng dụng
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="neutral"
                      className="rounded-xl"
                    >
                      <Link href={ROUTES.auth.login} onClick={() => setMobileMenuOpen(false)}>Đăng nhập</Link>
                    </Button>
                    <Button
                      asChild
                      variant="default"
                      className="rounded-xl"
                    >
                      <Link href={ROUTES.auth.signup} onClick={() => setMobileMenuOpen(false)}>Đăng ký</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
