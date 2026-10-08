"use client";

import { MessageCard } from "@/src/components/MessageCard";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { toast } from "sonner";
import { Message } from "@/src/models/User";
import { ApiResponse } from "@/src/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { acceptMessageSchema } from "@/src/schemas/acceptMessageSchema";
import * as z from "zod";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id?.toString() !== messageId),
    );
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });
  const { control, setValue } = form;
  const acceptMessages = useWatch({ control, name: "acceptMessages" });

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Refreshed Messages", {
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to fetch messages",
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading,setMessages]);

  useEffect(() => {
    if (!session || !session.user) return;

    const timeoutId = window.setTimeout(() => {
      void fetchMessages();
      void fetchAcceptMessages();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [session,setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const newStatus = !acceptMessages;
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: newStatus,
      });
      setValue("acceptMessages", newStatus);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL Copied!", {
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 sm:p-8 bg-card text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-6xl shadow-sm transition-colors duration-200">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-neutral-950 dark:text-white">
        User Dashboard
      </h1>

      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
          Copy Your Unique Link
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm select-all"
          />
          <Button
            onClick={copyToClipboard}
            className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-medium cursor-pointer"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-3 font-medium text-sm text-neutral-900 dark:text-neutral-100">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator className="border-neutral-200 dark:border-neutral-800" />

      <Button
        className="mt-6 border-neutral-300 dark:border-neutral-700 cursor-pointer"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-neutral-900 dark:text-neutral-100" />
        ) : (
          <RefreshCcw className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
        )}
      </Button>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id?.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">
            No messages to display.
          </p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
