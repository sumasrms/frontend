"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "@/lib/services/adminServices";
import { adminKeys } from "../keys";
import type { PaginationParams } from "@/lib/types";
import type { AuditLogFilters, CreateUserInput, UpdateUserInput, BanUserInput, AdminUserFilters } from "@/lib/types/admin";

// Queries
export const useAdminStatsQuery = () => {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.getStats(),
  });
};

export const useAdminUsersQuery = (params?: PaginationParams & AdminUserFilters) => {
  return useQuery({
    queryKey: adminKeys.usersList(params),
    queryFn: () => adminService.getUsers(params),
  });
};

export const useAdminUserQuery = (userId: string) => {
  return useQuery({
    queryKey: adminKeys.user(userId),
    queryFn: () => adminService.getUser(userId),
    enabled: !!userId,
  });
};

export const useAuditLogsQuery = (params?: PaginationParams & AuditLogFilters) => {
  return useQuery({
    queryKey: adminKeys.auditLogsList(params),
    queryFn: () => adminService.getAuditLogs(params),
  });
};

// Mutations
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => adminService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
};

export const useAdminUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserInput }) =>
      adminService.updateUser(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};

export const useBanUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BanUserInput) => adminService.banUser(data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success("User banned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to ban user");
    },
  });
};

export const useUnbanUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.unbanUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success("User unbanned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unban user");
    },
  });
};

export const useImpersonateUserMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => adminService.impersonateUser(userId),
    onSuccess: () => {
      toast.success("Now impersonating user");
      window.location.href = "/dashboard";
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to impersonate user");
    },
  });
};

export const useStopImpersonationMutation = () => {
  return useMutation({
    mutationFn: () => adminService.stopImpersonation(),
    onSuccess: () => {
      toast.success("Impersonation stopped");
      window.location.href = "/admin";
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to stop impersonation");
    },
  });
};
