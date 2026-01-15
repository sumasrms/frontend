"use server";

import { revalidatePath } from "next/cache";
import { studentService } from "@/lib/services/studentServices";
import {
  CreateStudentInput,
  UpdateStudentInput,
  BulkPromoteInput,
} from "@/lib/types";

export async function createStudentAction(data: CreateStudentInput) {
  try {
    const student = await studentService.createStudent(data);
    revalidatePath("/dashboard/students");
    return { success: true, data: student };
  } catch (error: unknown) {
    const err = error as any;
    return {
      success: false,
      error: err.message || "Failed to create student",
      errors: err.errors,
    };
  }
}

export async function updateStudentAction(
  id: string,
  data: UpdateStudentInput
) {
  try {
    const student = await studentService.updateStudent(id, data);
    revalidatePath("/dashboard/students");
    revalidatePath(`/dashboard/students/${student.matricNumber}`);
    return { success: true, data: student };
  } catch (error: unknown) {
    const err = error as any;
    return {
      success: false,
      error: err.message || "Failed to update student",
      errors: err.errors,
    };
  }
}

export async function deleteStudentAction(id: string) {
  try {
    await studentService.deleteStudent(id);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error: unknown) {
    const err = error as any;
    return {
      success: false,
      error: err.message || "Failed to delete student",
    };
  }
}

export async function promoteStudentAction(id: string, level: number) {
  try {
    await studentService.promoteStudent(id, level);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error: unknown) {
    const err = error as any;
    return {
      success: false,
      error: err.message || "Failed to promote student",
    };
  }
}

export async function updateStudentStatusAction(id: string, status: string) {
  try {
    await studentService.updateStatus(id, status);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error: unknown) {
    const err = error as any;
    return {
      success: false,
      error: err.message || "Failed to update student status",
    };
  }
}

export async function bulkPromoteAction(data: BulkPromoteInput) {
  try {
    await studentService.bulkPromote(data);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error: unknown) {
    const err = error as any;
    return {
      success: false,
      error: err.message || "Failed to promote students",
    };
  }
}

export async function bulkUploadStudentsAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    await studentService.bulkUpload(file);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error: unknown) {
    const err = error as any;
    return {
      success: false,
      error: err.message || "Failed to upload students",
    };
  }
}
