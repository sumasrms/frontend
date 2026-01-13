"use client";

import { useState } from "react";
import { useFacultiesQuery, useDepartmentsQuery } from "@/data/governance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconBuilding,
  IconPlus,
  IconBook,
} from "@tabler/icons-react";
import type { Faculty, Department } from "@/lib/types";

function FacultiesTable() {
  const { data, isLoading, error } = useFacultiesQuery({ page: 1, limit: 10 });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load faculties
      </div>
    );
  }

  const faculties = data?.data ?? [];

  if (faculties.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No faculties found. Create your first faculty to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Faculty</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Dean</TableHead>
          <TableHead className="text-center">Departments</TableHead>
          <TableHead className="text-center">Users</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {faculties.map((faculty: Faculty) => (
          <TableRow key={faculty.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{faculty.name}</span>
                {faculty.description && (
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {faculty.description}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{faculty.code}</Badge>
            </TableCell>
            <TableCell>
              {faculty.dean ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={faculty.dean.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {faculty.dean.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{faculty.dean.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">Not assigned</span>
              )}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">
                {faculty._count?.departments ?? 0}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">
                {faculty._count?.users ?? 0}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DepartmentsTable() {
  const { data, isLoading, error } = useDepartmentsQuery({ page: 1, limit: 10 });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load departments
      </div>
    );
  }

  const departments = data?.data ?? [];

  if (departments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No departments found. Create your first department to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Faculty</TableHead>
          <TableHead>Head</TableHead>
          <TableHead className="text-center">Courses</TableHead>
          <TableHead className="text-center">Staff</TableHead>
          <TableHead className="text-center">Students</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((department: Department) => (
          <TableRow key={department.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{department.name}</span>
                {department.description && (
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {department.description}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{department.code}</Badge>
            </TableCell>
            <TableCell>
              {department.faculty ? (
                <span className="text-sm">{department.faculty.name}</span>
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </TableCell>
            <TableCell>
              {department.hod ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={department.hod?.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {department.hod?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{department.hod?.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">Not assigned</span>
              )}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">
                {department._count?.courses ?? 0}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">
                {department._count?.staff ?? 0}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">
                {department._count?.students ?? 0}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function GovernanceContent() {
  const [activeTab, setActiveTab] = useState("faculties");
  const { data: facultiesData } = useFacultiesQuery({ page: 1, limit: 10 });
  const { data: departmentsData } = useDepartmentsQuery({ page: 1, limit: 10 });

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Faculties</CardTitle>
            <IconBuilding className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facultiesData?.meta?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <IconBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentsData?.meta?.total ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Academic Governance</CardTitle>
              <CardDescription>
                Manage faculties and departments
              </CardDescription>
            </div>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              {activeTab === "faculties" ? "Add Faculty" : "Add Department"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="faculties">
                <IconBuilding className="mr-2 h-4 w-4" />
                Faculties
              </TabsTrigger>
              <TabsTrigger value="departments">
                <IconBook className="mr-2 h-4 w-4" />
                Departments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="faculties" className="mt-4">
              <FacultiesTable />
            </TabsContent>
            <TabsContent value="departments" className="mt-4">
              <DepartmentsTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
