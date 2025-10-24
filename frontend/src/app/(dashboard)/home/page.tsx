import Link from "next/link";

import { ArrowRight, BookOpen, Crown, Sparkles, Target } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BrandBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";

const quickActions = [
  {
    title: "Tiếp tục học",
    description: "Hoàn thành phần còn lại của thử thách tuần này.",
    href: "/play",
    Icon: BookOpen,
    accent: "primary" as const,
  },
  {
    title: "Tạo thử thách",
    description: "Thiết kế bộ câu hỏi mới cho lớp của bạn.",
    href: "/quiz/new",
    Icon: Target,
    accent: "secondary" as const,
  },
  {
    title: "Xem bảng xếp hạng",
    description: "Khám phá vị trí của bạn trong cộng đồng.",
    href: "/leaderboard",
    Icon: Crown,
    accent: "primary" as const,
  },
] as const;

const highlightCards = [
  {
    title: "Chuỗi học tập",
    value: "5 ngày liên tiếp",
    description: "Giữ nhịp độ nhé!",
  },
  {
    title: "Điểm trung bình",
    value: "92%",
    description: "Xuất sắc hơn 87% bạn học.",
  },
  {
    title: "Bài đã hoàn thành",
    value: "18",
    description: "Gần đạt mục tiêu tháng này.",
  },
] as const;

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border-main)] bg-white p-8 shadow-brutal">
            <div className="pointer-events-none absolute -left-10 top-10 h-48 w-48 rounded-full bg-[var(--brand-secondary)]/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-6 -top-8 h-52 w-52 rounded-full bg-[var(--brand-primary)]/35 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <BrandBadge icon={<Sparkles className="h-4 w-4" />} variant="primary">
                Chào mừng quay trở lại
              </BrandBadge>

              <div className="space-y-4">
                <h1 className="font-heading text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
                  Cùng cộng đồng chinh phục thử thách mới hôm nay!
                </h1>
                <p className="max-w-xl text-lg text-[var(--text-secondary)]">
                  Theo dõi tiến trình, tiếp tục học và khám phá các thử thách hấp dẫn được tạo bởi giáo viên, bạn bè và chính bạn.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button asChild size="lg" variant="secondary" className="rounded-xl text-lg shadow-brutal">
                  <Link href="/play">
                    Bắt đầu học ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl text-lg shadow-brutal-secondary">
                  <Link href="/reports">Xem báo cáo</Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {highlightCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-[var(--color-border-main)] bg-[var(--bg-surface)]/80 p-4 text-[var(--text-secondary)] shadow-brutal-sm"
                  >
                    <p className="text-sm font-medium uppercase tracking-wide text-[var(--text-secondary)]/70">
                      {card.title}
                    </p>
                    <p className="font-heading text-2xl font-bold text-[var(--brand-primary)]">
                      {card.value}
                    </p>
                    <p className="text-sm">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            {quickActions.map(({ title, description, href, Icon, accent }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-[var(--color-border-main)] bg-white p-5 shadow-brutal transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={accent === "primary"
                      ? "flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--color-border-main)] bg-[var(--brand-primary)] text-white shadow-brutal-sm"
                      : "flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--color-border-main)] bg-[var(--brand-secondary)] text-[var(--text-primary)] shadow-brutal-sm"}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="font-heading text-lg font-semibold text-[var(--text-primary)]">{title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--color-border-main)] bg-white p-6 shadow-brutal">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-[var(--text-primary)]">Các bài học sắp diễn ra</h2>
            <div className="space-y-4">
              {["Toán học nâng cao", "Khoa học khám phá", "Lịch sử thế giới"].map((session) => (
                <div
                  key={session}
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-border-main)] bg-[var(--bg-surface)]/80 px-4 py-3 text-[var(--text-secondary)] shadow-brutal-sm"
                >
                  <div>
                    <p className="font-heading text-base font-semibold text-[var(--text-primary)]">{session}</p>
                    <p className="text-sm">Bắt đầu lúc 19:30 tối nay</p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="rounded-lg shadow-brutal-secondary-sm">
                    <Link href="/play">Nhắc tôi</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--color-border-main)] bg-white p-6 shadow-brutal">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-[var(--text-primary)]">Mục tiêu tuần này</h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              {[
                "Hoàn thành ít nhất 3 bài kiểm tra mới",
                "Chia sẻ 1 bộ câu hỏi với bạn học",
                "Duy trì điểm trung bình trên 90%",
              ].map((goal) => (
                <li
                  key={goal}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--color-border-main)] bg-[var(--bg-surface)]/80 px-4 py-3 shadow-brutal-sm"
                >
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[var(--brand-primary)]" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
