'use client'

import Link from "next/link"
import type { PropsWithChildren, ReactNode } from "react"

import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Palette, PenTool, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AuthLayoutProps = PropsWithChildren<{
  title: string
  subtitle?: string
  switchLabel: string
  switchText: string
  switchHref: string
  badge?: ReactNode
  legalText?: string
  sideContent?: ReactNode
  className?: string
}>

export function AuthLayout({
  children,
  title,
  switchLabel,
  switchText,
  switchHref,
  badge,
  legalText = "Bằng việc đăng nhập, bạn đã đồng ý với Điều khoản sử dụng và Quyền riêng tư.",
  sideContent,
  className,
}: AuthLayoutProps) {
  const hasSideContent = Boolean(sideContent)
  const normalizedBadge =
    typeof badge === "string" ? (
      <Badge variant="secondary" size="sm">
        {badge}
      </Badge>
    ) : (
      badge
    )

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#f0f9ff_0%,_#f8fbff_55%,_#fffafd_100%)] px-4 py-10 text-[var(--text-secondary)]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_10%,rgba(0,168,232,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_75%,rgba(255,224,102,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_80%,rgba(0,168,232,0.15),transparent)]" />
      </div>

      <FloatingStationery />

      <div
        className={cn("relative z-10 mx-auto flex w-full flex-col items-center gap-6", hasSideContent ? "max-w-6xl" : "max-w-md")}
      >
        <section
          className={cn(
            "relative w-full overflow-hidden rounded-3xl border border-[var(--color-border-main)]/30 bg-white/95 px-7 py-8 shadow-[0_30px_80px_-35px_rgba(64,71,193,0.55)] backdrop-blur-sm sm:px-10 sm:py-10",
            className,
          )}
        >
          <div className="pointer-events-none absolute -top-24 right-10 hidden h-44 w-44 rounded-full bg-[var(--brand-primary)]/20 blur-3xl sm:block" />
          <div className="pointer-events-none absolute -bottom-28 left-12 hidden h-48 w-48 rounded-full bg-[var(--brand-secondary)]/20 blur-3xl sm:block" />

          <header className="relative mb-6 text-center">
            {normalizedBadge ? <div className="mb-4 flex justify-center">{normalizedBadge}</div> : null}

            <h1 className="text-3xl font-semibold text-[var(--text-primary)] sm:text-3xl">{title}</h1>
          </header>

          {children}

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            {switchLabel}{" "}
            <Link
              href={switchHref}
              className={cn(
                buttonVariants({ variant: "link" }),
                "font-semibold text-[var(--brand-primary)]",
              )}
            >
              {switchText}
            </Link>
          </p>

          {legalText ? (
            <p className="mt-4 text-center text-xs text-[var(--text-secondary)]/80">{legalText}</p>
          ) : null}
        </section>

        {hasSideContent ? <aside className="hidden">{sideContent}</aside> : null}
      </div>
    </main>
  )
}

function FloatingStationery() {
  const items = [
    {
      id: "pencil",
      Icon: PenTool,
      className: "top-[12%] left-[6%]",
      colors: "bg-[#ffe3d4] text-[#ff7d66]",
      size: "h-16 w-16",
      float: { rotate: [-6, 8, -4] as number[], x: [0, 14, -10, 0] as number[], y: [0, -10, 8, 0] as number[] },
      delay: 0,
      duration: 14,
    },
    {
      id: "notebook",
      Icon: BookOpen,
      className: "bottom-[18%] left-[12%]",
      colors: "bg-[#e0f2fe] text-[#00A8E8]",
      size: "h-20 w-20",
      float: { rotate: [4, -6, 6] as number[], x: [0, -16, 10, 0] as number[], y: [0, 12, -14, 0] as number[] },
      delay: 2,
      duration: 16,
    },
    {
      id: "cap",
      Icon: GraduationCap,
      className: "top-[20%] right-[12%]",
      colors: "bg-[#fff2c5] text-[#f8a72b]",
      size: "h-[4.75rem] w-[4.75rem]",
      float: { rotate: [-3, 7, -3] as number[], x: [0, -8, 6, 0] as number[], y: [0, 14, -10, 0] as number[] },
      delay: 1.5,
      duration: 18,
    },
    {
      id: "palette",
      Icon: Palette,
      className: "bottom-[22%] right-[8%]",
      colors: "bg-[#fbe5ff] text-[#c35bff]",
      size: "h-16 w-16",
      float: { rotate: [2, -4, 4] as number[], x: [0, 12, -12, 0] as number[], y: [0, -8, 12, 0] as number[] },
      delay: 0.5,
      duration: 15,
    },
    {
      id: "sparkles",
      Icon: Star,
      className: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      colors: "bg-white/70 text-[var(--brand-primary)] backdrop-blur",
      size: "h-14 w-14",
      float: { rotate: [-8, 8, -6] as number[], x: [0, 10, -10, 0] as number[], y: [0, -12, 12, 0] as number[] },
      delay: 3,
      duration: 20,
    },
  ] as const

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex h-screen w-screen items-center justify-center opacity-90">
      <div className="relative h-screen w-full">
        {items.map(({ id, Icon, className, colors, size, float, delay, duration }) => (
          <motion.div
            key={id}
            className={cn(
              "pointer-events-none absolute flex items-center justify-center rounded-3xl border border-white/40 shadow-md shadow-black/5 backdrop-blur-sm",
              className,
              colors,
              size,
            )}
            animate={{
              x: float.x,
              y: float.y,
              rotate: float.rotate,
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <Icon className="h-7 w-7" strokeWidth={1.6} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
