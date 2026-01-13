"use server";

import { api, ApiError } from "@/lib/api";
import type { Result, CreateResultInput, UpdateResultInput } from "@/lib/types";

export async function createResultAction(data: CreateResultInput) {
  try {
    const result = await api.post<Result>("/api/results", data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to create result" };
  }
}

export async function createBulkResultsAction(data: CreateResultInput[]) {
  try {
    const result = await api.post<{ success: boolean; count: number }>("/api/results/bulk", data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to create results" };
  }
}

export async function updateResultAction(resultId: string, data: UpdateResultInput) {
  try {
    const result = await api.patch<Result>(`/api/results/${resultId}`, data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to update result" };
  }
}

export async function deleteResultAction(resultId: string) {
  try {
    await api.delete<{ success: boolean }>(`/api/results/${resultId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete result" };
  }
}
