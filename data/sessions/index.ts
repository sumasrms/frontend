"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sessionService } from "@/lib/services/sessionServices";
import { sessionKeys } from "../keys";
import type { PaginationParams, CreateAcademicSessionInput } from "@/lib/types";

// Queries
export const useAcademicSessionsQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: () => sessionService.getSessions(params),
  });
};

export const useAcademicSessionQuery = (sessionId: string) => {
  return useQuery({
    queryKey: sessionKeys.detail(sessionId),
    queryFn: () => sessionService.getSession(sessionId),
    enabled: !!sessionId,
  });
};

export const useActiveSessionQuery = () => {
  return useQuery({
    queryKey: sessionKeys.active(),
    queryFn: () => sessionService.getActiveSession(),
  });
};

// Mutations
export const useCreateSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAcademicSessionInput) => sessionService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success("Academic session created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create session");
    },
  });
};

export const useUpdateSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: Partial<CreateAcademicSessionInput> }) =>
      sessionService.updateSession(sessionId, data),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(sessionId) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success("Academic session updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update session");
    },
  });
};

export const useDeleteSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionService.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success("Academic session deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete session");
    },
  });
};

export const useSetActiveSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionService.setActiveSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all() });
      toast.success("Active session updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to set active session");
    },
  });
};
