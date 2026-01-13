"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { governanceService } from "@/lib/services/governanceServices";
import { governanceKeys } from "../keys";
import type {
  PaginationParams,
  CreateFacultyInput,
  UpdateFacultyInput,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  CreateGradeScaleInput,
} from "@/lib/types";

// ============ FACULTY QUERIES ============

export const useFacultiesQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: governanceKeys.facultyList(params as Record<string, unknown>),
    queryFn: () => governanceService.getFaculties(params),
  });
};

export const useFacultyQuery = (facultyId: string) => {
  return useQuery({
    queryKey: governanceKeys.faculty(facultyId),
    queryFn: () => governanceService.getFaculty(facultyId),
    enabled: !!facultyId,
  });
};

export const useFacultyByCodeQuery = (code: string) => {
  return useQuery({
    queryKey: governanceKeys.facultyByCode(code),
    queryFn: () => governanceService.getFacultyByCode(code),
    enabled: !!code,
  });
};

// ============ FACULTY MUTATIONS ============

export const useCreateFacultyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFacultyInput) => governanceService.createFaculty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.faculties() });
      toast.success("Faculty created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create faculty");
    },
  });
};

export const useUpdateFacultyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ facultyId, data }: { facultyId: string; data: UpdateFacultyInput }) =>
      governanceService.updateFaculty(facultyId, data),
    onSuccess: (_, { facultyId }) => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.faculty(facultyId) });
      queryClient.invalidateQueries({ queryKey: governanceKeys.faculties() });
      toast.success("Faculty updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update faculty");
    },
  });
};

export const useDeleteFacultyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (facultyId: string) => governanceService.deleteFaculty(facultyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.faculties() });
      toast.success("Faculty deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete faculty");
    },
  });
};

export const useAssignDeanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ facultyId, deanId }: { facultyId: string; deanId: string }) =>
      governanceService.assignDean(facultyId, deanId),
    onSuccess: (_, { facultyId }) => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.faculty(facultyId) });
      queryClient.invalidateQueries({ queryKey: governanceKeys.faculties() });
      toast.success("Dean assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign dean");
    },
  });
};

// ============ DEPARTMENT QUERIES ============

export const useDepartmentsQuery = (params?: PaginationParams & { facultyId?: string }) => {
  return useQuery({
    queryKey: governanceKeys.departmentList(params as Record<string, unknown>),
    queryFn: () => governanceService.getDepartments(params),
  });
};

export const useDepartmentStatsQuery = () => {
  return useQuery({
    queryKey: governanceKeys.departmentStats(),
    queryFn: () => governanceService.getDepartmentStats(),
  });
};

export const useDepartmentQuery = (departmentId: string) => {
  return useQuery({
    queryKey: governanceKeys.department(departmentId),
    queryFn: () => governanceService.getDepartment(departmentId),
    enabled: !!departmentId,
  });
};

export const useDepartmentByCodeQuery = (code: string) => {
  return useQuery({
    queryKey: governanceKeys.departmentByCode(code), // Ensure this key exists or create it
    queryFn: () => governanceService.getDepartmentByCode(code),
    enabled: !!code,
  });
};

// ============ DEPARTMENT MUTATIONS ============

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentInput) => governanceService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.departments() });
      toast.success("Department created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create department");
    },
  });
};

export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, data }: { departmentId: string; data: UpdateDepartmentInput }) =>
      governanceService.updateDepartment(departmentId, data),
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.department(departmentId) });
      queryClient.invalidateQueries({ queryKey: governanceKeys.departments() });
      toast.success("Department updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update department");
    },
  });
};

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) => governanceService.deleteDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.departments() });
      toast.success("Department deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete department");
    },
  });
};

export const useAssignHODMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, hodId }: { departmentId: string; hodId: string }) =>
      governanceService.assignHOD(departmentId, hodId),
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.department(departmentId) });
      queryClient.invalidateQueries({ queryKey: governanceKeys.departments() });
      toast.success("HOD assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign HOD");
    },
  });
};

export const useAddGradeScalesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, data }: { departmentId: string; data: CreateGradeScaleInput }) =>
      governanceService.addGradeScales(departmentId, data),
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.department(departmentId) });
      toast.success("Grade scale added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add grade scale");
    },
  });
};
