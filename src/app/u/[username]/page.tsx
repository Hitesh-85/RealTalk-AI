'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Separator } from '@/src/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/src/components/ui/card';
import { useCompletion } from '@ai-sdk/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Textarea } from '@/src/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/src/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/src/schemas/messageSchema';
import { ThemeToggle } from '@/src/components/ThemeToggle';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).map((msg) => msg.trim()).filter(Boolean);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    streamProtocol: 'text',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = useWatch({
    control: form.control,
    name: 'content',
  });

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-10 px-4 sm:px-6">
      <div className="container mx-auto p-6 sm:p-8 bg-card text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-3xl shadow-sm">
        {/* Top bar with Theme Toggle */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white hover:opacity-80"
          >
            ← Back to True Feedback
          </Link>
          <ThemeToggle />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-center tracking-tight text-neutral-950 dark:text-white">
          Send Anonymous Message
        </h1>
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          Your identity is 100% private and protected.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-neutral-900 dark:text-neutral-200 text-sm">
                    Message for @{username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your honest message or feedback here..."
                      className="resize-none min-h-[130px] bg-neutral-100/70 dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 font-medium text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 dark:text-red-400 font-semibold text-xs" />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="w-full sm:w-auto px-8">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="w-full sm:w-auto px-8 bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold cursor-pointer shadow-sm"
                >
                  Send Message
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-4 my-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-neutral-950 dark:text-neutral-100">
                Need Ideas?
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Click any question below to automatically fill your message.
              </p>
            </div>
            <Button
              onClick={fetchSuggestedMessages}
              variant="outline"
              size="sm"
              disabled={isSuggestLoading}
              className="border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs font-medium cursor-pointer"
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Suggest Messages'
              )}
            </Button>
          </div>

          <Card className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 shadow-none">
            <CardContent className="p-4 flex flex-col space-y-2.5">
              {error ? (
                <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-md text-red-950 dark:text-red-200 font-semibold text-sm">
                  ⚠️ {error.message}
                </div>
              ) : (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-3.5 text-xs sm:text-sm font-normal border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 whitespace-normal cursor-pointer transition-colors shadow-none"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6 border-neutral-200 dark:border-neutral-800" />
        <div className="text-center space-y-3">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Want your own anonymous feedback board?
          </p>
          <Button
            asChild
            variant="outline"
            className="border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Link href="/sign-up">
              Create Your Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}