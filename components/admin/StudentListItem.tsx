"use client";

import { Student } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Mail,
  Smartphone,
  ExternalLink,
  Edit,
  Trash2,
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
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useDeleteStudentMutation } from "@/data/students";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StudentListItemProps {
  student: Student;
}

export function StudentListItem({ student }: StudentListItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteStudent, isPending: isDeleting } =
    useDeleteStudentMutation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "SUSPENDED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "GRADUATED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const fullName = `${student.user?.firstName || "Student"} ${
    student.user?.lastName || ""
  }`;
  const initials = `${student.user?.firstName?.[0] || "S"}${
    student.user?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-4 p-3 bg-card hover:bg-accent/30 border rounded-xl transition-colors group"
    >
      <Avatar className="h-10 w-10 border shadow-sm shrink-0">
        <AvatarImage src={student.user?.image || ""} alt={fullName} />
        <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
            {fullName}
          </h4>
          <p className="text-[10px] text-muted-foreground font-mono uppercase truncate">
            {student.matricNumber}
          </p>
        </div>

        <div className="hidden md:block min-w-0">
          <p className="text-xs text-muted-foreground truncate">
            {student.department?.name || student.departmentId}
          </p>
          <p className="text-[10px] font-medium text-foreground">
            {student.level} Level
          </p>
        </div>

        <div className="hidden md:block min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{student.user?.email}</span>
          </div>
          {student.user?.phoneNumber && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
              <Smartphone className="h-3 w-3 shrink-0" />
              <span className="truncate">{student.user.phoneNumber}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end md:justify-start gap-3">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] h-5 font-medium",
              getStatusColor(student.status)
            )}
          >
            {student.status}
          </Badge>

          {student.cgpa !== undefined && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-bold">
              <span className="text-muted-foreground font-normal">CGPA:</span>
              {student.cgpa.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
          asChild
        >
          <Link href={`/dashboard/students/${student.id}`}>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/students/${student.id}`}>
                <ExternalLink className="h-3.5 w-3.5 mr-2" /> View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-3.5 w-3.5 mr-2" /> Edit Record
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <h2 className="text-lg font-bold">Delete Student</h2>
            <AlertDialogDescription>
              Are you sure you want to delete the record for {fullName}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                deleteStudent(student.id, {
                  onSuccess: () => setDeleteDialogOpen(false),
                });
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Record"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
