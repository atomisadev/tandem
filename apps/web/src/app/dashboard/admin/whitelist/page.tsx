"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  useWhitelist,
  useAddToWhitelist,
  useRemoveFromWhitelist,
} from "../_hooks/use-whitelist";
import { authClient } from "@/lib/auth-client";

export default function WhitelistPage() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const { data: whitelist, isLoading } = useWhitelist();
  const { mutate: addToWhitelist, isPending: isAdding } = useAddToWhitelist();
  const { mutate: removeFromWhitelist } = useRemoveFromWhitelist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addToWhitelist(email, {
      onSuccess: () => {
        setOpen(false);
        setEmail("");
        toast.success("User added to whitelist");
      },
      onError: (e) => {
        toast.error("Failed to add user", { description: e.message });
      },
    });
  };

  const handleRemove = (emailToRemove: string) => {
    removeFromWhitelist(emailToRemove, {
      onSuccess: () => {
        toast.success("User removed from whitelist");
      },
      onError: () => {
        toast.error("Failed to remove user");
      },
    });
  };

  useEffect(() => {
    if (!isAuthPending && session?.user) {
      const role = (session.user as any).role;
      if (role !== "ADMIN") {
        router.replace("/dashboard");
      }
    }
  }, [session, isAuthPending, router]);

  if (
    isAuthPending ||
    (session?.user && (session.user as any).role !== "ADMIN")
  ) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-4">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            Whitelisted Users
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage who has access to the platform.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add to Whitelist</DialogTitle>
                <DialogDescription>
                  Enter the email address of the user you want to allow access.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isAdding}>
                  {isAdding && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : whitelist?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No users in whitelist.
                </TableCell>
              </TableRow>
            ) : (
              whitelist?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      Allowed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(user.email)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
