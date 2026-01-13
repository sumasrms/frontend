"use client";

import { useState } from "react";
import Link from "next/link";
import { useFacultiesQuery } from "@/data/governance";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconBuilding,
  IconPlus,
  IconUsers,
  IconChevronRight,
  IconBooks,
} from "@tabler/icons-react";
import type { Faculty } from "@/lib/types";
import { CreateFacultyDialog } from "@/components/admin/CreateFacultyDialog";

function FacultyCard({ faculty }: { faculty: Faculty }) {
  return (
    <Link
      href={`/dashboard/governance/faculties/${faculty.code}`}
      className="group block"
    >
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Badge variant="secondary" className="font-mono text-xs">
              {faculty.code}
            </Badge>
            <IconChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <h3 className="font-semibold text-lg leading-tight mt-2 line-clamp-2">
            {faculty.name}
          </h3>
          {faculty.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {faculty.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {/* Dean Section */}
          <div className="flex items-center gap-3 mb-4">
            {faculty.dean ? (
              <>
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={faculty.dean.image || undefined} />
                  <AvatarFallback className="text-xs bg-primary/10">
                    {faculty.dean.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-muted-foreground">Dean</span>
                  <span className="text-sm font-medium truncate">
                    {faculty.dean.name}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-8 w-8 rounded-full border border-dashed flex items-center justify-center">
                  <IconUsers className="h-4 w-4" />
                </div>
                <span className="text-sm">No dean assigned</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-3 border-t">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <IconBooks className="h-4 w-4" />
              <span className="text-sm font-medium">
                {faculty._count?.departments ?? 0}
              </span>
              <span className="text-xs">Depts</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <IconUsers className="h-4 w-4" />
              <span className="text-sm font-medium">
                {faculty._count?.users ?? 0}
              </span>
              <span className="text-xs">Users</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function FacultyCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-6 w-3/4 mt-2" />
        <Skeleton className="h-4 w-full mt-1" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-4 pt-3 border-t">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function FacultiesPage() {
  const { data, isLoading, error } = useFacultiesQuery({ page: 1, limit: 50 });
  const [createFacultyOpen, setCreateFacultyOpen] = useState(false);

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <p className="text-destructive">Failed to load faculties</p>
      </div>
    );
  }

  const faculties = data?.data ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faculties</h1>
          <p className="text-muted-foreground">
            Manage and view all faculties in your institution
          </p>
        </div>
        <Button onClick={() => setCreateFacultyOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Faculty
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <IconBuilding className="h-4 w-4" />
          <span>
            <strong className="text-foreground">{data?.meta?.total ?? 0}</strong> Faculties
          </span>
        </div>
        <div className="flex items-center gap-2">
          <IconBooks className="h-4 w-4" />
          <span>
            <strong className="text-foreground">
              {faculties.reduce((acc: number, f: Faculty) => acc + (f._count?.departments ?? 0), 0)}
            </strong>{" "}
            Departments
          </span>
        </div>
        <div className="flex items-center gap-2">
          <IconUsers className="h-4 w-4" />
          <span>
            <strong className="text-foreground">
              {faculties.reduce((acc: number, f: Faculty) => acc + (f._count?.users ?? 0), 0)}
            </strong>{" "}
            Users
          </span>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <FacultyCardSkeleton key={i} />
          ))}
        </div>
      ) : faculties.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <IconBuilding className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No faculties yet</h3>
          <p className="text-muted-foreground text-center mt-1">
            Create your first faculty to get started with academic governance.
          </p>
          <Button className="mt-4" onClick={() => setCreateFacultyOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Faculty
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {faculties.map((faculty: Faculty) => (
            <FacultyCard key={faculty.id} faculty={faculty} />
          ))}
        </div>
      )}

      <CreateFacultyDialog
        open={createFacultyOpen}
        onOpenChange={setCreateFacultyOpen}
      />
    </div>
  );
}
