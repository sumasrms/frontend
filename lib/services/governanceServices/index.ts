import { api } from "@/lib/api";
import type {
  Faculty,
  CreateFacultyInput,
  UpdateFacultyInput,
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  PaginatedResponse,
  PaginationParams,
  CreateGradeScaleInput,
  GradeScale,
  DepartmentStats,
} from "@/lib/types";

export const governanceService = {
  // Faculties
  getFaculties: (params?: PaginationParams) =>
    api.get<PaginatedResponse<Faculty>>("/admin/faculties", params as Record<string, string | number | boolean | undefined>),

  getFaculty: (facultyId: string) =>
    api.get<Faculty>(`/admin/faculties/${facultyId}`),

  getFacultyByCode: (code: string) =>
    api.get<Faculty>(`/admin/faculties/by-code/${code}`),

  createFaculty: (data: CreateFacultyInput) =>
    api.post<Faculty>("/admin/faculties", data),

  updateFaculty: (facultyId: string, data: UpdateFacultyInput) =>
    api.patch<Faculty>(`/admin/faculties/${facultyId}`, data),

  deleteFaculty: (facultyId: string) =>
    api.delete<{ success: boolean }>(`/admin/faculties/${facultyId}`),

  assignDean: (facultyId: string, deanId: string) =>
    api.patch<{ success: boolean }>(`/admin/faculties/${facultyId}/dean/${deanId}`),

  // Departments
  getDepartments: (params?: PaginationParams & { facultyId?: string }) =>
    api.get<PaginatedResponse<Department>>("/admin/departments", params as Record<string, string | number | boolean | undefined>),

  getDepartment: (departmentId: string) =>
    api.get<Department>(`/admin/departments/${departmentId}`),

  getDepartmentByCode: (code: string) =>
    api.get<Department>(`/admin/departments/by-code/${code}`),

  createDepartment: (data: CreateDepartmentInput) =>
    api.post<Department>("/admin/departments", data),

  updateDepartment: (departmentId: string, data: UpdateDepartmentInput) =>
    api.patch<Department>(`/admin/departments/${departmentId}`, data),

  deleteDepartment: (departmentId: string) =>
    api.delete<{ success: boolean }>(`/admin/departments/${departmentId}`),

  assignHOD: (departmentId: string, hodId: string) =>
    api.patch<{ success: boolean }>(`/admin/departments/${departmentId}/hod/${hodId}`),

  getDepartmentStats: () =>
    api.get<DepartmentStats>("/admin/departments/stats"),

  addGradeScales: (departmentId: string, data: CreateGradeScaleInput) =>
    api.post<GradeScale>(`/admin/departments/${departmentId}/grade-scales`, data),
};
