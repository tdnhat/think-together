"use client";

interface HomeHeaderProps {
  title?: string;
  description?: string;
}

export function HomeHeader({
  title = "Khám phá bài kiểm tra",
  description = "Chọn bài kiểm tra phù hợp với bạn và bắt đầu học ngay!",
}: HomeHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
      </div>
    </section>
  );
}

