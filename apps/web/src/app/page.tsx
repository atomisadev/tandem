"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconCommand,
  IconBrandGithub,
  IconGitMerge,
  IconTerminal2,
  IconBolt,
  IconLayoutKanban,
  IconArrowRight,
  IconCheck,
  IconLock,
} from "@tabler/icons-react";
import { RequestAccessDialog } from "@/components/request-access-dialog";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

function useScroll(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-out transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const scrolled = useScroll();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-blue-600/10 blur-[150px] mix-blend-screen" />
      </div>

      <header className="fixed top-0 z-50 w-full pt-6 px-4">
        <div
          className={cn(
            "mx-auto flex h-16 max-w-5xl items-center justify-between px-6 transition-all duration-500 ease-in-out",
            scrolled
              ? "rounded-full border bg-background/60 backdrop-blur-xl shadow-lg border-white/10"
              : "bg-transparent border-transparent"
          )}
        >
          <div className="flex items-center gap-2 font-medium">
            <Logo className="h-8 w-auto text-foreground" />
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 px-4 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              >
                Login
              </Button>
            </Link>
            <RequestAccessDialog>
              <Button
                size="sm"
                className="h-10 rounded-full px-6 bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 font-medium"
              >
                Request Access
              </Button>
            </RequestAccessDialog>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-40">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <ScrollReveal>
              <h1 className="mx-auto max-w-5xl text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:leading-[1.1] bg-gradient-to-b from-white via-white to-primary bg-clip-text text-transparent pb-4">
                Project management for shippers, not managers.
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground/80 md:text-xl leading-relaxed font-light">
                Tandem syncs directly with GitHub. No Jira tickets. No
                bureaucracy. Just code, context, and momentum.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <RequestAccessDialog>
                  <Button
                    size="lg"
                    className="h-14 px-8 rounded-full text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-10px_rgba(var(--primary),0.5)] transition-all hover:scale-105 hover:shadow-[0_0_50px_-10px_rgba(var(--primary),0.6)]"
                  >
                    Start Shipping
                    <IconArrowRight className="ml-2 size-5" />
                  </Button>
                </RequestAccessDialog>
                <Link
                  href="https://github.com/atomisadev/tandem"
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 rounded-full text-base gap-2 hover:bg-white/5 border-white/10 hover:border-white/20 bg-transparent backdrop-blur-sm"
                  >
                    <IconBrandGithub className="size-5" />
                    Star on GitHub
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal
              delay={200}
              className="mt-24 relative perspective-[2000px]"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[60%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

              <div className="relative mx-auto max-w-5xl transform-gpu rotate-x-6 rounded-xl border border-white/10 bg-black/40 p-3 shadow-2xl ring-1 ring-white/5 backdrop-blur-md transition-all duration-1000 hover:rotate-x-0 hover:scale-[1.01] hover:border-white/20">
                <div className="rounded-lg border border-white/10 bg-background/50 overflow-hidden shadow-inner">
                  <div className="flex h-12 items-center border-b border-white/10 bg-white/5 px-4 gap-4">
                    <div className="flex gap-2">
                      <div className="size-3 rounded-full bg-red-500/20 ring-1 ring-inset ring-red-500/30" />
                      <div className="size-3 rounded-full bg-yellow-500/20 ring-1 ring-inset ring-yellow-500/30" />
                      <div className="size-3 rounded-full bg-green-500/20 ring-1 ring-inset ring-green-500/30" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="flex items-center gap-2 rounded-md bg-black/40 px-3 py-1.5 text-xs text-muted-foreground border border-white/5 w-64 justify-center font-mono">
                        <IconLock className="size-3 text-muted-foreground/60" />
                        trytandem.xyz/projects
                      </div>
                    </div>
                    <div className="w-12"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 h-[500px] bg-black/20">
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between mb-4 px-1">
                        <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          <div className="size-2 rounded-full bg-muted-foreground/50" />
                          To Do
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-transparent border-white/10 text-muted-foreground font-mono"
                        >
                          3
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="group rounded-lg border border-white/5 bg-white/5 p-4 shadow-sm hover:border-primary/40 hover:bg-white/[0.07] transition-all cursor-default relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="h-2 w-12 rounded-full bg-orange-500/20 mb-3" />
                            <div className="h-4 w-3/4 rounded bg-white/10 mb-2" />
                            <div className="h-3 w-1/2 rounded bg-white/5" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 space-y-4 bg-primary/[0.02] relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                      <div className="flex items-center justify-between mb-4 px-1 relative">
                        <span className="text-sm font-semibold text-primary flex items-center gap-2">
                          <div className="size-2 rounded-full bg-primary animate-pulse" />
                          In Progress
                        </span>
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-0 font-mono">
                          2
                        </Badge>
                      </div>
                      <div className="relative rounded-lg border border-primary/30 bg-card/80 p-5 shadow-[0_4px_20px_-5px_rgba(var(--primary),0.1)] backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-2">
                            <div className="h-2 w-16 rounded-full bg-purple-500/30" />
                          </div>
                          <IconGitMerge className="size-4 text-purple-400" />
                        </div>
                        <div className="h-4 w-full rounded bg-white/15 mb-2.5" />
                        <div className="h-4 w-2/3 rounded bg-white/15 mb-5" />
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                          <div className="flex -space-x-2">
                            <div className="size-7 rounded-full bg-blue-500/20 border border-background ring-1 ring-white/10" />
                            <div className="size-7 rounded-full bg-green-500/20 border border-background ring-1 ring-white/10" />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
                            PR #420
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between mb-4 px-1">
                        <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          <div className="size-2 rounded-full bg-green-500/50" />
                          Done
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-transparent border-white/10 text-muted-foreground font-mono"
                        >
                          124
                        </Badge>
                      </div>
                      <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-4 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                        <div className="h-2 w-10 rounded-full bg-green-500/20 mb-3" />
                        <div className="h-4 w-1/2 rounded bg-white/10 mb-2 line-through decoration-white/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-32">
          <div className="grid gap-8 md:grid-cols-3">
            <ScrollReveal className="md:col-span-2">
              <Card className="h-full bg-white/[0.03] border-white/10 backdrop-blur-md overflow-hidden group hover:border-primary/50 hover:shadow-[0_0_50px_-20px_rgba(var(--primary),0.2)] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <CardHeader className="p-8">
                  <div className="mb-6 inline-flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 shadow-lg">
                    <IconBrandGithub className="size-7 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-medium text-white mb-2">
                    Native GitHub Integration
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground/80 leading-relaxed max-w-2xl">
                    Two-way sync that actually works. Statuses update
                    automatically when PRs are merged. Branches are linked to
                    tasks instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-6 font-mono text-sm text-muted-foreground shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                      <IconBrandGithub className="size-20 -rotate-12" />
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="flex size-6 items-center justify-center rounded-full bg-green-500/20 text-green-500 ring-1 ring-green-500/30">
                        <IconCheck className="size-3.5" />
                      </span>
                      <span className="text-white/90 font-medium">
                        Merged PR #429: Update auth flow
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pl-[11px] text-muted-foreground/60 ml-3 relative z-10 border-l border-white/10 h-8">
                      <div className="w-4 h-px bg-white/10" />
                      <span className="text-xs">
                        Task moved to{" "}
                        <span className="text-green-400">Done</span>{" "}
                        automatically
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <Card className="h-full bg-white/[0.03] border-white/10 backdrop-blur-md group hover:border-primary/50 hover:shadow-[0_0_50px_-20px_rgba(var(--primary),0.2)] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <CardHeader className="p-8">
                  <div className="mb-6 inline-flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 shadow-lg">
                    <IconBolt className="size-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-medium text-white">
                    Zero Latency
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground/80">
                    Built on the edge. Optimistic UI updates feel instant.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 flex items-end justify-end">
                  <div className="text-6xl font-bold tracking-tighter text-white/5 font-mono group-hover:text-primary/20 transition-colors duration-500">
                    ~12ms
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Card className="h-full bg-white/[0.03] border-white/10 backdrop-blur-md group hover:border-primary/50 hover:shadow-[0_0_50px_-20px_rgba(var(--primary),0.2)] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <CardHeader className="p-8">
                  <div className="mb-6 inline-flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 shadow-lg">
                    <IconTerminal2 className="size-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-medium text-white">
                    Keyboard First
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground/80">
                    Command + K to do anything. Create tasks without touching
                    your mouse.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="flex gap-2 mt-4">
                    <kbd className="pointer-events-none inline-flex h-8 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                    <kbd className="pointer-events-none inline-flex h-8 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">C</span>
                    </kbd>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={300} className="md:col-span-2">
              <Card className="h-full bg-white/[0.03] border-white/10 backdrop-blur-md group hover:border-primary/50 hover:shadow-[0_0_50px_-20px_rgba(var(--primary),0.2)] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <CardHeader className="p-8">
                  <div className="mb-6 inline-flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 shadow-lg">
                    <IconLayoutKanban className="size-7 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-medium text-white mb-2">
                    Focused Workflows
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground/80 leading-relaxed max-w-2xl">
                    We stripped away the Gantt charts, time tracking, and
                    enterprise bloat. What's left is a tool that helps you ship
                    software.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      "No 'Story Points'",
                      "No Sprint Planning wizards",
                      "No mandatory fields",
                      "Full Markdown Support",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-base text-muted-foreground group-hover:text-white transition-colors duration-300"
                      >
                        <div className="flex size-7 items-center justify-center rounded-full bg-white/5 border border-white/10 text-primary">
                          <IconCheck className="size-3.5" />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        <section className="relative border-t border-white/10 py-32 overflow-hidden">
          <div className="container relative mx-auto max-w-4xl px-4 text-center">
            <ScrollReveal>
              <h2 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl text-white">
                Ready to ship?
              </h2>
              <p className="mb-12 text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Join the private alpha and experience the future of
                developer-focused project management.
              </p>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <RequestAccessDialog>
                  <Button
                    size="lg"
                    className="h-14 px-10 rounded-full text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(var(--primary),0.4)] transition-all hover:scale-105"
                  >
                    Request Access
                    <IconArrowRight className="ml-2 size-5" />
                  </Button>
                </RequestAccessDialog>
              </div>
              <p className="mt-8 text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
                <IconLock className="size-3" />
                Limited spots available for Q1 2026
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-background/50 backdrop-blur-xl py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2 font-medium">
              <Logo className="h-6 w-auto text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Tandem. Built for shippers.
            </p>
            <div className="flex gap-8">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
