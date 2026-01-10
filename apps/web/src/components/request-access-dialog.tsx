"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useJoinWaitlist } from "@/hooks/use-waitlist";

interface RequestAccessDialogProps {
  children: React.ReactNode;
}

export function RequestAccessDialog({ children }: RequestAccessDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { mutate: joinWaitlist, isPending } = useJoinWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    joinWaitlist(email, {
      onSuccess: () => {
        setOpen(false);
        setEmail("");
        toast("You're on the list!", {
          description: "We'll be in touch soon with your invite code.",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Request Access</DialogTitle>
            <DialogDescription className="text-muted-foreground/80">
              Tandem is currently in private alpha. Enter your email to reserve
              your spot in the queue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="developer@company.com"
                  className="bg-white/5 border-white/10 focus:border-primary/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Joining..." : "Join Waitlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
