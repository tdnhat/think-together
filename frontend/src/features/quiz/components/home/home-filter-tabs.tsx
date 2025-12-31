"use client";

import { Filter } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { FILTER_TABS, type QuizFilter } from "../../constants/home";

interface HomeFilterTabsProps {
  filterBy: QuizFilter;
  onFilterChange: (filter: QuizFilter) => void;
  onFilterClick?: () => void;
}

export function HomeFilterTabs({
  filterBy,
  onFilterChange,
  onFilterClick,
}: HomeFilterTabsProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => {
            const isActive = filterBy === tab.id;

            return (
              <Button
                key={tab.id}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                onClick={() => onFilterChange(tab.id)}
                className="rounded-full"
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
        {onFilterClick && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 self-start sm:self-auto"
            onClick={onFilterClick}
          >
            <Filter className="h-4 w-4" />
            Bộ lọc
          </Button>
        )}
      </div>
    </section>
  );
}

