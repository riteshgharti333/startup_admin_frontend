import axiosInstance from "../../lib/axios";
import type {
  Business,
  CreateBusinessDto,
  UpdateBusinessDto,
  BulkImportBusinessDto,
} from "../types";

const BASE_URL = "/businesses";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export const businessApi = {
  getAllBusinesses: async (params?: {
    businessListId?: string;
    cursor?: string;
    limit?: number;
  }): Promise<Business[]> => {
    const response = await axiosInstance.get<ApiEnvelope<Business[]>>(
      BASE_URL,
      { params },
    );
    return response.data.data;
  },

  getBusinessById: async (id: string): Promise<Business> => {
    const response = await axiosInstance.get<ApiEnvelope<Business>>(
      `${BASE_URL}/${id}`,
    );
    return response.data.data;
  },

  createBusiness: async (
    data: CreateBusinessDto,
  ): Promise<ApiEnvelope<Business>> => {
    const response = await axiosInstance.post<ApiEnvelope<Business>>(
      BASE_URL,
      data,
      { successMessage: "Business created successfully!" },
    );
    return response.data;
  },

  bulkImport: async (
    data: BulkImportBusinessDto,
  ): Promise<ApiEnvelope<Business[]>> => {
    const response = await axiosInstance.post<ApiEnvelope<Business[]>>(
      `${BASE_URL}/bulk`,
      data,
      { successMessage: "Businesses imported successfully!" },
    );
    return response.data;
  },

  updateBusiness: async (
    id: string,
    data: UpdateBusinessDto,
  ): Promise<ApiEnvelope<Business>> => {
    const response = await axiosInstance.put<ApiEnvelope<Business>>(
      `${BASE_URL}/${id}`,
      data,
      { successMessage: "Business updated successfully!" },
    );
    return response.data;
  },

  deleteBusiness: async (id: string): Promise<ApiEnvelope<null>> => {
    const response = await axiosInstance.delete<ApiEnvelope<null>>(
      `${BASE_URL}/${id}`,
      { successMessage: "Business deleted successfully!" },
    );
    return response.data;
  },

  searchBusinesses: async (params?: {
    q?: string;
    cursor?: string;
    limit?: number;
  }): Promise<Business[]> => {
    const response = await axiosInstance.get<ApiEnvelope<Business[]>>(
      `${BASE_URL}/search`,
      { params },
    );
    return response.data.data;
  },

  filterBusinesses: async (params?: {
    businessListId?: string;
    leadStatus?: string;
    emailStatus?: string;
    whatsappStatus?: string;
    city?: string;
    minRating?: number;
    cursor?: string;
    limit?: number;
  }): Promise<Business[]> => {
    const response = await axiosInstance.get<ApiEnvelope<Business[]>>(
      `${BASE_URL}/filter`,
      { params },
    );
    return response.data.data;
  },
};
