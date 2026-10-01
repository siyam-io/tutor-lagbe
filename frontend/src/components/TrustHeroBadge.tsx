import React from "react";
import { HiShieldCheck, HiOutlineSparkles, HiStar, HiClock } from "react-icons/hi";

export default function TrustHeroBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 py-4 px-6 bg-white rounded-card border border-stone text-xs sm:text-sm text-ink-muted shadow-soft max-w-2xl">
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-full bg-sage/15 text-sage-700">
          <HiShieldCheck className="w-4 h-4" />
        </span>
        <span className="font-medium text-ink">১০০% ভেরিফাইড শিক্ষক</span>
      </div>

      <div className="hidden sm:block w-px h-4 bg-stone" />

      <div className="flex items-center gap-1.5">
        <div className="flex text-terracotta-700">
          {[...Array(5)].map((_, i) => (
            <HiStar key={i} className="w-3.5 h-3.5" />
          ))}
        </div>
        <span className="font-semibold text-ink">৪.৯/৫</span>
        <span className="text-ink-muted hidden md:inline">
          (১২,০০০+ অভিভাবকের আস্থা)
        </span>
      </div>

      <div className="hidden sm:block w-px h-4 bg-stone" />

      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-full bg-sage/15 text-sage-700">
          <HiOutlineSparkles className="w-4 h-4" />
        </span>
        <span className="font-medium text-ink">ফ্রি ডেমো ক্লাস গ্যারান্টি</span>
      </div>

      <div className="hidden md:block w-px h-4 bg-stone" />

      <div className="hidden md:flex items-center gap-2">
        <HiClock className="w-4 h-4 text-sage-700" />
        <span>২৪ ঘণ্টায় শিক্ষক নিশ্চিত</span>
      </div>
    </div>
  );
}
