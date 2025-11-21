import {
  DashboardLayout,
  HomeHero,
  QuickActions,
  UpcomingSessions,
  WeeklyGoals
} from "@/widgets/dashboard";

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <HomeHero />
          <QuickActions />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <UpcomingSessions />
          <WeeklyGoals />
        </section>
      </div>
    </DashboardLayout>
  );
}
