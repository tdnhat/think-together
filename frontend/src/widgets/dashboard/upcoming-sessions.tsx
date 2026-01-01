import Link from "next/link";
import { Button } from "@/shared";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { ROUTES } from "@/config/routes";
import { MOCK_UPCOMING_SESSIONS } from "./constants";

export function UpcomingSessions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-semibold">
          Các bài học sắp diễn ra
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {MOCK_UPCOMING_SESSIONS.map((session) => (
          <Card key={session} className="border-border/50">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-heading text-base font-semibold text-foreground">
                  {session}
                </p>
                <p className="text-sm text-muted-foreground">
                  Bắt đầu lúc 19:30 tối nay
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={ROUTES.game.play}>Nhắc tôi</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

