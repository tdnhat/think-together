import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BrandBadge, SectionContainer } from "@/components/shared";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <SectionContainer className="py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left Content */}
        <div className="space-y-6">
          <BrandBadge 
            icon={<Sparkles className="h-4 w-4 fill-[var(--brand-secondary)] text-[var(--brand-secondary)]" />}
            variant="secondary"
          >
            Nền tảng học tập thông minh
          </BrandBadge>
          
          <h1 className="font-heading text-5xl font-bold text-[var(--text-primary)] md:text-6xl">
            Học cùng nhau,
            <br />
            <span className="text-[var(--brand-primary)]">vui hơn gấp bội!</span>
          </h1>
          
          <p className="max-w-lg text-lg text-[var(--text-secondary)]">
            Tham gia cộng đồng học sinh năng động, làm bài kiểm tra thú vị, 
            theo dõi tiến trình và cạnh tranh với bạn bè trên bảng xếp hạng.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button 
              asChild
              size="lg"
              variant="secondary"
              className="rounded-xl text-lg shadow-brutal"
            >
              <Link href="/signup">
                Bắt đầu học ngay!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl text-lg shadow-brutal-secondary"
            >
              <Link href="/about">Tìm hiểu thêm</Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-8 pt-4">
            <div>
              <div className="font-heading text-3xl font-bold text-[var(--brand-primary)]">5,000+</div>
              <div className="text-[var(--text-secondary)]">Học sinh</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-[var(--brand-primary)]">10,000+</div>
              <div className="text-[var(--text-secondary)]">Câu hỏi</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-[var(--brand-primary)]">98%</div>
              <div className="text-[var(--text-secondary)]">Hài lòng</div>
            </div>
          </div>
        </div>
        
        {/* Right Image */}
        <div className="relative">
          <div 
            className="relative h-[400px] overflow-hidden rounded-3xl border-4 border-[var(--color-border-main)] shadow-brutal-secondary-xl md:h-[500px]"
          >
            <Image
              src="/images/hero-1.png"
              alt="Students learning together"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Floating decoration */}
          <div 
            className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-full border-4 border-[var(--color-border-main)] bg-[var(--brand-secondary)] md:block"
            aria-hidden="true"
          />
        </div>
      </div>
    </SectionContainer>
  );
}
