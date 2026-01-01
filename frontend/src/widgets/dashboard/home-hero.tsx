import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { BrandBadge } from "@/shared/components";
import { Button } from "@/shared";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/ui/card";
import { ROUTES } from "@/config/routes";
import { MOCK_HIGHLIGHT_CARDS } from "./constants";

export function HomeHero() {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-10 top-10 h-48 w-48 rounded-full bg-secondary/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-6 -top-8 h-52 w-52 rounded-full bg-primary/35 blur-3xl" />

      <CardHeader className="relative z-10">
        <BrandBadge icon={<Sparkles className="h-4 w-4" />}>
          Chào mừng quay trở lại
        </BrandBadge>
        <div className="space-y-4">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Cùng cộng đồng chinh phục thử thách mới hôm nay!
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Theo dõi tiến trình, tiếp tục học và khám phá các thử thách hấp dẫn
            được tạo bởi giáo viên, bạn bè và chính bạn.
          </p>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button asChild size="lg" variant="default">
            <Link href={ROUTES.game.play}>
              Bắt đầu học ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={ROUTES.reports.list}>Xem báo cáo</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {MOCK_HIGHLIGHT_CARDS.map((card) => (
            <Card key={card.title} className="border-primary/20 bg-background/80">
              <CardContent className="p-4">
                <p className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground/70">
                  {card.title}
                </p>
                <p className="mb-1 font-heading text-2xl font-bold text-primary">
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

