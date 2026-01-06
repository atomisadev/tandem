"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const timeAgo = (date: string | Date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Just Now";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

interface ProjectCardProps {
  title: string;
  description: string | null;
  createdAt: string | Date;
  isOptimistic?: boolean;
}

export function ProjectCard({
  title,
  description,
  createdAt,
  isOptimistic,
}: ProjectCardProps) {
  return (
    <Card
      className={`group flex flex-col justify-between transition-all hover:border-primary/50 ${isOptimistic ? "opacity-70 animate-pulse" : ""}`}
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
        <CardDescription className="line-clamp-2 min-h-[2.5em]">
          {description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardFooter className="text-[10px] text-muted-foreground">
        Created {timeAgo(createdAt)}
      </CardFooter>
    </Card>
  );
}
