"use client";

import { useOptimistic, startTransition } from "react";
import { api } from "@/lib/eden";
import {
  useCreateProject,
  useProjects,
  type Project,
} from "./_hooks/use-project";
import { CreateProjectDialog } from "./_components/create-project-dialog";
import { ProjectCard } from "./_components/project-card";
import { Loader2 } from "lucide-react";
import { ProjectCardSkeleton } from "./_components/project-card-skeleton";

export default function DashboardPage() {
  const { data: projects, isLoading } = useProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();

  const handleCreateProject = async (data: {
    title: string;
    description: string;
    githubRepoId: string;
    githubRepoName: string;
  }) => {
    createProject(data, {
      onError: (e) => {
        alert("Failed to create project. " + e.message);
      },
    });
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-4">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your ongoing work.
          </p>
        </div>
        <CreateProjectDialog onCreate={handleCreateProject} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects?.length === 0 ? (
            <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <p className="text-sm text-muted-foreground">
                No projects found.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Link a GitHub repository to get started.
              </p>
            </div>
          ) : (
            projects?.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                createdAt={project.createdAt}
                githubRepoName={project.githubRepoName}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
