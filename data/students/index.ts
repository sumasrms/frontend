"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentService } from "@/lib/services/studentServices";
import { studentKeys } from "../keys";
import type {
  PaginationParams,
  CreateStudentInput,
  UpdateStudentInput,
} from "@/lib/types";

import {
  createStudentAction,
  updateStudentAction,
  deleteStudentAction,
  promoteStudentAction,
  updateStudentStatusAction,
  bulkPromoteAction,
  bulkUploadStudentsAction,
} from "@/lib/actions/studentActions";

// Queries
export const useStudentsQuery = (
  params?: PaginationParams & {
    departmentId?: string;
    level?: number;
    status?: string;
  }
) => {
  return useQuery({
    queryKey: studentKeys.list(params as Record<string, unknown>),
    queryFn: () => studentService.getStudents(params),
  });
};

export const useStudentQuery = (id: string) => {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentService.getStudent(id),
    enabled: !!id,
  });
};

export const useStudentByMatricQuery = (matricNumber: string) => {
  return useQuery({
    queryKey: [...studentKeys.all(), "matric", matricNumber],
    queryFn: () => studentService.getStudentByMatric(matricNumber),
    enabled: !!matricNumber,
  });
};

export const useStudentResultsQuery = (
  studentId: string,
  sessionId?: string
) => {
  return useQuery({
    queryKey: studentKeys.results(studentId, sessionId),
    queryFn: () => studentService.getStudentResults(studentId, sessionId),
    enabled: !!studentId,
  });
};

// Mutations
export const useCreateStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentInput) => createStudentAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success("Student created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create student");
    },
  });
};

export const useUpdateStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentInput }) =>
      updateStudentAction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success("Student updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update student");
    },
  });
};

export const useDeleteStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStudentAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success("Student deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete student");
    },
  });
};

export const usePromoteStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, level }: { id: string; level: number }) =>
      promoteStudentAction(id, level),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success("Student promoted successfully");
    },
  });
};

export const useUpdateStudentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateStudentStatusAction(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success("Status updated successfully");
    },
  });
};

export const useBulkPromoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { studentIds: string[]; newLevel: number }) =>
      bulkPromoteAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success("Students promoted successfully");
    },
  });
};

// Download hooks
export const useDownloadStudentTemplate = () => {
  return useMutation({
    mutationFn: (format: "csv" | "excel") =>
      studentService.downloadTemplate(format),
    onSuccess: (blob, format) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students-template.${format === "excel" ? "xlsx" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
};

export const useExportStudents = () => {
  return useMutation({
    mutationFn: (format: "csv" | "excel") =>
      studentService.exportStudents(format),
    onSuccess: (blob, format) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students-export-${new Date().toISOString().split("T")[0]}.${
        format === "excel" ? "xlsx" : "csv"
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
};
export const useBulkUploadStudentsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => bulkUploadStudentsAction(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success("Students uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload students");
    },
  });
};
