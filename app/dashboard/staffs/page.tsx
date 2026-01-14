"use client";

import { useState } from "react";
import { Plus, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateStaffDialog } from "@/components/admin/CreateStaffDialog";
import { BulkUploadDialog } from "@/components/admin/BulkUploadDialog";
import { StaffCard, StaffCardSkeleton } from "@/components/admin/StaffCard";
import { StaffStatsCards } from "@/components/admin/StaffStatsCards";
import { useStaffQuery } from "@/data/staff";
import { useDepartmentsQuery } from "@/data/governance";
import { useExportStaff } from "@/data/staff";
import { toast } from "sonner";
import type { EmploymentType } from "@/lib/types";

export default function StaffsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >();
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<
    EmploymentType | undefined
  >();

  const queryParams = {
    ...(selectedDepartment && { departmentId: selectedDepartment }),
    ...(selectedEmploymentType && { employmentType: selectedEmploymentType }),
  };

  const { data: staffData, isLoading: staffLoading } =
    useStaffQuery(queryParams);
  const { data: departmentsData } = useDepartmentsQuery({ limit: 100 });
  const exportStaff = useExportStaff();

  const staff = staffData?.data || [];
  const departments = departmentsData?.data || [];

  const handleExport = (format: "csv" | "excel") => {
    exportStaff.mutate(format, {
      onSuccess: () => {
        toast.success(`Staff data exported successfully`);
      },
      onError: () => {
        toast.error("Failed to export staff data");
      },
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <StaffStatsCards />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">
            Manage staff members and their assignments
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => setBulkUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={selectedDepartment || "all"}
          onValueChange={(value) =>
            setSelectedDepartment(value === "all" ? undefined : value)
          }
        >
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

        <Select
          value={selectedEmploymentType || "all"}
          onValueChange={(value) =>
            setSelectedEmploymentType(
              value === "all" ? undefined : (value as EmploymentType)
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="FULL_TIME">Full Time</SelectItem>
            <SelectItem value="PART_TIME">Part Time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="VISITING">Visiting</SelectItem>
          </SelectContent>
        </Select>

        {(selectedDepartment || selectedEmploymentType) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedDepartment(undefined);
              setSelectedEmploymentType(undefined);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Staff Grid */}
      {staffLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StaffCardSkeleton key={i} />
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No staff found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {selectedDepartment || selectedEmploymentType
                ? "No staff match your filters. Try adjusting your search criteria."
                : "You haven't added any staff yet. Get started by adding your first staff member."}
            </p>
            {!selectedDepartment && !selectedEmploymentType && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((staffMember) => (
            <StaffCard key={staffMember.id} staff={staffMember} />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateStaffDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        departmentCode={selectedDepartment}
      />
      <BulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
      />
    </div>
  );
}
