"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Loader2 } from "lucide-react";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    mode: "signin" | "signup";
}

export function AuthForm({ mode, className, ...props }: AuthFormProps) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const nameRef = React.useRef<HTMLInputElement>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const name = nameRef.current?.value;

        try {
            if (mode === "signup") {
                if (!name) throw new Error("Name is required");
                await authClient.signUp.email(
                    {
                        email: email!,
                        password: password!,
                        name: name,
                    },
                    {
                        onSuccess: () => {
                            router.push("/dashboard");
                        },
                        onError: (ctx) => {
                            setError(ctx.error.message);
                        },
                    },
                );
            } else {
                await authClient.signIn.email(
                    {
                        email: email!,
                        password: password!,
                    },
                    {
                        onSuccess: () => {
                            router.push("/dashboard");
                        },
                        onError: (ctx) => {
                            setError(ctx.error.message);
                        },
                    },
                );
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setLoading(false);
        }
    }

    return (
        <div className={className} {...props}>
            <div className="mb-6 space-y-2 text-center sm:text-left">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {mode === "signin" ? "Login" : "Create an account"}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {mode === "signin"
                        ? "Enter your email below to login to your account"
                        : "Enter your email below to create your account"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FieldGroup>
                    {mode === "signup" && (
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <Input
                                ref={nameRef}
                                name="name"
                                placeholder="John Doe"
                                type="text"
                                autoComplete="name"
                                required={mode === "signup"}
                            />
                        </Field>
                    )}

                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                            ref={emailRef}
                            name="email"
                            placeholder="m@example.com"
                            type="email"
                            autoComplete="email"
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Password</FieldLabel>
                        <Input
                            ref={passwordRef}
                            name="password"
                            type="password"
                            autoComplete={
                                mode === "signin"
                                    ? "current-password"
                                    : "new-password"
                            }
                            required
                        />
                    </Field>
                </FieldGroup>

                {error && (
                    <div className="text-destructive text-sm">{error}</div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {mode === "signin" ? "Sign In" : "Sign Up"}
                </Button>
            </form>

            <div className="mt-4 text-center text-sm">
                {mode === "signin" ? (
                    <span className="text-muted-foreground">
                        Don't have an account?{" "}
                        <a
                            href="/sign-up"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Sign up
                        </a>
                    </span>
                ) : (
                    <span className="text-muted-foreground">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Login
                        </a>
                    </span>
                )}
            </div>
        </div>
    );
}
