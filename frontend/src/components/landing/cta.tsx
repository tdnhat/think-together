import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/shared';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CallToAction() {
  return (
    <SectionContainer background="gray">
      <div 
        className="bg-white rounded-3xl border-4 border-black p-8 md:p-12 text-center"
        style={{ boxShadow: '12px 12px 0 #FFE066' }}
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
          Sẵn sàng bắt đầu hành trình học tập?
        </h2>
        <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
          Tham gia ngay hôm nay và khám phá cách học tập thông minh, 
          vui vẻ cùng hàng ngàn học sinh trên khắp Việt Nam!
        </p>
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
            Đăng ký miễn phí
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
