"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resultService } from "@/lib/services/resultServices";
import { resultKeys, studentKeys } from "../keys";
import type { PaginationParams, CreateResultInput, UpdateResultInput } from "@/lib/types";

// Queries
export const useResultsQuery = (params?: PaginationParams & { sessionId?: string; courseId?: string; studentId?: string }) => {
  return useQuery({
    queryKey: resultKeys.list(params as Record<string, unknown>),
    queryFn: () => resultService.getResults(params),
  });
};

export const useResultQuery = (resultId: string) => {
  return useQuery({
    queryKey: resultKeys.detail(resultId),
    queryFn: () => resultService.getResult(resultId),
    enabled: !!resultId,
  });
};

export const useSemesterResultsQuery = (studentId: string, sessionId: string, semester: 1 | 2) => {
  return useQuery({
    queryKey: resultKeys.semester(studentId, sessionId, semester),
    queryFn: () => resultService.getSemesterResults(studentId, sessionId, semester),
    enabled: !!studentId && !!sessionId,
  });
};

// Mutations
export const useCreateResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResultInput) => resultService.createResult(data),
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({ queryKey: resultKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.results(studentId) });
      toast.success("Result created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create result");
    },
  });
};

export const useCreateBulkResultsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResultInput[]) => resultService.createBulkResults(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: resultKeys.lists() });
      toast.success(`${result.count} results created successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create results");
    },
  });
};

export const useUpdateResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ resultId, data }: { resultId: string; data: UpdateResultInput }) =>
      resultService.updateResult(resultId, data),
    onSuccess: (_, { resultId }) => {
      queryClient.invalidateQueries({ queryKey: resultKeys.detail(resultId) });
      queryClient.invalidateQueries({ queryKey: resultKeys.lists() });
      toast.success("Result updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update result");
    },
  });
};

export const useDeleteResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resultId: string) => resultService.deleteResult(resultId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resultKeys.lists() });
      toast.success("Result deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete result");
    },
  });
};
