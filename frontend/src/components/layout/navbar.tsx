'use client';

import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GraduationCap className="w-8 h-8 text-[#00A8E8]" />
            <span className="text-xl font-heading font-bold">ThinkTogether</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              Trang chủ
            </Link>
            <Link href="/quiz" className="hover:opacity-70 transition-opacity">
              Bộ câu hỏi
            </Link>
            <Link href="/leaderboard" className="hover:opacity-70 transition-opacity">
              Bảng xếp hạng
            </Link>
            <Link href="/about" className="hover:opacity-70 transition-opacity">
              Giới thiệu
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              asChild
              variant="outline" 
              className="border-2 border-black rounded-xl hover-brutal-push shadow-brutal-sm"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button 
              asChild
              className="border-2 border-black rounded-xl hover-brutal-push text-white shadow-brutal-sm"
              style={{ backgroundColor: '#00A8E8' }}
            >
              <Link href="/signup">Đăng ký</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-black">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="hover:opacity-70 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                href="/quiz" 
                className="hover:opacity-70 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bộ câu hỏi
              </Link>
              <Link 
                href="/leaderboard" 
                className="hover:opacity-70 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bảng xếp hạng
              </Link>
              <Link 
                href="/about" 
                className="hover:opacity-70 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  asChild
                  variant="outline" 
                  className="border-2 border-black rounded-xl shadow-brutal-sm"
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button 
                  asChild
                  className="border-2 border-black rounded-xl text-white shadow-brutal-sm"
                  style={{ backgroundColor: '#00A8E8' }}
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
