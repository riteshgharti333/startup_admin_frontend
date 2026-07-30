import axiosInstance from "../../lib/axios";
import type { CreateApplicationDto, UpdateApplicationDto } from "../types";

const BASE_URL = "/application";

export const applicationApi = {
  submitApplication: async (data: CreateApplicationDto) => {
    const response = await axiosInstance.post(BASE_URL, data, {
      successMessage: "Application submitted successfully!",
    });
    return response.data;
  },

  getAllApplications: async (params?: { cursor?: string; limit?: number }) => {
    const response = await axiosInstance.get(BASE_URL, { params });
    return response.data.data;
  },

  getApplicationById: async (id: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  updateApplication: async (id: string, data: UpdateApplicationDto) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data, {
      successMessage: "Application updated successfully!",
    });
    return response.data;
  },

  deleteApplication: async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`, {
      successMessage: "Application deleted successfully!",
    });
    return response.data;
  },

  searchApplications: async (params?: {
    q?: string;
    cursor?: string;
    limit?: number;
  }) => {
    const response = await axiosInstance.get(`${BASE_URL}/search`, { params });
    return response.data.data;
  },

  filterApplications: async (params?: {
    position?: string;
    status?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    cursor?: string;
    limit?: number;
  }) => {
    const response = await axiosInstance.get(`${BASE_URL}/filter`, { params });
    return response.data.data;
  },
};
