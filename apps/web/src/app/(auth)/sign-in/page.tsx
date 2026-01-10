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
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Github } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: "/dashboard",
        errorCallbackURL: "/access-denied",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setLoading(false);
          if (ctx.error.status === 403) {
            router.push("/access-denied");
          }
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Logo className="h-8 w-auto mb-8 text-foreground" />

      <Card className="w-full max-w-sm border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
          <CardDescription className="text-center">
            Welcome back. Sign in to your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            className="w-full gap-2"
            onClick={handleSignIn}
            disabled={loading}
            variant="default"
          >
            <Github className="h-4 w-4" />
            {loading ? "Connecting..." : "Continue with GitHub"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
