import { Card } from "@/shared/ui/card";
import { MOCK_WEEKLY_GOALS } from "./constants";

export function WeeklyGoals() {
  return (
    <Card className="p-6">
      <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground">
        Mục tiêu tuần này
      </h2>
      <ul className="space-y-3 text-muted-foreground">
        {MOCK_WEEKLY_GOALS.map((goal) => (
          <Card
            key={goal}
            className="flex items-start gap-3 px-4 py-3"
          >
            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            <span>{goal}</span>
          </Card>
        ))}
      </ul>
    </Card>
  );
}

