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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-ink">
      <div className="max-w-md w-full bg-white rounded-card border border-stone shadow-soft-lg p-10 text-center space-y-7">
        {/* Emoji Icon */}
        <div className="w-20 h-20 bg-terracotta/10 text-terracotta-700 rounded-full flex items-center justify-center text-4xl mx-auto">
          ⚠️
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Something went wrong!
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            An unexpected error occurred while rendering this page. Our team has
            been notified.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="btn-primary flex-1 text-xs"
          >
            Try Again
          </button>
          <Link href="/" className="btn-outline flex-1 text-xs">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
