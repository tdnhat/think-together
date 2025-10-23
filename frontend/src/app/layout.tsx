import type { Metadata } from 'next'
import { Raleway, Quicksand, Be_Vietnam_Pro } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
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
  title: 'ThinkTogether - Interactive Quiz Platform',
  description: 'Create and play interactive quizzes with real-time collaboration',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${raleway.variable} ${beVietnamPro.variable} ${quicksand.variable} font-sans`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
