"use client";

import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";
import { ApiResponse } from "@/src/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/src/schemas/verifySchema";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success("Success", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Verification Failed", {
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background text-foreground transition-colors duration-200 p-4">
      <div className="w-full max-w-md p-8 bg-card text-card-foreground border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-neutral-950 dark:text-white">
            Verify Your Account
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit OTP code"
                      className="bg-neutral-100/70 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-center font-mono tracking-widest text-lg"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 font-semibold" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold cursor-pointer shadow-sm mt-2"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
