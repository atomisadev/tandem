"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Command, Github } from "lucide-react";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-3 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 lg:col-span-1">
        <div className="mx-auto w-[350px] space-y-6">
          <Card className="border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader>
              <CardTitle className="">Sign In</CardTitle>
              <CardDescription>
                Welcome back. Sign in to your account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button
                className="w-full gap-2"
                onClick={handleSignIn}
                disabled={loading}
                variant="outline"
              >
                <Github className="h-4 w-4" />
                {loading ? "Connecting..." : "Continue with GitHub"}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-center text-xs">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="hidden lg:col-span-2 lg:flex flex-col justify-between p-10 text-white dark:border-r">
        <div className="flex items-center gap-2 text-lg font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-zinc-900">
            <Command className="h-5 w-5" />
          </div>
          Tandem
        </div>
        <div className="max-w-md">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              &ldquo;Simplicity is the ultimate sophistication. Welcome back to
              your workspace.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
