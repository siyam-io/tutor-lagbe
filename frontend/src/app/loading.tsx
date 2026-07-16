"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6" />
        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
