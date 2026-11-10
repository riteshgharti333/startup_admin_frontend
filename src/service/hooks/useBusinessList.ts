import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessListApi } from "../api/businessList.api";
import type {
  CreateBusinessListDto,
  UpdateBusinessListDto,
  BulkCreateBusinessListDto,
} from "../types";

export const useBusinessLists = (params?: {
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["business-lists", params],
    queryFn: () => businessListApi.getAllBusinessLists(params),
  });
};

export const useBusinessList = (id: string) => {
  return useQuery({
    queryKey: ["business-list", id],
    queryFn: () => businessListApi.getBusinessListById(id),
    enabled: !!id,
  });
};

export const useCreateBusinessList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBusinessListDto) =>
      businessListApi.createBusinessList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-lists"] });
    },
  });
};

export const useCreateBusinessListsBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateBusinessListDto) =>
      businessListApi.createBusinessListsBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-lists"] });
    },
  });
};

export const useUpdateBusinessList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBusinessListDto }) =>
      businessListApi.updateBusinessList(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["business-lists"] });
      queryClient.invalidateQueries({
        queryKey: ["business-list", variables.id],
      });
    },
  });
};

export const useDeleteBusinessList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => businessListApi.deleteBusinessList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-lists"] });
    },
  });
};

export const useSearchBusinessLists = (params?: {
  q?: string;
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["business-lists", "search", params],
    queryFn: () => businessListApi.searchBusinessLists(params),
    enabled: !!params?.q,
  });
};

export const useFilterBusinessLists = (params?: {
  category?: string;
  location?: string;
  keyword?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["business-lists", "filter", params],
    queryFn: () => businessListApi.filterBusinessLists(params),
  });
};
