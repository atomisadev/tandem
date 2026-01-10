"use client";

import { api } from "@/lib/eden";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface WhitelistEntry {
  id: string;
  email: string;
  createdAt: string | Date;
}

export function useWhitelist() {
  return useQuery({
    queryKey: ["whitelist"],
    queryFn: async () => {
      const { data, error } = await api.api.admin.whitelist.get();
      if (error) throw error;
      return data as WhitelistEntry[];
    },
  });
}

export function useAddToWhitelist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await api.api.admin.whitelist.post({
        email: email as any,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whitelist"] });
    },
  });
}

export function useRemoveFromWhitelist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await api.api.admin.whitelist[email].delete();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whitelist"] });
    },
  });
}
