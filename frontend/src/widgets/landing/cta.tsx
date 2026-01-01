import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/shared/ui/card";
import { SectionContainer } from "@/shared/components";
import { ROUTES } from "@/config/routes";

export function CallToAction() {
  return (
    <SectionContainer background="gray">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Sẵn sàng bắt đầu hành trình học tập?
          </CardTitle>
          <CardDescription className="mx-auto mt-4 max-w-2xl text-lg">
            Tham gia ngay hôm nay và khám phá cách học tập thông minh, vui vẻ
            cùng hàng ngàn học sinh trên khắp Việt Nam!
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild size="lg" variant="default">
            <Link href={ROUTES.auth.signup}>
              Đăng ký miễn phí
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </SectionContainer>
  );
}
