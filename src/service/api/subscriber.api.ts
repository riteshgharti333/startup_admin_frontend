import axiosInstance from "../../lib/axios";
import type { CreateSubscriberDto } from "../types";

const BASE_URL = "/subscribe";

export const subscriberApi = {
  subscribe: async (data: CreateSubscriberDto) => {
    const response = await axiosInstance.post(`${BASE_URL}/`, data, {
      successMessage: "Successfully subscribed to newsletter!",
    });
    return response.data;
  },

  getAllSubscribers: async (params?: { cursor?: string; limit?: number }) => {
    const response = await axiosInstance.get(BASE_URL, { params });
    return response.data;
  },

  searchSubscribers: async (params?: {
    q?: string;
    cursor?: string;
    limit?: number;
  }) => {
    const response = await axiosInstance.get(`${BASE_URL}/search`, { params });
    return response.data;
  },
};
