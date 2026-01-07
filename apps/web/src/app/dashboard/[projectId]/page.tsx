"use client";

import { useParams } from "next/navigation";
import { useProject } from "../_hooks/use-project";
import { Skeleton } from "@/components/ui/skeleton";
import { Github } from "lucide-react";

export default function ProjectPage() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId as string);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        Project not found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 border-b pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
        {project.githubRepoName && (
          <a
            href={`https://github.com/${project.githubRepoName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            <Github className="h-4 w-4" />
            <span className="font-mono">{project.githubRepoName}</span>
          </a>
        )}
      </div>

      <div>
        {/* Placeholder for future content */}
        <p className="text-sm text-muted-foreground">
          {project.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}
