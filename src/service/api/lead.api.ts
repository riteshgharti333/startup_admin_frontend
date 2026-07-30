import axiosInstance from "../../lib/axios";
import type { CreateLeadDto, UpdateLeadDto } from "../types";

const BASE_URL = "/lead";

export const leadApi = {
  createLead: async (data: CreateLeadDto) => {
    const response = await axiosInstance.post(BASE_URL, data, {
      successMessage: "Lead submitted successfully!",
    });
    return response.data.data;
  },

  getAllLeads: async (params?: { cursor?: string; limit?: number }) => {
    const response = await axiosInstance.get(BASE_URL, { params });
    return response.data.data;
  },

  getLeadById: async (id: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  updateLead: async (id: string, data: UpdateLeadDto) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data, {
      successMessage: "Lead updated successfully!",
    });
    return response.data.data;
  },

  deleteLead: async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`, {
      successMessage: "Lead deleted successfully!",
    });
    return response.data.data;
  },

  searchLeads: async (params?: {
    q?: string;
    cursor?: string;
    limit?: number;
  }) => {
    const response = await axiosInstance.get(`${BASE_URL}/search`, { params });
    return response.data.data;
  },

  filterLeads: async (params?: {
    service?: string;
    status?: string;
    budget?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    cursor?: string;
    limit?: number;
  }) => {
    const response = await axiosInstance.get(`${BASE_URL}/filter`, { params });
    return response.data.data;
  },
};
