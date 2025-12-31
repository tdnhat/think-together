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
    <div className="relative min-h-screen overflow-hidden bg-background text-muted-foreground">
      {/* Gradient Background Decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_10%,hsl(var(--primary)/0.1),transparent)] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_75%,hsl(var(--secondary)/0.1),transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_80%,hsl(var(--primary)/0.1),transparent)] opacity-40" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
}
