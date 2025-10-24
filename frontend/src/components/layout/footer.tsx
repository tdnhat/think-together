import { GraduationCap, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-[#00A8E8]" />
              <span className="text-xl font-heading font-bold">ThinkTogether</span>
            </div>
            <p className="text-text-secondary max-w-md">
              Nền tảng học tập thông minh giúp học sinh kiểm tra kiến thức, 
              theo dõi tiến trình và cạnh tranh với bạn bè một cách vui vẻ.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-text-primary">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-black transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-black transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-black transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-black transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-text-primary">
              Kết nối
            </h3>
            <div className="flex gap-3">
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center hover-brutal-push"
                style={{ backgroundColor: '#00A8E8', boxShadow: '3px 3px 0 #000' }}
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center hover-brutal-push"
                style={{ backgroundColor: '#00A8E8', boxShadow: '3px 3px 0 #000' }}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a 
                href="mailto:contact@thinktogether.com" 
                className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center hover-brutal-push"
                style={{ backgroundColor: '#00A8E8', boxShadow: '3px 3px 0 #000' }}
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t-2 border-black text-center text-text-secondary">
          <p>&copy; {new Date().getFullYear()} ThinkTogether. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
