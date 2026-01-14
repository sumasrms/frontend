"use client";

import { useState } from "react";
import {
  MoreVertical,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Trash2,
  Edit,
  User,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { EditStaffDialog } from "@/components/admin/EditStaffDialog";
import { deleteStaffAction } from "@/lib/actions/staffActions";
import { useQueryClient } from "@tanstack/react-query";
import { staffKeys } from "@/data/keys";
import { toast } from "sonner";
import type { Staff } from "@/lib/types";

interface StaffCardProps {
  staff: Staff;
}

const employmentTypeColors = {
  FULL_TIME:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  PART_TIME: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  CONTRACT:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  VISITING:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const employmentTypeLabels = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  VISITING: "Visiting",
};

export function StaffCard({ staff }: StaffCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteStaffAction(staff.id);

    if (result.success) {
      toast.success("Staff deleted successfully");
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      setDeleteDialogOpen(false);
    } else {
      toast.error(result.error || "Failed to delete staff");
    }
    setIsDeleting(false);
  };

  const initials =
    `${staff.user.firstName?.[0] || ""}${
      staff.user.lastName?.[0] || ""
    }`.toUpperCase() || staff.user.name.slice(0, 2).toUpperCase();

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-3">
            <Link
              href={`/dashboard/staffs/${encodeURIComponent(staff.user.email)}`}
            >
              <Avatar className="h-12 w-12 hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={staff.user.image || undefined}
                  alt={staff.user.name}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                href={`/dashboard/staffs/${encodeURIComponent(
                  staff.user.email
                )}`}
              >
                <h3 className="font-semibold text-lg hover:underline cursor-pointer">
                  {staff.user.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">
                {staff.staffNumber}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/staffs/${encodeURIComponent(
                    staff.user.email
                  )}`}
                >
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className={employmentTypeColors[staff.employmentType]}>
              {employmentTypeLabels[staff.employmentType]}
            </Badge>
            {staff._count?.courses && staff._count.courses > 0 && (
              <Badge variant="outline">
                {staff._count.courses}{" "}
                {staff._count.courses === 1 ? "Course" : "Courses"}
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{staff.user.email}</span>
            </div>
            {staff.user.phoneNumber && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{staff.user.phoneNumber}</span>
              </div>
            )}
            {staff.position && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{staff.position}</span>
              </div>
            )}
            {staff.dateJoined && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined {new Date(staff.dateJoined).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {staff.department && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium">{staff.department.name}</p>
              <p className="text-xs text-muted-foreground">
                {staff.department.code}
              </p>
            </div>
          )}

          {staff.specialization && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">Specialization</p>
              <p className="text-sm">{staff.specialization}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditStaffDialog
        staff={staff}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {staff.user.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function StaffCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
