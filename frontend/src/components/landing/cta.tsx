import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SectionContainer } from "@/components/shared";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <SectionContainer background="gray">
      <div 
        className="rounded-3xl border-4 border-[var(--color-border-main)] bg-white p-8 text-center shadow-brutal-secondary-xl md:p-12"
      >
        <h2 className="mb-4 font-heading text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Sẵn sàng bắt đầu hành trình học tập?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--text-secondary)]">
          Tham gia ngay hôm nay và khám phá cách học tập thông minh, 
          vui vẻ cùng hàng ngàn học sinh trên khắp Việt Nam!
        </p>
        <Button 
          asChild
          size="lg"
          variant="secondary"
          className="rounded-xl text-lg shadow-brutal"
        >
          <Link href="/signup">
            Đăng ký miễn phí
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
