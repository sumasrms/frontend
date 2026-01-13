import { api } from "@/lib/api";
import type {
  AdminUser,
  AdminStats,
  AuditLog,
  AuditLogFilters,
  CreateUserInput,
  UpdateUserInput,
  BanUserInput,
  AdminUserFilters,
} from "@/lib/types/admin";
import type { PaginatedResponse, PaginationParams } from "@/lib/types";

// Admin User Management
export const adminService = {
  // Get admin dashboard stats
  getStats: () => api.get<AdminStats>("/admin/dashboard"),

  // Users
  getUsers: (params?: PaginationParams & AdminUserFilters) =>
    api.get<PaginatedResponse<AdminUser>>("/admin/users", params as Record<string, string | number | boolean | undefined>),


  getUser: (userId: string) =>
    api.get<AdminUser>(`/api/admin/users/${userId}`),

  createUser: (data: CreateUserInput) =>
    api.post<AdminUser>("/api/admin/users", data),

  updateUser: (userId: string, data: UpdateUserInput) =>
    api.patch<AdminUser>(`/api/admin/users/${userId}`, data),

  deleteUser: (userId: string) =>
    api.delete<{ success: boolean }>(`/api/admin/users/${userId}`),

  // Ban/Unban users
  banUser: (data: BanUserInput) =>
    api.post<{ success: boolean }>("/api/admin/users/ban", data),

  unbanUser: (userId: string) =>
    api.post<{ success: boolean }>(`/api/admin/users/${userId}/unban`),

  // Audit logs
  getAuditLogs: (params?: PaginationParams & AuditLogFilters) =>
    api.get<PaginatedResponse<AuditLog>>("/api/admin/audit-logs", params as Record<string, string | number | boolean | undefined>),

  // Impersonation
  impersonateUser: (userId: string) =>
    api.post<{ success: boolean }>(`/api/admin/impersonate/${userId}`),

  stopImpersonation: () =>
    api.post<{ success: boolean }>("/api/admin/stop-impersonation"),
};
