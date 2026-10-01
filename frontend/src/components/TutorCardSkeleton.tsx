import React from "react";

interface TutorCardSkeletonProps {
  count?: number;
}

export default function TutorCardSkeleton({ count = 4 }: TutorCardSkeletonProps) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="card p-5 relative overflow-hidden animate-pulse hover:translate-y-0"
        >
          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 shimmer pointer-events-none" />

          {/* Header with avatar & name */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-image bg-clay/40 border border-stone flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-clay/40 rounded-full w-3/4" />
              <div className="h-3 bg-clay/40 rounded-full w-1/2" />
            </div>
          </div>

          {/* Key tags */}
          <div className="flex gap-2 mb-5">
            <div className="h-6 w-20 bg-clay/40 rounded-full" />
            <div className="h-6 w-24 bg-clay/40 rounded-full" />
          </div>

          {/* Info rows */}
          <div className="space-y-2.5 py-4 border-t border-b border-stone text-sm">
            <div className="flex justify-between items-center">
              <div className="h-3.5 bg-clay/40 rounded-full w-16" />
              <div className="h-3.5 bg-clay/40 rounded-full w-28" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-3.5 bg-clay/40 rounded-full w-14" />
              <div className="h-3.5 bg-clay/40 rounded-full w-20" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-3.5 bg-clay/40 rounded-full w-20" />
              <div className="h-3.5 bg-clay/40 rounded-full w-24" />
            </div>
          </div>

          {/* CTA button placeholder */}
          <div className="mt-5 pt-1">
            <div className="h-11 bg-clay/40 rounded-full w-full" />
          </div>
        </div>
      ))}
    </>
  );
}
