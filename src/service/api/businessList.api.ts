import axiosInstance from "../../lib/axios";
import type {
  BusinessList,
  CreateBusinessListDto,
  UpdateBusinessListDto,
  BulkCreateBusinessListDto,
  BusinessListDetail,
} from "../types";

const BASE_URL = "/business-lists";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export const businessListApi = {
  getAllBusinessLists: async (params?: {
    cursor?: string;
    limit?: number;
  }): Promise<BusinessList[]> => {
    const response = await axiosInstance.get<ApiEnvelope<BusinessList[]>>(
      BASE_URL,
      { params },
    );
    return response.data.data;
  },

  getBusinessListById: async (id: string): Promise<BusinessListDetail> => {
    const response = await axiosInstance.get<ApiEnvelope<BusinessListDetail>>(
      `${BASE_URL}/${id}`,
    );
    return response.data.data;
  },

  createBusinessList: async (
    data: CreateBusinessListDto,
  ): Promise<ApiEnvelope<BusinessList>> => {
    const response = await axiosInstance.post<ApiEnvelope<BusinessList>>(
      BASE_URL,
      data,
      { successMessage: "Business list created successfully!" },
    );
    return response.data;
  },

  createBusinessListsBulk: async (
    data: BulkCreateBusinessListDto,
  ): Promise<ApiEnvelope<BusinessList[]>> => {
    const response = await axiosInstance.post<ApiEnvelope<BusinessList[]>>(
      `${BASE_URL}/bulk`,
      data,
      { successMessage: "Business lists created successfully!" },
    );
    return response.data;
  },

  updateBusinessList: async (
    id: string,
    data: UpdateBusinessListDto,
  ): Promise<ApiEnvelope<BusinessList>> => {
    const response = await axiosInstance.put<ApiEnvelope<BusinessList>>(
      `${BASE_URL}/${id}`,
      data,
      { successMessage: "Business list updated successfully!" },
    );
    return response.data;
  },

  deleteBusinessList: async (id: string): Promise<ApiEnvelope<null>> => {
    const response = await axiosInstance.delete<ApiEnvelope<null>>(
      `${BASE_URL}/${id}`,
      { successMessage: "Business list deleted successfully!" },
    );
    return response.data;
  },

  searchBusinessLists: async (params?: {
    q?: string;
    cursor?: string;
    limit?: number;
  }): Promise<BusinessList[]> => {
    const response = await axiosInstance.get<ApiEnvelope<BusinessList[]>>(
      `${BASE_URL}/search`,
      { params },
    );
    return response.data.data;
  },

  filterBusinessLists: async (params?: {
    category?: string;
    location?: string;
    keyword?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    cursor?: string;
    limit?: number;
  }): Promise<BusinessList[]> => {
    const response = await axiosInstance.get<ApiEnvelope<BusinessList[]>>(
      `${BASE_URL}/filter`,
      { params },
    );
    return response.data.data;
  },
};
