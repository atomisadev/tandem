"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/eden";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  createdAt: string | Date;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await api.api.projects.get();
      if (error) throw error;
      return data as unknown as Project[];
    },
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await api.api.projects[projectId].get();
      if (error) throw error;
      return data as unknown as Project;
    },
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      desciription: string;
      githubRepoId: string;
      githubRepoName: string;
    }) => {
      const { data, error } = await api.api.projects.post(payload);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
