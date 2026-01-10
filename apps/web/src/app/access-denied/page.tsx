"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RequestAccessDialog } from "@/components/request-access-dialog";
import { LogoIcon } from "@/components/logo";
import { IconLockAccess, IconArrowLeft } from "@tabler/icons-react";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground relative overflow-hidden selection:bg-primary/30">
      <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="container max-w-md px-4 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse bg-primary/20 blur-xl rounded-full" />
            <div className="relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-background to-muted border border-border/50 shadow-2xl">
              <IconLockAccess className="size-10 text-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-lg bg-background border border-border shadow-sm">
              <LogoIcon className="size-4 text-foreground" />
            </div>
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Private Access Only
        </h1>

        <p className="mb-8 text-muted-foreground leading-relaxed">
          Tandem is currently in closed alpha. Your account has not been
          whitelisted yet.
        </p>

        <div className="flex flex-col gap-3">
          <RequestAccessDialog>
            <Button size="lg" className="w-full font-medium h-11">
              Request Access
            </Button>
          </RequestAccessDialog>

          <Link href="/" className="w-full">
            <Button
              variant="ghost"
              size="lg"
              className="w-full h-11 gap-2 text-muted-foreground hover:text-foreground"
            >
              <IconArrowLeft className="size-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
