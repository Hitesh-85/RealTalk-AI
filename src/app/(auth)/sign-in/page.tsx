"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema } from "@/src/schemas/signInSchema";
import { ThemeToggle } from "@/src/components/ThemeToggle";

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Login Failed", {
          description: "Incorrect username or password",
        });
      } else {
        toast.error("Error", {
          description: result.error,
        });
      }
    }

    if (result?.ok) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background text-foreground transition-colors duration-200 p-4">
      <div className="w-full max-w-md p-8 bg-card text-card-foreground border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-6">
        {/* Top Navigation Bar inside Card */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <Link
            href="/"
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-neutral-950 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sign in to continue your secret conversations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                    Email / Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email or username"
                      className="bg-neutral-100/70 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 font-semibold" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="bg-neutral-100/70 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 font-semibold" />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold cursor-pointer shadow-sm mt-2"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-300 hover:bg-amber-500/20 font-medium cursor-pointer"
              onClick={async () => {
                const res = await signIn("credentials", {
                  redirect: false,
                  identifier: "guest",
                  password: "guest123",
                });
                if (res?.ok) {
                  router.replace("/dashboard");
                }
              }}
            >
              ⚡ Instant Guest Login (For Testing)
            </Button>
          </form>
        </Form>

        <div className="text-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Not a member yet?{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}