"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentService } from "@/lib/services/studentServices";
import { studentKeys } from "../keys";
import type { PaginationParams, CreateStudentInput, UpdateStudentInput } from "@/lib/types";

// Queries
export const useStudentsQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => studentService.getStudents(params),
  });
};

export const useStudentQuery = (studentId: string) => {
  return useQuery({
    queryKey: studentKeys.detail(studentId),
    queryFn: () => studentService.getStudent(studentId),
    enabled: !!studentId,
  });
};

export const useStudentByMatricQuery = (matricNumber: string) => {
  return useQuery({
    queryKey: [...studentKeys.all(), "matric", matricNumber],
    queryFn: () => studentService.getStudentByMatric(matricNumber),
    enabled: !!matricNumber,
  });
};

export const useStudentResultsQuery = (studentId: string, sessionId?: string) => {
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
    mutationFn: (data: CreateStudentInput) => studentService.createStudent(data),
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
    mutationFn: ({ studentId, data }: { studentId: string; data: UpdateStudentInput }) =>
      studentService.updateStudent(studentId, data),
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(studentId) });
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
    mutationFn: (studentId: string) => studentService.deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success("Student deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete student");
    },
  });
};
