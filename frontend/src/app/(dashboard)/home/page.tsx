import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-4xl font-heading font-bold text-[#00A8E8]">
          Worked! 🎉
        </h1>
      </div>
    </DashboardLayout>
  );
}
