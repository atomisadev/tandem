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
import { Plus, Github, Loader2, Lock, Globe, Slash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
            <div className="flex items-start gap-2">
              <div className="grid gap-2 flex-1 min-w-0">
                <Label>Owner</Label>
                {loadingOwners ? (
                  <Skeleton className="h-9 w-full" />
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
                      <SelectValue placeholder="Owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners?.map((owner) => (
                        <SelectItem key={owner.login} value={owner.login}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={owner.avatarUrl} />
                              <AvatarFallback>
                                {owner.login.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{owner.login}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex items-center h-[62px] text-muted-foreground/50">
                <Slash className="h-4 w-4 -rotate-12" />
              </div>

              <div className="grid gap-2 flex-[1.5] min-w-0">
                <Label>Repository</Label>
                {loadingRepos ? (
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full" />
                  </div>
                ) : (
                  <Select
                    value={selectedRepoId}
                    onValueChange={handleRepoChange}
                    disabled={!selectedOwner}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Repository" />
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
                                <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                              ) : (
                                <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
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
