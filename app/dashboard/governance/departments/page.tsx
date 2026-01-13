"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useDepartmentsQuery, useDepartmentStatsQuery } from "@/data/governance";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconBuilding,
  IconPlus,
  IconUserShield,
  IconUserExclamation,
} from "@tabler/icons-react";
import type { Department } from "@/lib/types";
import { CreateDepartmentDialog } from "@/components/admin/CreateDepartmentDialog";

import { DepartmentCard, DepartmentCardSkeleton } from "@/components/admin/DepartmentCard";

export default function DepartmentsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const { data, isLoading, error } = useDepartmentsQuery({ page: 1, limit: 50 });
  const { data: stats, isLoading: statsLoading } = useDepartmentStatsQuery();
  const [createDepartmentOpen, setCreateDepartmentOpen] = useState(false);

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <p className="text-destructive">Failed to load departments</p>
      </div>
    );
  }

  const departments = data?.data ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage and view all departments across faculties
          </p>
        </div>
        <Button onClick={() => setCreateDepartmentOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Departments
            </CardTitle>
            <IconBuilding className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Across all faculties
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              With HOD
            </CardTitle>
            <IconUserShield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {statsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.withHod ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Departments with assigned Head
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unassigned
            </CardTitle>
            <IconUserExclamation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {statsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.withoutHod ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Departments without HOD
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <DepartmentCardSkeleton key={i} />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <IconBuilding className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No departments yet</h3>
          <p className="text-muted-foreground text-center mt-1">
            Create your first department to start organizing courses.
          </p>
          <Button className="mt-4" onClick={() => setCreateDepartmentOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {departments.map((department: Department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </div>
      )}

      <CreateDepartmentDialog
        open={createDepartmentOpen}
        onOpenChange={setCreateDepartmentOpen}
      />
    </div>
  );
}
