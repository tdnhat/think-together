import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared";
import { BrandBadge, SectionContainer } from "@/shared/components";
import { ROUTES } from "@/config/routes";
import { HERO_STATS } from "./constants";

export function Hero() {
  return (
    <SectionContainer className="py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left Content */}
        <div className="space-y-6">
          <BrandBadge
            icon={<Sparkles className="h-4 w-4 fill-secondary text-secondary" />}
            variant="secondary"
          >
            Nền tảng học tập thông minh
          </BrandBadge>
          
          <h1 className="font-heading text-5xl font-bold text-foreground md:text-6xl">
            Học cùng nhau,
            <br />
            <span className="text-primary">vui hơn gấp bội!</span>
          </h1>
          
          <p className="max-w-lg text-lg text-muted-foreground">
            Tham gia cộng đồng học sinh năng động, làm bài kiểm tra thú vị, 
            theo dõi tiến trình và cạnh tranh với bạn bè trên bảng xếp hạng.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button 
              asChild
              size="lg"
              variant="default"
            >
              <Link href={ROUTES.auth.signup}>
                Bắt đầu học ngay!
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
            
            <Button
              asChild
              size="lg"
              variant="outline"
            >
              <Link href={ROUTES.public.about}>Tìm hiểu thêm</Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-8 pt-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Image */}
        <div className="relative">
          <div 
            className="relative h-[400px] overflow-hidden rounded-3xl border border-primary/20 md:h-[500px]"
          >
            <Image
              src="/images/hero-1.png"
              alt="Students learning together"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Floating decorations */}
          <div 
            className="absolute -right-6 -top-6 hidden h-28 w-28 rounded-full border border-secondary/50 bg-secondary md:block"
            aria-hidden="true"
          />
          <div 
            className="absolute -left-4 bottom-8 hidden h-20 w-20 rotate-12 rounded-2xl border border-pink-300 bg-pink-200 md:block"
            aria-hidden="true"
          />
        </div>
      </div>
    </SectionContainer>
  );
}
