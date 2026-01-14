import { api } from "@/lib/api";
import type {
  Course,
  CreateCourseInput,
  UpdateCourseInput,
  PaginatedResponse,
  PaginationParams,
} from "@/lib/types";

export const courseService = {
  getCourses: (
    params?: PaginationParams & {
      departmentId?: string;
      level?: number;
      semester?: string;
    }
  ) =>
    api.get<PaginatedResponse<Course>>(
      "/admin/courses",
      params as Record<string, string | number | boolean | undefined>
    ),

  getCourse: (courseId: string) =>
    api.get<Course>(`/admin/courses/${courseId}`),

  getCourseByCode: (code: string) =>
    api.get<Course>(`/admin/courses/code/${code}`),

  createCourse: (data: CreateCourseInput) =>
    api.post<Course>("/admin/courses", data),

  updateCourse: (courseId: string, data: UpdateCourseInput) =>
    api.patch<Course>(`/admin/courses/${courseId}`, data),

  deleteCourse: (courseId: string) =>
    api.delete<{ success: boolean }>(`/admin/courses/${courseId}`),

  // Instructor Management
  assignInstructor: (
    courseId: string,
    data: { instructorId: string; isPrimary?: boolean }
  ) =>
    api.post<{ success: boolean }>(
      `/admin/courses/${courseId}/instructors`,
      data
    ),

  removeInstructor: (courseId: string, instructorId: string) =>
    api.delete<{ success: boolean }>(
      `/admin/courses/${courseId}/instructors/${instructorId}`
    ),

  // Course registration
  getRegisteredStudents: (courseId: string, sessionId: string) =>
    api.get<
      PaginatedResponse<{
        studentId: string;
        student: { name: string; matricNumber: string };
      }>
    >(`/admin/courses/${courseId}/students`, { sessionId }),
};
