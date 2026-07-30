import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSubscriberDto } from "../types";
import { subscriberApi } from "../api/subscriber.api";

// Subscribe to newsletter (public)
export const useSubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriberDto) => subscriberApi.subscribe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      // Store subscription in localStorage
      localStorage.setItem("isSubscribed", "true");
    },
  });
};

// Get all subscribers (admin)
export const useSubscribers = (params?: {
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["subscribers", params],
    queryFn: () => subscriberApi.getAllSubscribers(params),
  });
};

// Search subscribers (admin)
export const useSearchSubscribers = (params?: {
  q?: string;
  cursor?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["subscribers", "search", params],
    queryFn: () => subscriberApi.searchSubscribers(params),
    enabled: !!params?.q,
  });
};

// Check if user is subscribed (from localStorage)
export const useIsSubscribed = () => {
  const isSubscribed = localStorage.getItem("isSubscribed") === "true";
  return isSubscribed;
};
