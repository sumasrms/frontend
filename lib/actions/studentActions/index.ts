"use server";

import { api, ApiError } from "@/lib/api";
import type { Student, CreateStudentInput, UpdateStudentInput } from "@/lib/types";

export async function createStudentAction(data: CreateStudentInput) {
  try {
    const student = await api.post<Student>("/api/students", data);
    return { success: true, data: student };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to create student" };
  }
}

export async function updateStudentAction(studentId: string, data: UpdateStudentInput) {
  try {
    const student = await api.patch<Student>(`/api/students/${studentId}`, data);
    return { success: true, data: student };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to update student" };
  }
}

export async function deleteStudentAction(studentId: string) {
  try {
    await api.delete<{ success: boolean }>(`/api/students/${studentId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete student" };
  }
}
