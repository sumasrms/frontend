"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateCourseDialog } from "@/components/admin/CreateCourseDialog";
import { CourseCard, CourseCardSkeleton } from "@/components/admin/CourseCard";
// import { CourseCardSkeleton } from "@/components/admin/CourseCardSkeleton";
import { useCoursesQuery } from "@/data/courses";
import { useDepartmentsQuery } from "@/data/governance";

export default function CoursesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>();
  const [selectedSemester, setSelectedSemester] = useState<string | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>();

  // Build query params
  const queryParams: Record<string, string> = {};
  if (selectedDepartment) queryParams.departmentId = selectedDepartment;
  if (selectedSemester) queryParams.semester = selectedSemester;
  if (selectedLevel) queryParams.level = selectedLevel;

  const { data: coursesData, isLoading: coursesLoading } = useCoursesQuery(queryParams);
  const { data: departmentsData } = useDepartmentsQuery({ limit: 100 });

  const courses = coursesData?.data || [];
  const departments = departmentsData?.data || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage courses, assign instructors, and track enrollment
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedDepartment || "all"} onValueChange={(value) => setSelectedDepartment(value === "all" ? undefined : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSemester || "all"} onValueChange={(value) => setSelectedSemester(value === "all" ? undefined : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Semesters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            <SelectItem value="FIRST">First Semester</SelectItem>
            <SelectItem value="SECOND">Second Semester</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedLevel || "all"} onValueChange={(value) => setSelectedLevel(value === "all" ? undefined : value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="100">100 Level</SelectItem>
            <SelectItem value="200">200 Level</SelectItem>
            <SelectItem value="300">300 Level</SelectItem>
            <SelectItem value="400">400 Level</SelectItem>
            <SelectItem value="500">500 Level</SelectItem>
          </SelectContent>
        </Select>

        {(selectedDepartment || selectedSemester || selectedLevel) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedDepartment(undefined);
              setSelectedSemester(undefined);
              setSelectedLevel(undefined);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Courses Grid */}
      {coursesLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {selectedDepartment || selectedSemester || selectedLevel
                ? "No courses match your filters. Try adjusting your search criteria."
                : "You haven't created any courses yet. Get started by creating your first course."}
            </p>
            {!selectedDepartment && !selectedSemester && !selectedLevel && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateCourseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        departmentId={selectedDepartment}
      />
    </div>
  );
}