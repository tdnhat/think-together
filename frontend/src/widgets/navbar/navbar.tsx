"use client";

import Link from "next/link";
import { useState } from "react";

import { GraduationCap, Menu, X } from "lucide-react";

import { Button } from "@/shared";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-[var(--color-border-main)] bg-[var(--bg-page)]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <GraduationCap className="h-8 w-8 text-[var(--brand-primary)]" />
            <span className="text-xl font-heading font-bold text-[var(--text-primary)]">ThinkTogether</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 text-[var(--text-secondary)] md:flex">
            <Link href="/" className="transition-opacity hover:opacity-70">
              Trang chủ
            </Link>
            <Link href="/quiz" className="transition-opacity hover:opacity-70">
              Bộ câu hỏi
            </Link>
            <Link href="/leaderboard" className="transition-opacity hover:opacity-70">
              Bảng xếp hạng
            </Link>
            <Link href="/about" className="transition-opacity hover:opacity-70">
              Giới thiệu
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button 
              asChild
              variant="outline" 
              className="rounded-xl shadow-brutal-sm"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button 
              asChild
              variant="primary"
              className="rounded-xl shadow-brutal-sm"
            >
              <Link href="/signup">Đăng ký</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            type="button"
            variant="ghost"
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
          <div className="border-t-2 border-[var(--color-border-main)] py-4 md:hidden">
            <div className="flex flex-col gap-4 text-[var(--text-secondary)]">
              <Link 
                href="/" 
                className="transition-opacity hover:opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                href="/quiz" 
                className="transition-opacity hover:opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bộ câu hỏi
              </Link>
              <Link 
                href="/leaderboard" 
                className="transition-opacity hover:opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bảng xếp hạng
              </Link>
              <Link 
                href="/about" 
                className="transition-opacity hover:opacity-70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  asChild
                  variant="outline" 
                  className="rounded-xl shadow-brutal"
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button 
                  asChild
                  variant="primary"
                  className="rounded-xl shadow-brutal"
                >
                  <Link href="/signup">Đăng ký</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
