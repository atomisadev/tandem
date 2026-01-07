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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, Share2, X, Calendar, User } from "lucide-react";
import { KanbanBoard } from "./_components/kanban-board";

export default function ProjectPage() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId as string);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
    <div className="container mx-auto max-w-6xl space-y-8 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
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

      <div className="flex-1 min-h-0 grid grid-cols-4 gap-6">
        <div className="col-span-3 h-full min-h-0">
          <KanbanBoard
            projectId={project.id}
            tasks={project.tasks}
            onTaskClick={setSelectedTask}
          />
        </div>

        <div className="col-span-1 h-full min-h-0">
          {selectedTask ? (
            <Card className="h-full flex flex-col border-l-4 border-l-primary/20">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <Badge
                  variant="outline"
                  className="uppercase text-[10px] tracking-widest"
                >
                  {selectedTask.status.replace("-", " ")}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setSelectedTask(null)}
                  className="-mr-2 -mt-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-6 pt-4">
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
              </CardContent>
            </Card>
          ) : (
            <div className="h-full rounded-xl border border-dashed flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <div className="h-6 w-6 rounded-sm bg-foreground/20" />
              </div>
              <p className="font-medium">No ticket selected</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Click on a ticket from the board to view its details here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
