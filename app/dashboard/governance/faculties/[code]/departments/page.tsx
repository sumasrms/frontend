"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useFacultyByCodeQuery } from "@/data/governance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowLeft,
  IconBuilding,
  IconPlus,
} from "@tabler/icons-react";
import { DepartmentCard, DepartmentCardSkeleton } from "@/components/admin/DepartmentCard";
import { CreateDepartmentDialog } from "@/components/admin/CreateDepartmentDialog";
import type { Department } from "@/lib/types";

export default function FacultyDepartmentsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const { data: faculty, isLoading, error } = useFacultyByCodeQuery(code);
  const [createDepartmentOpen, setCreateDepartmentOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
        <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-muted rounded animate-pulse" />
             <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <DepartmentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <IconBuilding className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Faculty not found</h2>
        <Button asChild className="mt-4">
          <Link href="/dashboard/governance/faculties">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Faculties
          </Link>
        </Button>
      </div>
    );
  }

  const departments = faculty.departments ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/governance/faculties/${code}`}>
              <IconArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {faculty.name} Departments
              </h1>
              <Badge variant="secondary" className="font-mono">
                {faculty.code}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
                Manage departments for this faculty
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateDepartmentOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <IconBuilding className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No departments yet</h3>
          <p className="text-muted-foreground text-center mt-1">
            Create departments to verify courses and students.
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
        facultyId={faculty.id}
      />
    </div>
  );
}