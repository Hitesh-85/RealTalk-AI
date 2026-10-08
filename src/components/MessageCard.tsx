'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/src/models/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';
import { Button } from '@/src/components/ui/button';
import { toast } from 'sonner';
import { ApiResponse } from '@/src/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id?.toString() ?? '');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
      });
    }
  };

  return (
    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-sm transition-colors duration-200">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
            {message.content}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="w-8 h-8 rounded-lg shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-neutral-950 dark:text-white">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-neutral-600 dark:text-neutral-400">
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-neutral-300 dark:border-neutral-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 font-mono">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}