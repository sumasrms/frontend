"use client";

import { use, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { 
  useDepartmentByCodeQuery, 
  useAssignHODMutation, 
} from "@/data/governance";
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
  IconSchool,
  IconCertificate,
} from "@tabler/icons-react"; // Check available icons
import type { GradeScale } from "@/lib/types";
import { StaffSelect } from "@/components/admin/StaffSelect";
import { EditDepartmentDialog } from "@/components/admin/EditDepartmentDialog";
import { AddGradeScaleDialog } from "@/components/admin/AddGradeScaleDialog";
import { deleteDepartmentAction } from "@/lib/actions/governanceActions";
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

function DepartmentDetailSkeleton() {
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

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ departmentCode: string }>;
}) {
  const { departmentCode } = use(params);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const queryClient = useQueryClient();
  // Ensure useDepartmentByCodeQuery matches the one exported in data/governance
  const { data: department, isLoading, error } = useDepartmentByCodeQuery(departmentCode);
  
  const [assignHODOpen, setAssignHODOpen] = useState(false);
  const [selectedHOD, setSelectedHOD] = useState<string | undefined>();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addGradeScaleOpen, setAddGradeScaleOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  
  const assignHODMutation = useAssignHODMutation();

  const handleDeleteDepartment = () => {
    if (!department) return;
    
    startDeleteTransition(async () => {
      const result = await deleteDepartmentAction(department.id);
      
      if (result.success) {
        toast.success("Department deleted successfully");
        queryClient.invalidateQueries({ queryKey: governanceKeys.departments() });
        // Redirect to departments list
        router.push("/dashboard/governance/departments");
      } else {
        toast.error(result.error || "Failed to delete department");
      }
    });
  };

  const handleAssignHOD = () => {
    if (!department || !selectedHOD) return;

    assignHODMutation.mutate(
      { departmentId: department.id, hodId: selectedHOD },
      {
        onSuccess: () => {
          setAssignHODOpen(false);
          setSelectedHOD(undefined);
          queryClient.invalidateQueries({ queryKey: governanceKeys.departmentByCode(department.code) });
        },
      }
    );
  };

  if (isLoading) {
    return <DepartmentDetailSkeleton />;
  }

  if (error || !department) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <IconBuilding className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Department not found</h2>
        <p className="text-muted-foreground mt-1">
          The department with code &quot;{departmentCode}&quot; could not be found.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/governance/departments">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Departments
          </Link>
        </Button>
      </div>
    );
  }

  const gradeScales = department.gradeScales ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/governance/departments">
              <IconArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {department.name}
              </h1>
              <Badge variant="outline" className="font-mono">
                {department.code}
              </Badge>
            </div>
            {department.description && (
              <p className="text-muted-foreground mt-1">{department.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <IconSchool className="h-4 w-4" />
                <Link href={`/dashboard/governance/faculties/${department.faculty?.code}`} className="hover:underline">
                    {department.faculty?.name || "Unknown Faculty"}
                </Link>
            </div>
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
        {/* HOD Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Head of Department</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Current HOD</span>
                {department.hod ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={department.hod?.image || undefined} />
                      <AvatarFallback>
                        {department.hod?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{department.hod?.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <IconMail className="h-3 w-3" />
                        {department.hod?.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-10 w-10 rounded-full border border-dashed flex items-center justify-center">
                      <IconUsers className="h-5 w-5" />
                    </div>
                    <span>No HOD assigned</span>
                  </div>
                )}
              </div>

             {/* Created */}
               <div className="space-y-2">
                 <span className="text-sm text-muted-foreground">Created</span>
                 <p className="font-medium flex items-center gap-2">
                   <IconCalendar className="h-4 w-4 text-muted-foreground" />
                   {new Date(department.createdAt).toLocaleDateString("en-US", {
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
                   <p className="text-2xl font-bold">{department._count?.courses ?? 0}</p>
                   <p className="text-sm text-muted-foreground">Courses</p>
                 </div>
               </div>
               <Separator orientation="vertical" className="h-12" />
               <div className="flex items-center gap-2">
                 <IconUsers className="h-5 w-5 text-muted-foreground" />
                 <div>
                   <p className="text-2xl font-bold">{department._count?.students ?? 0}</p>
                   <p className="text-sm text-muted-foreground">Students</p>
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
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => setAssignHODOpen(true)}
            >
              <IconUsers className="mr-2 h-4 w-4" />
              Assign HOD
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => setAddGradeScaleOpen(true)}
            >
              <IconCertificate className="mr-2 h-4 w-4" />
              Add Grade Scale
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Grade Scales Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Grade Scales</CardTitle>
              <CardDescription>
                Grading system for this department
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setAddGradeScaleOpen(true)}>
              <IconPlus className="mr-2 h-4 w-4" />
              Add Grade Scale
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {gradeScales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconCertificate className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold">No grade scales yet</h3>
              <p className="text-muted-foreground mt-1">
                Define grade scales for student assessment.
              </p>
              <Button className="mt-4" size="sm" onClick={() => setAddGradeScaleOpen(true)}>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Grade Scale
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grade</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead>Point</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradeScales.map((scale: GradeScale) => (
                  <TableRow key={scale.id}>
                    <TableCell className="font-medium">
                        <Badge variant="secondary">{scale.grade}</Badge>
                    </TableCell>
                    <TableCell>
                      {scale.minScore} - {scale.maxScore}
                    </TableCell>
                    <TableCell>
                      {scale.gradePoint}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                        {scale.description || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Assign HOD Dialog */}
      <Dialog open={assignHODOpen} onOpenChange={setAssignHODOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Head of Department</DialogTitle>
            <DialogDescription>
              Select a staff member to assign as the HOD of {department.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <StaffSelect
              value={selectedHOD}
              onSelect={(user) => setSelectedHOD(user.id)}
              placeholder="Select a staff member..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignHODOpen(false)}
              disabled={assignHODMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignHOD}
              disabled={!selectedHOD || assignHODMutation.isPending}
            >
              {assignHODMutation.isPending ? "Assigning..." : "Assign HOD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <EditDepartmentDialog 
        open={editOpen} 
        onOpenChange={setEditOpen} 
        department={department} 
      />
      
      {/* Add Grade Scale Dialog */}
      <AddGradeScaleDialog
        open={addGradeScaleOpen}
        onOpenChange={setAddGradeScaleOpen}
        departmentId={department.id}
      />

      {/* Delete Alert */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              <strong> {department.name}</strong> and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteDepartment();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Department"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
