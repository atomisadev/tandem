"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/eden";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  createdAt: string | Date;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await api.api.projects.get();
      if (data && !error) {
        setProjects(data as unknown as Project[]);
      }
    } catch (e) {
      console.error("Failed to fetch projects", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    setProjects,
    loading,
    refresh: fetchProjects,
  };
}
