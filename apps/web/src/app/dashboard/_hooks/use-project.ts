"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/eden";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  order: number;
  projectId: string;
  assignedToUserId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  createdAt: string | Date;
  githubRepoName?: string | null;
  members: {
    user: {
      id: string;
      name: string;
      image: string | null;
      email: string;
    };
    role: string;
  }[];
  tasks: Task[];
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

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      title,
      status,
    }: {
      projectId: string;
      title: string;
      status: string;
    }) => {
      const { data, error } = await api.api.projects[projectId].tasks.post({
        title,
        status,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      projectId,
      data,
    }: {
      taskId: string;
      projectId: string;
      data: Partial<Task>;
    }) => {
      const { data: result, error } =
        await api.api.projects.tasks[taskId].patch(data);
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
}
