import { api } from "@/lib/api";
import type {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  BulkPromoteInput,
  PaginatedResponse,
  PaginationParams,
} from "@/lib/types";

export const studentService = {
  getStudents: (
    params?: PaginationParams & {
      departmentId?: string;
      level?: number;
      status?: string;
    }
  ) =>
    api.get<PaginatedResponse<Student>>(
      "/admin/students",
      params as Record<string, string | number | boolean | null | undefined>
    ),

  getStudent: (id: string) => api.get<Student>(`/admin/students/${id}`),

  getStudentByMatric: (matricNumber: string) =>
    api.get<Student>(`/admin/students/matric/${matricNumber}`),

  createStudent: (data: CreateStudentInput) =>
    api.post<Student>("/admin/students", data),

  updateStudent: (id: string, data: UpdateStudentInput) =>
    api.patch<Student>(`/admin/students/${id}`, data),

  deleteStudent: (id: string) =>
    api.delete<{ success: boolean }>(`/admin/students/${id}`),

  // Promotions & Status
  promoteStudent: (id: string, level: number) =>
    api.patch<{ success: boolean }>(`/admin/students/${id}/promote/${level}`),

  updateStatus: (id: string, status: string) =>
    api.patch<{ success: boolean }>(`/admin/students/${id}/status/${status}`),

  bulkPromote: (data: BulkPromoteInput) =>
    api.post<{ success: boolean }>("/admin/students/bulk-promote", data),

  // Bulk operations
  bulkUpload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ success: boolean }>(
      "/admin/students/bulk-upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  downloadTemplate: (format: "csv" | "excel") =>
    api.get<Blob>(
      `/admin/students/bulk-upload/template`,
      { format },
      {
        responseType: "blob",
      }
    ),

  exportStudents: (format: "csv" | "excel") =>
    api.get<Blob>(
      "/admin/students/export",
      { format },
      {
        responseType: "blob",
      }
    ),

  // Student results
  getStudentResults: (studentId: string, sessionId?: string) =>
    api.get<Student>(`/admin/students/${studentId}/results`, { sessionId }),

  // Student transcript
  getStudentTranscript: (studentId: string) =>
    api.get<Blob>(
      `/admin/students/${studentId}/transcript`,
      {},
      {
        responseType: "blob",
      }
    ),
};
