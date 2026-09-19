"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Next.js Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center space-y-6 animate-scale-up">
        {/* Emoji Icon */}
        <div className="w-20 h-20 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto">
          ⚠️
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Something went wrong!</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            An unexpected error occurred while rendering this page. Our team has been notified.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="btn-primary py-2.5 px-6 font-semibold text-sm rounded-xl flex-1"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary py-2.5 px-6 font-semibold text-sm rounded-xl flex-1 text-center border border-slate-200 dark:border-slate-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
