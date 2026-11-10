import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { businessApi } from "../api/business.api";
import type {
  Business,
  CreateBusinessDto,
  UpdateBusinessDto,
  BulkImportBusinessDto,
} from "../types";

export const useBusinesses = (params?: {
  businessListId?: string;
  cursor?: string;
  limit?: number;
}): UseQueryResult<Business[], Error> => {
  return useQuery<Business[], Error>({
    queryKey: ["businesses", params],
    queryFn: () => businessApi.getAllBusinesses(params),
  });
};

export const useBusiness = (id: string): UseQueryResult<Business, Error> => {
  return useQuery<Business, Error>({
    queryKey: ["business", id],
    queryFn: () => businessApi.getBusinessById(id),
    enabled: !!id,
  });
};

export const useCreateBusiness = (): UseMutationResult<
  unknown,
  Error,
  CreateBusinessDto
> => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateBusinessDto>({
    mutationFn: (data) => businessApi.createBusiness(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({
        queryKey: ["business-list", variables.businessListId],
      });
      queryClient.invalidateQueries({ queryKey: ["business-lists"] });
    },
  });
};

export const useBulkImportBusinesses = (): UseMutationResult<
  unknown,
  Error,
  BulkImportBusinessDto
> => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, BulkImportBusinessDto>({
    mutationFn: (data) => businessApi.bulkImport(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({
        queryKey: ["business-list", variables.businessListId],
      });
      queryClient.invalidateQueries({ queryKey: ["business-lists"] });
    },
  });
};

export const useUpdateBusiness = (): UseMutationResult<
  unknown,
  Error,
  { id: string; businessListId: string; data: UpdateBusinessDto }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { id: string; businessListId: string; data: UpdateBusinessDto }
  >({
    mutationFn: ({ id, data }) => businessApi.updateBusiness(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["business", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["business-list", variables.businessListId],
      });
      queryClient.invalidateQueries({ queryKey: ["business-lists"] });
    },
  });
};

export const useDeleteBusiness = (): UseMutationResult<
  unknown,
  Error,
  { id: string; businessListId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { id: string; businessListId: string }>({
    mutationFn: ({ id }) => businessApi.deleteBusiness(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({
        queryKey: ["business-list", variables.businessListId],
      });
      queryClient.invalidateQueries({ queryKey: ["business-lists"] });
    },
  });
};

export const useSearchBusinesses = (params?: {
  q?: string;
  cursor?: string;
  limit?: number;
}): UseQueryResult<Business[], Error> => {
  return useQuery<Business[], Error>({
    queryKey: ["businesses", "search", params],
    queryFn: () => businessApi.searchBusinesses(params),
    enabled: !!params?.q,
  });
};

export const useFilterBusinesses = (params?: {
  businessListId?: string;
  leadStatus?: string;
  emailStatus?: string;
  whatsappStatus?: string;
  city?: string;
  minRating?: number;
  cursor?: string;
  limit?: number;
}): UseQueryResult<Business[], Error> => {
  return useQuery<Business[], Error>({
    queryKey: ["businesses", "filter", params],
    queryFn: () => businessApi.filterBusinesses(params),
  });
};
