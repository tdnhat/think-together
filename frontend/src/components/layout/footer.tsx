import Link from "next/link";

import { Code2, GraduationCap, Mail, Network } from "lucide-react";

const socialLinks = [
  {
    href: "https://github.com",
    label: "GitHub",
    Icon: Code2,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    Icon: Network,
  },
  {
    href: "mailto:contact@thinktogether.com",
    label: "Email",
    Icon: Mail,
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t-4 border-[var(--color-border-main)] bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-[var(--brand-primary)]" />
              <span className="text-xl font-heading font-bold text-[var(--text-primary)]">ThinkTogether</span>
            </div>
            <p className="max-w-md text-[var(--text-secondary)]">
              Nền tảng học tập thông minh giúp học sinh kiểm tra kiến thức, 
              theo dõi tiến trình và cạnh tranh với bạn bè một cách vui vẻ.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-heading font-semibold text-[var(--text-primary)]">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>
                <Link href="/about" className="transition-colors hover:text-[var(--text-primary)]">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-[var(--text-primary)]">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-[var(--text-primary)]">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-[var(--text-primary)]">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div>
            <h3 className="mb-4 font-heading font-semibold text-[var(--text-primary)]">
              Kết nối
            </h3>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[var(--color-border-main)] bg-[var(--brand-primary)] text-white shadow-brutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t-2 border-[var(--color-border-main)] pt-8 text-center text-[var(--text-secondary)]">
          <p>&copy; {new Date().getFullYear()} ThinkTogether. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
