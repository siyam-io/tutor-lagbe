"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-stone border-t-primary-800 rounded-full animate-spin mx-auto mb-6" />
        <p className="font-display text-lg font-medium text-ink-muted">
          Loading...
        </p>
      </div>
    </div>
  );
}
