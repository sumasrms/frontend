"use server";

import { api, ApiError } from "@/lib/api";
import type { Course, CreateCourseInput, UpdateCourseInput } from "@/lib/types";

export async function createCourseAction(data: CreateCourseInput) {
  try {
    const course = await api.post<Course>("/api/courses", data);
    return { success: true, data: course };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourseAction(courseId: string, data: UpdateCourseInput) {
  try {
    const course = await api.patch<Course>(`/api/courses/${courseId}`, data);
    return { success: true, data: course };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourseAction(courseId: string) {
  try {
    await api.delete<{ success: boolean }>(`/api/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete course" };
  }
}
