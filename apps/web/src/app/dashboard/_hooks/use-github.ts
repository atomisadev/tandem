"use client";

import { api } from "@/lib/eden";
import { useQuery } from "@tanstack/react-query";

export interface Owner {
  login: string;
  avatarUrl: string;
  type: string;
}

export interface Repo {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
}

export function useGithubOwners(enabled: boolean = true) {
  return useQuery({
    queryKey: ["github", "owners"],
    queryFn: async () => {
      const { data, error } = await api.api.github.owners.get();
      if (error) throw error;
      return data as Owner[];
    },
    enabled,
  });
}

export function useGithubRepos(owner: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["github", "repos", owner],
    queryFn: async () => {
      if (!owner) return [];

      const { data, error } = await api.api.github.repos[owner].get();
      if (error) throw error;
      return data as Repo[];
    },
    enabled: enabled && !!owner,
  });
}
