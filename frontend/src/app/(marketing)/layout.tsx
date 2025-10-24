import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ThinkTogether - Học cùng nhau, vui hơn gấp bội",
  description: "Nền tảng học tập thông minh giúp học sinh kiểm tra kiến thức, theo dõi tiến trình và cạnh tranh với bạn bè",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f0f9ff_0%,_#f8fbff_55%,_#fffafd_100%)] text-[var(--text-secondary)]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_10%,rgba(0,168,232,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_75%,rgba(255,224,102,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_80%,rgba(0,168,232,0.15),transparent)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
}
