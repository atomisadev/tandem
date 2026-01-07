"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProject, type Task } from "../_hooks/use-project";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, Share2, X, Calendar, User } from "lucide-react";
import { KanbanBoard } from "./_components/kanban-board";
import { cn } from "@/lib/utils";

export default function ProjectPage() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId as string);

  // Changed: Store ID instead of the whole object to ensure we always display fresh data
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Derived state: Get the latest task data from the project query
  const selectedTask =
    project?.tasks.find((t) => t.id === selectedTaskId) || null;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl space-y-8 p-4">
        <div className="flex items-center justify-between border-b pb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
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
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 shrink-0 px-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight">
            {project.title}
          </h1>
          {project.githubRepoName && (
            <a
              href={`https://github.com/${project.githubRepoName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-3.5 w-3.5 opacity-70" />
              <span className="font-mono">{project.githubRepoName}</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-6">
          <AvatarGroup>
            {project.members.map((member) => (
              <Avatar
                key={member.user.id}
                className="border-2 border-background"
              >
                <AvatarImage
                  src={member.user.image || ""}
                  alt={member.user.name}
                />
                <AvatarFallback>
                  {member.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>

          <Button className="gap-2" variant="outline" onClick={() => {}}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden gap-6 px-4 pb-4">
        <div className="flex-1 min-w-0 h-full">
          <KanbanBoard
            projectId={project.id}
            tasks={project.tasks}
            onTaskClick={(task) => setSelectedTaskId(task.id)}
          />
        </div>

        <div
          className={cn(
            "h-full border-l bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
            selectedTask
              ? "w-[400px] opacity-100 ml-0 pl-6"
              : "w-0 opacity-0 ml-0 pl-0 border-l-0"
          )}
        >
          {selectedTask ? (
            <div className="h-full flex flex-col">
              <div className="flex flex-row items-center justify-between space-y-0 pb-4 shrink-0">
                <Badge
                  variant="outline"
                  className="uppercase text-[10px] tracking-widest"
                >
                  {selectedTask.status.replace("-", " ")}
                </Badge>
                {/* Fixed X button sizing and margin */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSelectedTaskId(null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold leading-tight">
                    {selectedTask.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>Unassigned</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">
                    Description
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedTask.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
