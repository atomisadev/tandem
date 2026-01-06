"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Github, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/eden";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGithubOwners,
  useGithubRepos,
  type Repo,
} from "../_hooks/use-github";

interface CreateProjectDialogProps {
  onCreate: (project: {
    title: string;
    description: string;
    githubRepoId: string;
    githubRepoName: string;
  }) => Promise<void>;
  isCreating: boolean;
}
export function CreateProjectDialog({
  onCreate,
  isCreating,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  const { data: owners, isLoading: loadingOwners } = useGithubOwners(open);
  const { data: repos, isLoading: loadingRepos } = useGithubRepos(
    selectedOwner,
    open
  );

  const handleRepoChange = (repoId: string) => {
    const repo = repos?.find((r) => r.id === repoId);
    if (repo) {
      setSelectedRepoId(repoId);
      setSelectedRepo(repo);
      setTitle(repo.name);
      setDescription(repo.description || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return;

    setIsSubmitting(true);

    await onCreate({
      title,
      description,
      githubRepoId: selectedRepo.id,
      githubRepoName: selectedRepo.fullName,
    });
    setOpen(false);

    // reset form
    setTitle("");
    setDescription("");
    setSelectedRepoId("");
    setSelectedRepo(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Link Repository</DialogTitle>
            <DialogDescription>
              Select a GitHub repository to track tasks.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            <div className="grid gap-2">
              <Label>Owner</Label>
              {loadingOwners ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedOwner}
                  onValueChange={(val) => {
                    setSelectedOwner(val);
                    setSelectedRepoId("");
                    setSelectedRepo(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners?.map((owner) => (
                      <SelectItem key={owner.login} value={owner.login}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={owner.avatarUrl} />
                            <AvatarFallback>
                              {owner.login.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{owner.login}</span>
                          <span className="text-xs text-muted-foreground ml-auto uppercase tracking-wider">
                            {owner.type}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Repository</Label>
              {loadingRepos ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Select
                  value={selectedRepoId}
                  onValueChange={handleRepoChange}
                  disabled={!selectedOwner}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a repository" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {repos?.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground text-center">
                        No repositories found.
                      </div>
                    ) : (
                      repos?.map((repo) => (
                        <SelectItem key={repo.id} value={repo.id}>
                          <div className="flex items-center gap-2 truncate">
                            {repo.private ? (
                              <span className="text-xs border rounded px-1 text-muted-foreground">
                                Pv
                              </span>
                            ) : (
                              <span className="text-xs border rounded px-1 text-muted-foreground">
                                Pu
                              </span>
                            )}
                            <span className="truncate">{repo.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedRepo && (
              <div className="space-y-4 pt-2 border-t">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isCreating || !selectedRepo}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Linking...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
