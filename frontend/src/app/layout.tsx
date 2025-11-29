import type { Metadata } from 'next'
import { Raleway, Quicksand, Be_Vietnam_Pro } from 'next/font/google'
import { QueryProvider } from '@/providers/query-provider'
import { ToastProvider } from '@/providers/toast-provider'
import './globals.css'

const raleway = Raleway({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-raleway',
  display: 'swap',
})

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
})

const quicksand = Quicksand({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ThinkTogether - Học cùng nhau, vui hơn gấp bội',
    template: '%s | ThinkTogether'
  },
  icons: {
    icon: '/icons/graduation-cap.png',
  },
  description: 'Nền tảng học tập thông minh giúp học sinh kiểm tra kiến thức, theo dõi tiến trình và cạnh tranh với bạn bè',
  keywords: ['học tập', 'quiz', 'kiểm tra', 'giáo dục', 'học sinh', 'bảng xếp hạng'],
  authors: [{ name: 'ThinkTogether Team' }],
  creator: 'ThinkTogether',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'ThinkTogether',
    title: 'ThinkTogether - Học cùng nhau, vui hơn gấp bội',
    description: 'Nền tảng học tập thông minh giúp học sinh kiểm tra kiến thức, theo dõi tiến trình và cạnh tranh với bạn bè',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${raleway.variable} ${beVietnamPro.variable} ${quicksand.variable} font-sans`}>
        <QueryProvider>
          {children}
        </QueryProvider>
        <ToastProvider />
      </body>
    </html>
  )
}
