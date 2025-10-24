import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ThinkTogether - Học cùng nhau, vui hơn gấp bội',
  description: 'Nền tảng học tập thông minh giúp học sinh kiểm tra kiến thức, theo dõi tiến trình và cạnh tranh với bạn bè',
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
