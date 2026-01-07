"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const timeAgo = (date: string | Date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Just Now";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

interface ProjectCardProps {
  id: string;
  title: string;
  description: string | null;
  createdAt: string | Date;
  githubRepoName?: string | null;
  isOptimistic?: boolean;
}

export function ProjectCard({
  id,
  title,
  description,
  createdAt,
  githubRepoName,
  isOptimistic,
}: ProjectCardProps) {
  const Content = (
    <Card
      className={cn(
        "group flex flex-col justify-between transition-all hover:border-primary/50 h-full",
        isOptimistic && "opacity-70 animate-pulse"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
          {isOptimistic && (
            <Badge variant="secondary" className="text-[10px] h-4">
              Creating
            </Badge>
          )}
        </div>

        {githubRepoName && (
          <div className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground/80 font-mono mt-1">
            <Github className="h-3 w-3" />
            <span className="truncate">{githubRepoName}</span>
          </div>
        )}

        <CardDescription className="line-clamp-2 min-h-[2.5em] mt-2">
          {description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardFooter className="text-[10px] text-muted-foreground">
        Created {timeAgo(createdAt)}
      </CardFooter>
    </Card>
  );

  if (isOptimistic) {
    return Content;
  }

  return (
    <Link href={`/dashboard/${id}`} className="block h-full">
      {Content}
    </Link>
  );
}
