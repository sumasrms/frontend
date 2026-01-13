import { api } from "@/lib/api";
import type {
  Course,
  CreateCourseInput,
  UpdateCourseInput,
  PaginatedResponse,
  PaginationParams,
} from "@/lib/types";

export const courseService = {
  getCourses: (params?: PaginationParams & { department?: string; level?: number; semester?: number }) =>
    api.get<PaginatedResponse<Course>>("/api/courses", params as Record<string, string | number | boolean | undefined>),

  getCourse: (courseId: string) =>
    api.get<Course>(`/api/courses/${courseId}`),

  getCourseByCode: (code: string) =>
    api.get<Course>(`/api/courses/code/${code}`),

  createCourse: (data: CreateCourseInput) =>
    api.post<Course>("/api/courses", data),

  updateCourse: (courseId: string, data: UpdateCourseInput) =>
    api.patch<Course>(`/api/courses/${courseId}`, data),

  deleteCourse: (courseId: string) =>
    api.delete<{ success: boolean }>(`/api/courses/${courseId}`),

  // Course registration
  getRegisteredStudents: (courseId: string, sessionId: string) =>
    api.get<PaginatedResponse<{ studentId: string; student: { name: string; matricNumber: string } }>>(
      `/api/courses/${courseId}/students`,
      { sessionId }
    ),
};
