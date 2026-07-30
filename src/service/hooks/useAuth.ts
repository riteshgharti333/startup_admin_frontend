import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginDto } from "../types";
import { authApi } from "../api/auth.api";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.getMe(),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.clear();
    },
  });
};
