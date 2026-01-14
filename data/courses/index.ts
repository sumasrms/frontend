import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/lib/services/courseServices";
import { PaginationParams } from "@/lib/types";
import { courseKeys } from "@/data/keys";
import {
  assignInstructorAction,
  removeInstructorAction,
} from "@/lib/actions/courseActions";

export const useCoursesQuery = (
  params?: PaginationParams & {
    departmentId?: string;
    level?: number;
    semester?: string;
  }
) => {
  return useQuery({
    queryKey: courseKeys.list(params as Record<string, unknown>),
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
    queryKey: courseKeys.byCode(code),
    queryFn: () => courseService.getCourseByCode(code),
    enabled: !!code,
  });
};

export const useAssignInstructorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: { instructorId: string; isPrimary?: boolean };
    }) => assignInstructorAction(courseId, data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
};

export const useRemoveInstructorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      instructorId,
    }: {
      courseId: string;
      instructorId: string;
    }) => removeInstructorAction(courseId, instructorId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
};
