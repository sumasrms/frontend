"use client";

import { useState, useTransition } from "react";
import { Course } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconUsers,
  IconBook,
  IconClock,
  IconSchool,
} from "@tabler/icons-react";
import { deleteCourseAction } from "@/lib/actions/courseActions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "@/data/keys";
import { EditCourseDialog } from "./EditCourseDialog";
import { AssignInstructorDialog } from "./AssignInstructorDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteCourseAction(course.id);
      if (result.success) {
        toast.success("Course deleted successfully");
        queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        setDeleteOpen(false);
      } else {
        toast.error(result.error || "Failed to delete course");
      }
    });
  };

  const primaryInstructor = course.instructors?.find((i) => i.isPrimary);

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {course.code}
              </Badge>
              {!course.isActive && (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>
            <CardTitle className="text-base font-semibold line-clamp-2 leading-tight">
              {course.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <IconEdit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAssignOpen(true)}>
                <IconUsers className="mr-2 h-4 w-4" /> Assign Instructor
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <IconTrash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 pt-2">
          {course.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <IconBook className="h-3.5 w-3.5" />
              <span>{course.credits} Credits</span>
            </div>
            <div className="flex items-center gap-1">
              <IconSchool className="h-3.5 w-3.5" />
              <span>{course.level} Level</span>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <IconClock className="h-3.5 w-3.5" />
              <span>
                {course.semester.charAt(0) +
                  course.semester.slice(1).toLowerCase()}{" "}
                Semester
              </span>
            </div>
            <div className="col-span-2 text-xs">{course.academicYear}</div>
          </div>
          {/* Instructors */}
          <div className="pt-2 border-t mt-2">
            {course.instructors && course.instructors.length > 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3 overflow-hidden">
                  {course.instructors.map((instructorData) => (
                    <Avatar
                      key={instructorData.id}
                      className={`h-8 w-8 ring-2 ring-background inline-block ${
                        instructorData.isPrimary ? "ring-primary z-10" : "z-0"
                      }`}
                    >
                      <AvatarImage
                        src={instructorData.instructor?.user.image || undefined}
                        alt={instructorData.instructor?.user.name}
                      />
                      <AvatarFallback className="text-[10px] bg-muted">
                        {instructorData.instructor?.user.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold truncate leading-none">
                    {primaryInstructor?.instructor?.user.name ||
                      "Multiple Instructors"}
                  </span>
                  {primaryInstructor && (
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      Primary Instructor
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">
                No instructors assigned
              </div>
            )}
          </div>
        </CardContent>
        {/** Maybe CardFooter can have stats? */}
      </Card>

      <EditCourseDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        course={course}
      />

      <AssignInstructorDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        courseId={course.id}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {course.code} - {course.title}. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="h-[250px]">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-8 w-full mt-4" />
      </CardContent>
    </Card>
  );
}
