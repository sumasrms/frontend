"use client";

import { use, useMemo, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  BookOpen,
  Edit,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStaffQuery, useStaffCoursesQuery } from "@/data/staff";
import { EditStaffDialog } from "@/components/admin/EditStaffDialog";
import { deleteStaffAction } from "@/lib/actions/staffActions";
import { toast } from "sonner";
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
import { CourseCard, CourseCardSkeleton } from "@/components/admin/CourseCard";

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

export default function StaffDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const router = useRouter();
  const { email } = use(params);
  const resolvedEmail = decodeURIComponent(email);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: staffData, isLoading: staffLoading } = useStaffQuery({
    search: resolvedEmail,
  });

  const staff = useMemo(() => {
    return staffData?.data.find(
      (s) => s.user.email.toLowerCase() === resolvedEmail.toLowerCase()
    );
  }, [staffData, resolvedEmail]);

  const { data: courses, isLoading: coursesLoading } = useStaffCoursesQuery(
    staff?.id || ""
  );

  const handleDelete = async () => {
    if (!staff) return;
    setIsDeleting(true);
    const result = await deleteStaffAction(staff.id);

    if (result.success) {
      toast.success("Staff deleted successfully");
      router.push("/dashboard/staffs");
    } else {
      toast.error(result.error || "Failed to delete staff");
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (staffLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-muted rounded-full" />
          <div className="w-48 h-8 bg-muted rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 h-[400px] bg-muted rounded-lg" />
          <div className="md:col-span-2 h-[400px] bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Staff member not found</h2>
        <p className="text-muted-foreground mt-2">
          Could not find staff with email {resolvedEmail}.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/dashboard/staffs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Link>
        </Button>
      </div>
    );
  }

  const initials =
    `${staff.user.firstName?.[0] || ""}${
      staff.user.lastName?.[0] || ""
    }`.toUpperCase() || staff.user.name.slice(0, 2).toUpperCase();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/staffs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardHeader className="text-center pb-2">
            <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-primary/10">
              <AvatarImage
                src={staff.user.image || undefined}
                alt={staff.user.name}
              />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{staff.user.name}</CardTitle>
            <CardDescription className="font-mono text-xs">
              {staff.staffNumber}
            </CardDescription>
            <div className="flex justify-center mt-2">
              <Badge className={employmentTypeColors[staff.employmentType]}>
                {employmentTypeLabels[staff.employmentType]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{staff.user.email}</span>
              </div>
              {staff.user.phoneNumber && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span>{staff.user.phoneNumber}</span>
                </div>
              )}
              {staff.position && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="h-4 w-4 shrink-0 text-primary" />
                  <span>{staff.position}</span>
                </div>
              )}
              {staff.dateJoined && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Joined {new Date(staff.dateJoined).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Account Active</span>
              </div>
              {staff.department && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Department
                  </p>
                  <p className="text-sm">
                    {staff.department.name} ({staff.department.code})
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Assigned Courses</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Specialization
                    </p>
                    <p className="text-base">
                      {staff.specialization || "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Position
                    </p>
                    <p className="text-base">
                      {staff.position || "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Faculty
                    </p>
                    <p className="text-base">
                      {staff.department?.faculty?.name || "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Staff ID
                    </p>
                    <p className="text-base font-mono">{staff.staffNumber}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Courses Taught
                        </p>
                        <p className="text-2xl font-bold">
                          {courses?.length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Years in Service
                        </p>
                        <p className="text-2xl font-bold">
                          {staff.dateJoined
                            ? Math.max(
                                0,
                                new Date().getFullYear() -
                                  new Date(staff.dateJoined).getFullYear()
                              )
                            : 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="courses" className="space-y-6 pt-4">
              {coursesLoading ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <CourseCardSkeleton key={i} />
                  ))}
                </div>
              ) : !courses || courses.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center text-muted-foreground">
                    No courses assigned yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
              Are you sure you want to delete {staff.user.name}? This cannot be
              undone.
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
    </div>
  );
}
