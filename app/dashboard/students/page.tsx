"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreateStudentDialog } from "@/components/admin/CreateStudentDialog";
import { StudentBulkUploadDialog } from "@/components/admin/StudentBulkUploadDialog";
import {
  StudentCard,
  StudentCardSkeleton,
} from "@/components/admin/StudentCard";
import { StudentListItem } from "@/components/admin/StudentListItem";
import { StudentStatsCards } from "@/components/admin/StudentStatsCards";
import { useStudentsQuery } from "@/data/students";
import { useDepartmentsQuery } from "@/data/governance";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExportButton } from "@/components/admin/ExportButton";

export default function StudentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >();
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  const queryParams = {
    search: debouncedSearch,
    ...(selectedDepartment && { departmentId: selectedDepartment }),
    ...(selectedLevel && { level: parseInt(selectedLevel) }),
    ...(selectedStatus && { status: selectedStatus }),
  };

  const { data: studentsData, isLoading: studentsLoading } =
    useStudentsQuery(queryParams);
  const { data: departmentsData } = useDepartmentsQuery({ limit: 100 });

  const students = studentsData?.data || [];
  const departments = departmentsData?.data || [];

  return (
    <div className="space-y-6 p-6 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student records, enrollment, and academic status
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton module="students" />
          <StudentBulkUploadDialog />
          <CreateStudentDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <StudentStatsCards />

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur-md py-4 border-b">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent rounded-3xl -m-2 opacity-50 transition-opacity" />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or matric number..."
              className="pl-10 h-10 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedDepartment || "all"}
            onValueChange={(value) =>
              setSelectedDepartment(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px] h-10 rounded-xl bg-muted/50 border-none">
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

          <Select
            value={selectedLevel || "all"}
            onValueChange={(value) =>
              setSelectedLevel(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[130px] h-10 rounded-xl bg-muted/50 border-none">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {[100, 200, 300, 400, 500, 600].map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  {level} Level
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus || "all"}
            onValueChange={(value) =>
              setSelectedStatus(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[130px] h-10 rounded-xl bg-muted/50 border-none">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="GRADUATED">Graduated</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              <SelectItem value="DEFERRED">Deferred</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex bg-muted/50 p-1 rounded-xl">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg transition-all",
                viewMode === "grid" && "shadow-sm bg-background"
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg transition-all",
                viewMode === "list" && "shadow-sm bg-background"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {(selectedDepartment ||
            selectedLevel ||
            selectedStatus ||
            search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDepartment(undefined);
                setSelectedLevel(undefined);
                setSelectedStatus(undefined);
                setSearch("");
              }}
              className="h-10 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
            >
              Reset
              <SlidersHorizontal className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {studentsLoading ? (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <StudentCardSkeleton key={i} />
            ))}
          </div>
        ) : students.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-20 text-center bg-muted/10"
          >
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <GraduationCap className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No students found</h3>
            <p className="mb-6 mt-2 text-muted-foreground max-w-sm">
              {debouncedSearch ||
              selectedDepartment ||
              selectedLevel ||
              selectedStatus
                ? "No students match your current filters. Try adjusting your search criteria."
                : "The student database is currently empty. Start by adding your first student."}
            </p>
            {!debouncedSearch &&
              !selectedDepartment &&
              !selectedLevel &&
              !selectedStatus && (
                <div className="flex gap-3">
                  <StudentBulkUploadDialog />
                  <CreateStudentDialog />
                </div>
              )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "grid gap-4",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              {students.map((student) =>
                viewMode === "grid" ? (
                  <StudentCard key={student.id} student={student} />
                ) : (
                  <StudentListItem key={student.id} student={student} />
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {studentsData && studentsData.meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t py-6 mt-8">
          <p className="text-sm text-muted-foreground">
            Displaying{" "}
            <span className="font-semibold text-foreground">
              {students.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {studentsData.meta.total}
            </span>{" "}
            students
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={studentsData.meta.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={studentsData.meta.page === studentsData.meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
