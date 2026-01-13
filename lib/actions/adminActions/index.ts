"use server";

import { api, ApiError } from "@/lib/api";
import type { AdminUser, CreateUserInput, UpdateUserInput, BanUserInput } from "@/lib/types/admin";

export async function createUserAction(data: CreateUserInput) {
  try {
    const user = await api.post<AdminUser>("/api/admin/users", data);
    return { success: true, data: user };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUserAction(userId: string, data: UpdateUserInput) {
  try {
    const user = await api.patch<AdminUser>(`/api/admin/users/${userId}`, data);
    return { success: true, data: user };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.errors };
    }
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    await api.delete<{ success: boolean }>(`/api/admin/users/${userId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete user" };
  }
}

export async function banUserAction(data: BanUserInput) {
  try {
    await api.post<{ success: boolean }>("/api/admin/users/ban", data);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to ban user" };
  }
}

export async function unbanUserAction(userId: string) {
  try {
    await api.post<{ success: boolean }>(`/api/admin/users/${userId}/unban`);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to unban user" };
  }
}
