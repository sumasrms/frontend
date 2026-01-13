"use client";

import { use, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useFacultyByCodeQuery, useAssignDeanMutation } from "@/data/governance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  IconArrowLeft,
  IconBuilding,
  IconEdit,
  IconTrash,
  IconUsers,
  IconBooks,
  IconMail,
  IconCalendar,
  IconPlus,
} from "@tabler/icons-react";
import type { Department, User } from "@/lib/types";
import { StaffSelect } from "@/components/admin/StaffSelect";
import { EditFacultyDialog } from "@/components/admin/EditFacultyDialog";
import { deleteFacultyAction } from "@/lib/actions/governanceActions";
import { governanceKeys } from "@/data/keys";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateDepartmentDialog } from "@/components/admin/CreateDepartmentDialog";

function FacultyDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-48 md:col-span-2" />
        <Skeleton className="h-48" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export default function FacultyDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: faculty, isLoading, error } = useFacultyByCodeQuery(code);
  
  const [assignDeanOpen, setAssignDeanOpen] = useState(false);
  const [selectedDean, setSelectedDean] = useState<string | undefined>();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createDepartmentOpen, setCreateDepartmentOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  
  const assignDeanMutation = useAssignDeanMutation();

  const handleDeleteFaculty = () => {
    if (!faculty) return;
    
    startDeleteTransition(async () => {
      const result = await deleteFacultyAction(faculty.id);
      
      if (result.success) {
        toast.success("Faculty deleted successfully");
        queryClient.invalidateQueries({ queryKey: governanceKeys.faculties() });
        router.push("/dashboard/governance/faculties");
      } else {
        toast.error(result.error || "Failed to delete faculty");
      }
    });
  };

  const handleAssignDean = () => {
    if (!faculty || !selectedDean) return;

    assignDeanMutation.mutate(
      { facultyId: faculty.id, deanId: selectedDean },
      {
        onSuccess: () => {
          setAssignDeanOpen(false);
          setSelectedDean(undefined);
        },
      }
    );
  };

  if (isLoading) {
    return <FacultyDetailSkeleton />;
  }

  if (error || !faculty) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <IconBuilding className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Faculty not found</h2>
        <p className="text-muted-foreground mt-1">
          The faculty with code &quot;{code}&quot; could not be found.
        </p>
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
  const users = faculty.users ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/governance/faculties">
              <IconArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {faculty.name}
              </h1>
              <Badge variant="secondary" className="font-mono">
                {faculty.code}
              </Badge>
            </div>
            {faculty.description && (
              <p className="text-muted-foreground mt-1">{faculty.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Dean Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Faculty Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Dean */}
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Dean</span>
                {faculty.dean ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={faculty.dean.image || undefined} />
                      <AvatarFallback>
                        {faculty.dean.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{faculty.dean.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <IconMail className="h-3 w-3" />
                        {faculty.dean.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-10 w-10 rounded-full border border-dashed flex items-center justify-center">
                      <IconUsers className="h-5 w-5" />
                    </div>
                    <span>No dean assigned</span>
                  </div>
                )}
              </div>

              {/* Created */}
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Created</span>
                <p className="font-medium flex items-center gap-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(faculty.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <Separator />

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <IconBooks className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{departments.length}</p>
                  <p className="text-sm text-muted-foreground">Departments</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="flex items-center gap-2">
                <IconUsers className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" onClick={() => setCreateDepartmentOpen(true)}>
              <IconPlus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => setAssignDeanOpen(true)}
            >
              <IconUsers className="mr-2 h-4 w-4" />
              Assign Dean
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <IconUsers className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                All departments under this faculty
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setCreateDepartmentOpen(true)}>
              <IconPlus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {departments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconBooks className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold">No departments yet</h3>
              <p className="text-muted-foreground mt-1">
                Add departments to organize this faculty.
              </p>
              <Button className="mt-4" size="sm" onClick={() => setCreateDepartmentOpen(true)}>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead className="text-center">Courses</TableHead>
                  <TableHead className="text-center">Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept: Department) => (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{dept.name}</span>
                        {dept.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {dept.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{dept.code}</Badge>
                    </TableCell>
                    <TableCell>
                      {dept.hod ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={dept.hod?.image || undefined} />
                            <AvatarFallback className="text-xs">
                              {dept.hod?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{dept.hod?.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {dept._count?.courses ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {dept._count?.students ?? 0}
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
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Staff and students in this faculty
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <IconUsers className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconUsers className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold">No users yet</h3>
              <p className="text-muted-foreground mt-1">
                Users will appear here when assigned to this faculty.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback>
                            {user.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role?.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "default" : "secondary"}
                        className={
                          user.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : ""
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={assignDeanOpen} onOpenChange={setAssignDeanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Dean</DialogTitle>
            <DialogDescription>
              Select a staff member to assign as the Dean of {faculty.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <StaffSelect
              value={selectedDean}
              onSelect={(user) => setSelectedDean(user.id)}
              placeholder="Select a staff member..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDeanOpen(false)}
              disabled={assignDeanMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignDean}
              disabled={!selectedDean || assignDeanMutation.isPending}
            >
              {assignDeanMutation.isPending ? "Assigning..." : "Assign Dean"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <EditFacultyDialog 
        open={editOpen} 
        onOpenChange={setEditOpen} 
        faculty={faculty} 
      />
      
      {/* Delete Alert */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              <strong> {faculty.name}</strong> and all associated departments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteFaculty();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Faculty"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Department Dialog */}
      <CreateDepartmentDialog
        open={createDepartmentOpen}
        onOpenChange={setCreateDepartmentOpen}
        facultyId={faculty.id}
      />
    </div>
  );
}
