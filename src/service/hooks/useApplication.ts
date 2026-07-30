import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "../api/application.api";
import type { CreateApplicationDto, UpdateApplicationDto } from "../types";

// Get all applications with pagination
export const useApplications = (params?: {
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => applicationApi.getAllApplications(params),
  });
};

// Get single application
export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationApi.getApplicationById(id),
    enabled: !!id,
  });
};

// Submit application (public)
export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationDto) =>
      applicationApi.submitApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

// Update application (admin)
export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationDto }) =>
      applicationApi.updateApplication(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({
        queryKey: ["application", variables.id],
      });
    },
  });
};

// Delete application (admin)
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationApi.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

// Search applications
export const useSearchApplications = (params?: {
  q?: string;
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["applications", "search", params],
    queryFn: () => applicationApi.searchApplications(params),
    enabled: !!params?.q,
  });
};

// Filter applications
export const useFilterApplications = (params?: {
  position?: string;
  status?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["applications", "filter", params],
    queryFn: () => applicationApi.filterApplications(params),
  });
};
