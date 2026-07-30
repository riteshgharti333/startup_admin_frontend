import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadApi } from "../api/lead.api";
import type { CreateLeadDto, UpdateLeadDto } from "../types";

// Get all leads with pagination
export const useLeads = (params?: { cursor?: string; limit?: number }) => {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () => leadApi.getAllLeads(params),
  });
};

// Get single lead
export const useLead = (id: string) => {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => leadApi.getLeadById(id),
    enabled: !!id,
  });
};

// Create lead (public)
export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadDto) => leadApi.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

// Update lead (admin)
export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) =>
      leadApi.updateLead(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", variables.id] });
    },
  });
};

// Delete lead (admin)
export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

// Search leads
export const useSearchLeads = (params?: {
  q?: string;
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["leads", "search", params],
    queryFn: () => leadApi.searchLeads(params),
    enabled: !!params?.q,
  });
};

// Filter leads
export const useFilterLeads = (params?: {
  service?: string;
  status?: string;
  budget?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["leads", "filter", params],
    queryFn: () => leadApi.filterLeads(params),
  });
};
