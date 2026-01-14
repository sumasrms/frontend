"use server";

import { revalidatePath } from "next/cache";
import { courseService } from "@/lib/services/courseServices";
import { CreateCourseInput, UpdateCourseInput } from "@/lib/types";

export async function createCourseAction(data: CreateCourseInput) {
  try {
    const course = await courseService.createCourse(data);
    revalidatePath("/dashboard/courses");
    return { success: true, data: course };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create course",
      errors: error.errors,
    };
  }
}

export async function updateCourseAction(
  courseId: string,
  data: UpdateCourseInput
) {
  try {
    const course = await courseService.updateCourse(courseId, data);
    revalidatePath("/dashboard/courses");
    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: true, data: course };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update course",
      errors: error.errors,
    };
  }
}

export async function deleteCourseAction(courseId: string) {
  try {
    await courseService.deleteCourse(courseId);
    revalidatePath("/dashboard/courses");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete course",
    };
  }
}

export async function assignInstructorAction(
  courseId: string,
  data: { instructorId: string; isPrimary?: boolean }
) {
  try {
    await courseService.assignInstructor(courseId, data);
    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath("/dashboard/courses"); // specific course list might show instructors?
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to assign instructor",
    };
  }
}

export async function removeInstructorAction(
  courseId: string,
  instructorId: string
) {
  try {
    await courseService.removeInstructor(courseId, instructorId);
    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to remove instructor",
    };
  }
}
