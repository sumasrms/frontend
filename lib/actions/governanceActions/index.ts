"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api";
import type {
  Faculty,
  CreateFacultyInput,
  UpdateFacultyInput,
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/lib/types";

// ============ FACULTY ACTIONS ============

export async function createFacultyAction(data: CreateFacultyInput) {
  try {
    const faculty = await api.post<Faculty>("/admin/faculties", data);
    revalidatePath("/dashboard/governance/faculties");
    return { success: true, data: faculty };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to create faculty" };
  }
}

export async function updateFacultyAction(facultyId: string, data: UpdateFacultyInput) {
  try {
    const faculty = await api.patch<Faculty>(`/admin/faculties/${facultyId}`, data);
    revalidatePath("/dashboard/governance/faculties");
    revalidatePath(`/dashboard/governance/faculties/${faculty.code}`); // Also revalidate specific faculty page
    return { success: true, data: faculty };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to update faculty" };
  }
}

export async function deleteFacultyAction(facultyId: string) {
  try {
    await api.delete<{ success: boolean }>(`/admin/faculties/${facultyId}`);
    revalidatePath("/dashboard/governance/faculties");
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete faculty" };
  }
}

// ============ DEPARTMENT ACTIONS ============

export async function createDepartmentAction(data: CreateDepartmentInput) {
  try {
    const department = await api.post<Department>("/admin/departments", data);
    revalidatePath("/dashboard/governance/departments");
    revalidatePath("/dashboard/governance/faculties");
    return { success: true, data: department };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to create department" };
  }
}

export async function updateDepartmentAction(departmentId: string, data: UpdateDepartmentInput) {
  try {
    const department = await api.patch<Department>(`/admin/departments/${departmentId}`, data);
    revalidatePath("/dashboard/governance/departments");
    revalidatePath(`/dashboard/governance/departments/${department.code}`);
    // revalidatePath(`/dashboard/governance/departments/${departmentId}`); // If accessed by ID
    return { success: true, data: department };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to update department" };
  }
}

export async function deleteDepartmentAction(departmentId: string) {
  try {
    await api.delete<{ success: boolean }>(`/admin/departments/${departmentId}`);
    revalidatePath("/dashboard/governance/departments");
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete department" };
  }
}

export async function assignHODAction(departmentId: string, hodId: string) {
  try {
    await api.patch<{ success: boolean }>(`/admin/departments/${departmentId}/hod/${hodId}`);
    revalidatePath("/dashboard/governance/departments");
    // We might need to revalidate specific department pages too
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to assign HOD" };
  }
}

export async function addGradeScalesAction(departmentId: string, data: Record<string, unknown>) {
  try {
    const gradeScale = await api.post(`/admin/departments/${departmentId}/grade-scales`, data);
    revalidatePath(`/dashboard/governance/departments/${departmentId}`);
    return { success: true, data: gradeScale };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to add grade scale" };
  }
}
