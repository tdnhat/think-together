import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { MOCK_WEEKLY_GOALS } from "./constants";

export function WeeklyGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-semibold">
          Mục tiêu tuần này
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {MOCK_WEEKLY_GOALS.map((goal) => (
            <Card key={goal} className="border-border/50">
              <CardContent className="flex items-start gap-3 p-4">
                <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">{goal}</span>
              </CardContent>
            </Card>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

