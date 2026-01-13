import { api } from "@/lib/api";
import type {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  PaginatedResponse,
  PaginationParams,
} from "@/lib/types";

export const studentService = {
  getStudents: (params?: PaginationParams) =>
    api.get<PaginatedResponse<Student>>("/api/students", params),

  getStudent: (studentId: string) =>
    api.get<Student>(`/api/students/${studentId}`),

  getStudentByMatric: (matricNumber: string) =>
    api.get<Student>(`/api/students/matric/${matricNumber}`),

  createStudent: (data: CreateStudentInput) =>
    api.post<Student>("/api/students", data),

  updateStudent: (studentId: string, data: UpdateStudentInput) =>
    api.patch<Student>(`/api/students/${studentId}`, data),

  deleteStudent: (studentId: string) =>
    api.delete<{ success: boolean }>(`/api/students/${studentId}`),

  // Student results
  getStudentResults: (studentId: string, sessionId?: string) =>
    api.get<Student>(`/api/students/${studentId}/results`, { sessionId }),

  // Student transcript
  getStudentTranscript: (studentId: string) =>
    api.get<Blob>(`/api/students/${studentId}/transcript`),
};
