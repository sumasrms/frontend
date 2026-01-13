import { api } from "@/lib/api";
import type {
  Result,
  CreateResultInput,
  UpdateResultInput,
  PaginatedResponse,
  PaginationParams,
} from "@/lib/types";

export const resultService = {
  getResults: (params?: PaginationParams & { sessionId?: string; courseId?: string; studentId?: string }) =>
    api.get<PaginatedResponse<Result>>("/api/results", params as Record<string, string | number | boolean | undefined>),

  getResult: (resultId: string) =>
    api.get<Result>(`/api/results/${resultId}`),

  createResult: (data: CreateResultInput) =>
    api.post<Result>("/api/results", data),

  createBulkResults: (data: CreateResultInput[]) =>
    api.post<{ success: boolean; count: number }>("/api/results/bulk", data),

  updateResult: (resultId: string, data: UpdateResultInput) =>
    api.patch<Result>(`/api/results/${resultId}`, data),

  deleteResult: (resultId: string) =>
    api.delete<{ success: boolean }>(`/api/results/${resultId}`),

  // Grade calculations
  calculateGrade: (score: number) =>
    api.post<{ grade: string; gradePoint: number }>("/api/results/calculate-grade", { score }),

  // Semester results
  getSemesterResults: (studentId: string, sessionId: string, semester: 1 | 2) =>
    api.get<{ results: Result[]; gpa: number; totalCredits: number }>(
      `/api/results/semester/${studentId}`,
      { sessionId, semester }
    ),
};
