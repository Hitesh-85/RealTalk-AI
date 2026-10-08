'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ArrowRight, ShieldCheck, Sparkles, SlidersHorizontal, Lock } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex-1 flex flex-col justify-between bg-background text-foreground transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-neutral-950 dark:text-white leading-[1.1]">
          Design in details. <br className="hidden sm:inline" />
          Feedback with clarity.
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          True Feedback is a focused space crafted for honest conversations. 
          Collect genuine critiques, secret questions, and unfiltered thoughts from friends and followers.
        </p>

        {/* CTA Buttons - Minimal Monochromatic */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
          {session ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-semibold px-8 py-6 text-base rounded-full transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold px-8 py-6 text-base rounded-full transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/sign-in" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-neutral-300 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium px-8 py-6 text-base rounded-full transition-all cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Minimal Studio Card Preview */}
        <div className="mt-16 w-full max-w-xl text-left">
          <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 sm:p-8 rounded-2xl shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-4">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Anonymous Message
              </span>
              <span>Today</span>
            </div>
            <p className="text-lg sm:text-xl font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
              &quot;What is one belief you held for years that you recently changed your mind about?&quot;
            </p>
            <div className="flex items-center justify-between pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-900 text-xs text-neutral-500">
              <span>Encrypted & Unidentifiable</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-medium border border-neutral-200 dark:border-neutral-800">
                Delivered
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Visuvate-Style Structured Feature Blocks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 w-full transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-14 max-w-xl">
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">Capabilities</p>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Built with purpose. Simple by design.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-xl shadow-none">
              <CardHeader className="pb-3">
                <div className="text-xs font-mono text-neutral-400 mb-2">01 / SECURITY</div>
                <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                  Zero Friction Anonymity
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Senders never log in or provide personal details. Your public link is open for honest thoughts with complete privacy protection.
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-xl shadow-none">
              <CardHeader className="pb-3">
                <div className="text-xs font-mono text-neutral-400 mb-2">02 / INTELLIGENCE</div>
                <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                  Prompt Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Visitors looking for inspiration can generate curated conversation starters with one click, eliminating writer&apos;s block.
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-xl shadow-none">
              <CardHeader className="pb-3">
                <div className="text-xs font-mono text-neutral-400 mb-2">03 / CONTROL</div>
                <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                  Instant Message Toggle
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Full governance over your inbox. Pause message intake anytime with an instant toggle switch or delete messages permanently.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visuvate-Style Minimal 3-Step Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-left mb-12">
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">Workflow</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
            Three steps to unfiltered insights.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-t border-neutral-300 dark:border-neutral-800 pt-6">
            <span className="text-xs font-mono text-neutral-400 block mb-2">STEP 01</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">Create Account</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Sign up and verify your email with a secure 6-digit OTP code in under 30 seconds.
            </p>
          </div>

          <div className="border-t border-neutral-300 dark:border-neutral-800 pt-6">
            <span className="text-xs font-mono text-neutral-400 block mb-2">STEP 02</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">Share Unique Link</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Copy your personal URL and share it on Instagram, Twitter, LinkedIn, or WhatsApp.
            </p>
          </div>

          <div className="border-t border-neutral-300 dark:border-neutral-800 pt-6">
            <span className="text-xs font-mono text-neutral-400 block mb-2">STEP 03</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">Receive Feedback</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              View incoming messages chronologically on your private dashboard whenever you want.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
