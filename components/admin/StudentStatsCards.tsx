"use client";

import { useStudentsQuery } from "@/data/students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  UserCheck,
  UserMinus,
  ShieldAlert,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StudentStatsCards() {
  const { data: studentsData, isLoading } = useStudentsQuery({ limit: 1 });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden border-none shadow-sm ring-1 ring-border"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="mt-1 h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const total = studentsData?.meta.total || 0;

  // These would ideally come from a specific stats endpoint,
  // but we can mock or derive if needed. For now, let's keep it simple.
  const stats = [
    {
      title: "Total Students",
      value: total.toLocaleString(),
      description: "Across all departments",
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Active",
      value: "0", // Mock for now, will update when API supports stats
      description: "Currently enrolled",
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/20",
    },
    {
      title: "On Leave",
      value: "0",
      description: "Deferred/Suspended",
      icon: UserMinus,
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/20",
    },
    {
      title: "Graduated",
      value: "0",
      description: "Total alumni",
      icon: CheckCircle2,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="overflow-hidden border-none shadow-sm ring-1 ring-border"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={cn("p-2 rounded-lg", stat.bg)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper icons
function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

import { cn } from "@/lib/utils";
