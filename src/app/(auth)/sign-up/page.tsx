'use client';

import { ApiResponse } from '@/src/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/src/schemas/signUpSchema';
import { ThemeToggle } from '@/src/components/ThemeToggle';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast.success('Success', {
        description: response.data.message,
      });

      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data.message ??
        'There was a problem with your sign-up. Please try again.';

      toast.error('Sign Up Failed', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
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
            Create an Account
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sign up to start your anonymous messaging board
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose a username"
                      className="bg-neutral-100/70 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Checking username...
                    </div>
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-xs font-semibold ${
                        usernameMessage.toLowerCase().includes('unique')
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 font-semibold" />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="bg-neutral-100/70 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    We will send a 6-digit verification code to this email.
                  </p>
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
                      placeholder="Create a strong password"
                      className="bg-neutral-100/70 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Already a member?{' '}
            <Link
              href="/sign-in"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}