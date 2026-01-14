import { api } from "@/lib/api";
import type {
  Staff,
  CreateStaffInput,
  UpdateStaffInput,
  StaffStats,
  BulkUploadResult,
  PaginatedResponse,
  PaginationParams,
  EmploymentType,
  Course,
} from "@/lib/types";

export const staffService = {
  // CRUD operations
  getStaff: (params?: PaginationParams & { departmentId?: string; employmentType?: EmploymentType }) =>
    api.get<PaginatedResponse<Staff>>("/admin/staff", params as Record<string, string | number | boolean | undefined>),

  getStaffById: (id: string) =>
    api.get<Staff>(`/admin/staff/${id}`),

  createStaff: (data: CreateStaffInput) =>
    api.post<Staff>("/admin/staff", data),

  updateStaff: (id: string, data: UpdateStaffInput) =>
    api.patch<Staff>(`/admin/staff/${id}`, data),

  deleteStaff: (id: string) =>
    api.delete<{ success: boolean }>(`/admin/staff/${id}`),

  // Statistics
  getStaffStats: () =>
    api.get<StaffStats>("/admin/staff/stats"),

  // Courses assigned to staff
  getStaffCourses: (id: string) =>
    api.get<Course[]>(`/admin/staff/${id}/courses`),

  // Bulk operations
  bulkUpload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<BulkUploadResult>("/admin/staff/bulk-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  downloadTemplate: (format: "csv" | "excel") =>
    api.get<Blob>(`/admin/staff/bulk-upload/template`, { format }, {
      responseType: "blob",
    }),

  exportStaff: (format: "csv" | "excel") =>
    api.get<Blob>("/admin/staff/export", { format }, {
      responseType: "blob",
    }),
};
