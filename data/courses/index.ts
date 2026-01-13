"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { courseService } from "@/lib/services/courseServices";
import { courseKeys } from "../keys";
import type { PaginationParams, CreateCourseInput, UpdateCourseInput } from "@/lib/types";

// Queries
export const useCoursesQuery = (params?: PaginationParams & { department?: string; level?: number; semester?: number }) => {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => courseService.getCourses(params),
  });
};

export const useCourseQuery = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => courseService.getCourse(courseId),
    enabled: !!courseId,
  });
};

export const useCourseByCodeQuery = (code: string) => {
  return useQuery({
    queryKey: [...courseKeys.all(), "code", code],
    queryFn: () => courseService.getCourseByCode(code),
    enabled: !!code,
  });
};

export const useCourseStudentsQuery = (courseId: string, sessionId: string) => {
  return useQuery({
    queryKey: courseKeys.students(courseId, sessionId),
    queryFn: () => courseService.getRegisteredStudents(courseId, sessionId),
    enabled: !!courseId && !!sessionId,
  });
};

// Mutations
export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseInput) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success("Course created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create course");
    },
  });
};

export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: UpdateCourseInput }) =>
      courseService.updateCourse(courseId, data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success("Course updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update course");
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success("Course deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete course");
    },
  });
};
