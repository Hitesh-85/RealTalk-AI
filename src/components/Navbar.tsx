'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { ThemeToggle } from './ThemeToggle';

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white transition-opacity hover:opacity-80"
        >
          True Feedback
        </Link>

        <div className="flex items-center gap-3">
          {session && (
            <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
              <span className="hidden sm:inline font-medium">
                @{user.username || user.email}
              </span>
              <Button
                onClick={() => signOut()}
                size="sm"
                variant="outline"
                className="border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-medium cursor-pointer"
              >
                Logout
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;