import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/lib/services/staffServices";
import { staffKeys } from "@/data/keys";
import type { PaginationParams, EmploymentType } from "@/lib/types";

export function useStaffQuery(params?: PaginationParams & { departmentId?: string; employmentType?: EmploymentType }) {
  return useQuery({
    queryKey: staffKeys.list(params as Record<string, unknown>),
    queryFn: () => staffService.getStaff(params),
  });
}

export function useStaffByIdQuery(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffService.getStaffById(id),
    enabled: !!id,
  });
}

export function useStaffStatsQuery() {
  return useQuery({
    queryKey: staffKeys.stats(),
    queryFn: () => staffService.getStaffStats(),
  });
}

export function useStaffCoursesQuery(id: string) {
  return useQuery({
    queryKey: staffKeys.courses(id),
    queryFn: () => staffService.getStaffCourses(id),
    enabled: !!id,
  });
}

// Download hooks
export function useDownloadTemplate() {
  return useMutation({
    mutationFn: (format: "csv" | "excel") => staffService.downloadTemplate(format),
    onSuccess: (blob, format) => {
      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `staff-template.${format === "excel" ? "xlsx" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}

export function useExportStaff() {
  return useMutation({
    mutationFn: (format: "csv" | "excel") => staffService.exportStaff(format),
    onSuccess: (blob, format) => {
      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `staff-export-${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}
