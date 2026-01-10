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

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
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
          toast.success("Account created successfully");
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
          <CardTitle className="text-center text-2xl">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Connect your GitHub account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            className="w-full gap-2"
            onClick={handleSignUp}
            disabled={loading}
            variant="default"
          >
            <Github className="h-4 w-4" />
            {loading ? "Connecting..." : "Continue with GitHub"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
