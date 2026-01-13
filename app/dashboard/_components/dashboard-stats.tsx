"use client";

import { useAdminStatsQuery } from "@/data/admin";
import { StatCard } from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconUsers,
  IconBuilding,
  IconBook,
  IconCalendar,
} from "@tabler/icons-react";

export function DashboardStats() {
  const { data: stats, isLoading, error } = useAdminStatsQuery();

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <p className="text-destructive">Failed to load dashboard stats</p>
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats?.users.total ?? 0}
        icon={<IconUsers className="size-4" />}
        data-slot="card"
        footer={{
          primary: `${stats?.users.students ?? 0} Students`,
          secondary: `${stats?.users.staff ?? 0} Staff members`,
        }}
      />
      <StatCard
        title="Faculties"
        value={stats?.academic.faculties ?? 0}
        icon={<IconBuilding className="size-4" />}
        data-slot="card"
        footer={{
          primary: `${stats?.academic.departments ?? 0} Departments`,
          secondary: "Academic structure",
        }}
      />
      <StatCard
        title="Courses"
        value={stats?.academic.courses ?? 0}
        icon={<IconBook className="size-4" />}
        data-slot="card"
        footer={{
          primary: "Total registered courses",
          secondary: "Across all departments",
        }}
      />
      <StatCard
        title="Current Session"
        value={stats?.currentSession ?? "Not set"}
        icon={<IconCalendar className="size-4" />}
        data-slot="card"
        footer={{
          primary: `${stats?.pendingResults ?? 0} Pending results`,
          secondary: `${stats?.recentPayments ?? 0} Recent payments`,
        }}
      />
    </div>
  );
}
