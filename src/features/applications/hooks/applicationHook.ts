import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../api/applicationsApi";
import { toast } from "react-hot-toast";
import type {
  Application,
  CreateApplicationFormData,
} from "../types/application.types";

// ──── Query Keys ────────────────────────────────

export const APPLICATIONS_KEY = "applications";

// ──── Queries (Read) ────────────────────────────

// Get all applications
export function useApplications() {
  return useQuery<Application[]>({
    queryKey: [APPLICATIONS_KEY],
    queryFn: applicationsApi.getAllApplications,
  });
}

// Get single application by ID
export function useApplication(id: string) {
  return useQuery<Application>({
    queryKey: [APPLICATIONS_KEY, id],
    queryFn: () => applicationsApi.getApplicationById(id),
    enabled: !!id,
  });
}

// ──── Mutations (Create/Delete) ──────────────────

// Create application (public)
export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationFormData) =>
      applicationsApi.createApplication(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_KEY] });
      toast.success(response.message || "Application submitted successfully!");
    },
  });
}

// Delete application (admin only)
export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationsApi.deleteApplication(id),
    onSuccess: (response, id) => {
      // Remove the deleted item from cache (prevents 404 on refetch)
      queryClient.removeQueries({ queryKey: [APPLICATIONS_KEY, id] });
      // Invalidate the list to refresh it
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_KEY] });
      // Show backend success message
      toast.success(response.message || "Application deleted successfully!");
    },
  });
}
