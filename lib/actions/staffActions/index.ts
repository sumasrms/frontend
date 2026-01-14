"use server";

import { revalidatePath } from "next/cache";
import { staffService } from "@/lib/services/staffServices";
import type { CreateStaffInput, UpdateStaffInput } from "@/lib/types";

export async function createStaffAction(data: CreateStaffInput) {
  try {
    const result = await staffService.createStaff(data);
    revalidatePath("/dashboard/staffs");
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create staff",
      errors: error.response?.data?.errors,
    };
  }
}

export async function updateStaffAction(id: string, data: UpdateStaffInput) {
  try {
    const result = await staffService.updateStaff(id, data);
    revalidatePath("/dashboard/staffs");
    revalidatePath(`/dashboard/staffs/${id}`);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update staff",
      errors: error.response?.data?.errors,
    };
  }
}

export async function deleteStaffAction(id: string) {
  try {
    await staffService.deleteStaff(id);
    revalidatePath("/dashboard/staffs");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete staff",
    };
  }
}

export async function bulkUploadStaffAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    const result = await staffService.bulkUpload(file);
    revalidatePath("/dashboard/staffs");
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to upload file",
    };
  }
}
