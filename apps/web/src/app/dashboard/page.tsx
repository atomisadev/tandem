"use client";

import { useOptimistic, startTransition } from "react";
import { api } from "@/lib/eden";
import { useProjects, type Project } from "./_hooks/use-project";
import { CreateProjectDialog } from "./_components/create-project-dialog";
import { ProjectCard } from "./_components/project-card";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { projects, setProjects, loading } = useProjects();

  const [optimisticProjects, addOptimisticProject] = useOptimistic(
    projects,
    (state: Project[], newProject: Project) => [newProject, ...state],
  );

  const handleCreateProject = async (data: {
    title: string;
    description: string;
  }) => {
    const tempId = `temp-${Date.now()}`;
    const newProject: Project = {
      id: tempId,
      title: data.title,
      description: data.description,
      createdAt: new Date(),
    };

    startTransition(() => {
      addOptimisticProject(newProject);
    });

    try {
      const { data: createdProject, error } = await api.api.projects.post(data!);

      if (createdProject && !error) {
        setProjects((prev) => [createdProject as unknown as Project, ...prev]);
      } else {
        console.error("Failed to create project:", error);
      }
    } catch (error) {
      console.error("Network error:", err);
    }
  };

return (
    <div className="container mx-auto max-w-6xl space-y-8 p-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your ongoing work.
          </p>
        </div>
        <CreateProjectDialog onCreate={handleCreateProject} />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {optimisticProjects.length === 0 ? (
            <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <p className="text-sm text-muted-foreground">No projects found.</p>
              <p className="text-xs text-muted-foreground/60">Create one to get started.</p>
            </div>
          ) : (
            optimisticProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                createdAt={project.createdAt}
                isOptimistic={project.id.startsWith("temp-")}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
