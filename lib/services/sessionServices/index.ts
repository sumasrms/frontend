import { api } from "@/lib/api";
import type {
  AcademicSession,
  CreateAcademicSessionInput,
  PaginatedResponse,
  PaginationParams,
} from "@/lib/types";

export const sessionService = {
  getSessions: (params?: PaginationParams) =>
    api.get<PaginatedResponse<AcademicSession>>("/api/sessions", params),

  getSession: (sessionId: string) =>
    api.get<AcademicSession>(`/api/sessions/${sessionId}`),

  getActiveSession: () =>
    api.get<AcademicSession>("/api/sessions/active"),

  createSession: (data: CreateAcademicSessionInput) =>
    api.post<AcademicSession>("/api/sessions", data),

  updateSession: (sessionId: string, data: Partial<CreateAcademicSessionInput>) =>
    api.patch<AcademicSession>(`/api/sessions/${sessionId}`, data),

  deleteSession: (sessionId: string) =>
    api.delete<{ success: boolean }>(`/api/sessions/${sessionId}`),

  setActiveSession: (sessionId: string) =>
    api.post<{ success: boolean }>(`/api/sessions/${sessionId}/activate`),
};
