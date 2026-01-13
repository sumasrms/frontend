"use server";

import { api, ApiError } from "@/lib/api";
import type { AcademicSession, CreateAcademicSessionInput } from "@/lib/types";

export async function createSessionAction(data: CreateAcademicSessionInput) {
  try {
    const session = await api.post<AcademicSession>("/api/sessions", data);
    return { success: true, data: session };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to create session" };
  }
}

export async function updateSessionAction(sessionId: string, data: Partial<CreateAcademicSessionInput>) {
  try {
    const session = await api.patch<AcademicSession>(`/api/sessions/${sessionId}`, data);
    return { success: true, data: session };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to update session" };
  }
}

export async function deleteSessionAction(sessionId: string) {
  try {
    await api.delete<{ success: boolean }>(`/api/sessions/${sessionId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete session" };
  }
}

export async function setActiveSessionAction(sessionId: string) {
  try {
    await api.post<{ success: boolean }>(`/api/sessions/${sessionId}/activate`);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to set active session" };
  }
}
