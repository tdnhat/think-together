'use client';

import { Search, Bell, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export function DashboardNavbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b-4 border-black bg-white">
      <div className="flex h-full w-full items-center justify-between gap-6 px-6">
        <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GraduationCap className="w-8 h-8 text-[#00A8E8]" />
            <span className="text-xl font-heading font-semibold">ThinkTogether</span>
          </Link>

        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm bộ câu hỏi..."
              className="h-10 w-full rounded-xl border-2 border-black pl-12 pr-4 shadow-[3px_3px_0_#FFE066] transition-all focus:shadow-[4px_4px_0_#FFE066] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-white shadow-[3px_3px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-[#FFE066] text-xs font-bold">
              3
            </span>
          </button>

          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-[#00A8E8] text-sm font-bold text-white shadow-[3px_3px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000]"
          >
            ND
          </Link>
        </div>
      </div>
    </header>
  );
}
