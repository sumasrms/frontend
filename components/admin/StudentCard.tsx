"use client";

import { Student } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Mail,
  Smartphone,
  GraduationCap,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  TrendingUp,
  History,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import {
  useDeleteStudentMutation,
  useUpdateStudentStatusMutation,
  usePromoteStudentMutation,
} from "@/data/students";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteStudent, isPending: isDeleting } =
    useDeleteStudentMutation();
  const { mutate: updateStatus } = useUpdateStudentStatusMutation();
  const { mutate: promote } = usePromoteStudentMutation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20";
      case "SUSPENDED":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
      case "GRADUATED":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
      case "WITHDRAWN":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20";
      case "DEFERRED":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const fullName = `${student.user?.firstName || "Student"} ${
    student.user?.lastName || ""
  }`;
  const initials = `${student.user?.firstName?.[0] || "S"}${
    student.user?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:ring-1 hover:ring-primary/20">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:border-primary/20 transition-colors">
            <AvatarImage src={student.user?.image || ""} alt={fullName} />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-medium h-5",
                getStatusColor(student.status)
              )}
            >
              {student.status}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/students/${student.id}`}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="h-3.5 w-3.5" /> Edit Record
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Management</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    promote({
                      id: student.id,
                      level: student.level + 100,
                    })
                  }
                >
                  <TrendingUp className="h-3.5 w-3.5 mr-2" /> Promote to{" "}
                  {student.level + 100}L
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateStatus({
                      id: student.id,
                      status:
                        student.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                    })
                  }
                >
                  <History className="h-3.5 w-3.5 mr-2" />
                  {student.status === "ACTIVE"
                    ? "Suspend Student"
                    : "Activate Student"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive bg-destructive/10!"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Record
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-4 space-y-4">
        <div>
          <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors truncate">
            {fullName}
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5 uppercase tracking-wider">
            {student.matricNumber}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {student.department?.name || student.department?.code || "N/A"}
            </span>
            <span className="shrink-0 font-medium text-foreground bg-accent/50 px-1.5 py-0.5 rounded text-[10px]">
              {student.level}L
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {student.user?.email || "No email"}
            </span>
          </div>

          {student.user?.phoneNumber && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Smartphone className="h-3.5 w-3.5 shrink-0" />
              <span>{student.user.phoneNumber}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Admitted:{" "}
            {student.admissionDate
              ? new Date(student.admissionDate).getFullYear()
              : "N/A"}
          </div>
          {student.cgpa !== undefined && (
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              CGPA: {student.cgpa.toFixed(2)}
            </div>
          )}
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              student record for{" "}
              <strong className="text-foreground">
                {fullName} ({student.matricNumber})
              </strong>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteStudent(student.id, {
                  onSuccess: () => setDeleteDialogOpen(false),
                });
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Record"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export function StudentCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="pt-2 border-t flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
