import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Command } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Command className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
          Tandem
        </h1>
        <p className="max-w-md text-muted-foreground">
          Simplicity is the ultimate sophistication. Manage your projects with
          focus and clarity.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full px-8">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" size="lg" className="rounded-full">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
