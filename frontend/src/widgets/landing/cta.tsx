import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared";
import { Card } from "@/shared/ui/card";
import { SectionContainer } from "@/shared/components";
import { ROUTES } from "@/config/routes";

export function CallToAction() {
  return (
    <SectionContainer background="gray">
      <Card
        className="p-8 text-center md:p-12"
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
          variant="default"
          className="rounded-xl text-lg"
        >
          <Link href={ROUTES.auth.signup}>
            Đăng ký miễn phí
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </Card>
    </SectionContainer>
  );
}
