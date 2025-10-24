import { Button } from '@/components/ui/button';
import { BrandBadge, SectionContainer } from '@/components/shared';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <SectionContainer className="py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <BrandBadge 
            icon={<Sparkles className="w-4 h-4 text-[#FFE066] fill-[#FFE066]" />}
            variant="secondary"
          >
            Nền tảng học tập thông minh
          </BrandBadge>
          
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-text-primary">
            Học cùng nhau,
            <br />
            <span className="text-[#00A8E8]">vui hơn gấp bội!</span>
          </h1>
          
          <p className="text-lg text-text-secondary max-w-lg">
            Tham gia cộng đồng học sinh năng động, làm bài kiểm tra thú vị, 
            theo dõi tiến trình và cạnh tranh với bạn bè trên bảng xếp hạng.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              size="lg"
              className="border-3 border-black rounded-xl hover-brutal-push text-lg text-white"
              style={{ 
                backgroundColor: '#00A8E8',
                boxShadow: '6px 6px 0 #000'
              }}
            >
              <Link href="/signup">
                Bắt đầu học ngay!
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-3 border-black rounded-xl hover-brutal-push text-lg"
              style={{ 
                boxShadow: '6px 6px 0 #FFE066',
                backgroundColor: 'white'
              }}
            >
              <Link href="/about">Tìm hiểu thêm</Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-8 pt-4 flex-wrap">
            <div>
              <div className="text-3xl font-heading font-bold text-[#00A8E8]">5,000+</div>
              <div className="text-text-secondary">Học sinh</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-[#00A8E8]">10,000+</div>
              <div className="text-text-secondary">Câu hỏi</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-[#00A8E8]">98%</div>
              <div className="text-text-secondary">Hài lòng</div>
            </div>
          </div>
        </div>
        
        {/* Right Image */}
        <div className="relative">
          <div 
            className="rounded-3xl overflow-hidden border-4 border-black relative h-[400px] md:h-[500px]"
            style={{ boxShadow: '12px 12px 0 #FFE066' }}
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
            className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-4 border-black hidden md:block"
            style={{ backgroundColor: '#FFE066' }}
            aria-hidden="true"
          />
        </div>
      </div>
    </SectionContainer>
  );
}
