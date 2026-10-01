"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import {
  HiOutlinePhone,
  HiX,
  HiOutlineSparkles,
  HiOutlineArrowRight,
} from "react-icons/hi";
import Link from "next/link";

export default function FloatingCommunicationWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide the floating widget on the full-screen messages chat page so it does not block the input or chat interface
  if (pathname === "/messages") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-card shadow-soft-xl border border-stone p-6 animate-slide-up">
          <div className="flex items-center justify-between pb-4 border-b border-stone">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-bangla-green" />
              </span>
              <div>
                <h4 className="font-display font-semibold text-sm text-ink">
                  দ্রুত শিক্ষক সহায়তা
                </h4>
                <p className="text-xs text-ink-muted">
                  Quick Tutor Advisory Help
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ink-muted hover:text-ink p-1.5 rounded-full hover:bg-clay-light transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700"
              aria-label="Close widget"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 text-xs text-ink-muted leading-relaxed">
            অভিভাবক বা শিক্ষার্থীদের জন্য উপযুক্ত শিক্ষক খুঁজে দিতে আমাদের
            ডেডিকেটেড টিম সার্বক্ষণিক সহযোগিতায় প্রস্তুত।
          </div>

          {/* Action options */}
          <div className="space-y-3">
            {/* WhatsApp direct chat */}
            <a
              href="https://wa.me/8801700000000?text=Hello%20Tutor%20Lagbe,%20I%20am%20looking%20for%20a%20tutor."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-card bg-sage/15 hover:bg-sage/25 text-sage-800 font-medium text-xs sm:text-sm border border-sage/30 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-2.5">
                <FaWhatsapp className="w-5 h-5 text-bangla-green group-hover:scale-105 transition-transform duration-300" />
                <span>WhatsApp এ চ্যাট করুন</span>
              </div>
              <span className="text-[11px] bg-bangla-green text-white px-2.5 py-0.5 rounded-full font-normal">
                তাৎক্ষণিক
              </span>
            </a>

            {/* Direct phone call */}
            <a
              href="tel:+8801700000000"
              className="flex items-center justify-between px-4 py-3 rounded-card bg-clay-light hover:bg-clay/40 text-ink font-medium text-xs sm:text-sm border border-stone transition-colors duration-300"
            >
              <div className="flex items-center gap-2.5">
                <HiOutlinePhone className="w-5 h-5 text-sage-700" />
                <span>সরাসরি কল দিন (+880 1700-000000)</span>
              </div>
            </a>

            {/* Quick Request action */}
            <Link
              href="/tuitions?action=post"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-card bg-primary-800 hover:bg-primary-700 text-white font-medium text-xs sm:text-sm transition-colors duration-300"
            >
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="w-4 h-4 text-sage-300" />
                <span>ফ্রি টিউটর রিকুয়েস্ট পোস্ট করুন</span>
              </div>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-stone text-center">
            <span className="text-[11px] text-ink-muted">
              🔒 নিরাপদ পেমেন্ট ও ভেরিফাইড শিক্ষক গ্যারান্টি
            </span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 bg-primary-800 hover:bg-primary-700 text-white px-5 py-3.5 rounded-full shadow-soft-xl transition-all duration-300 active:translate-y-px group focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        aria-label="Open communication widget"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <FaWhatsapp className="w-6 h-6 text-white group-hover:scale-105 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-terracotta rounded-full ring-2 ring-white" />
        </div>
        <span className="font-medium text-sm hidden sm:inline">
          {isOpen ? "বন্ধ করুন" : "সহায়তা প্রয়োজন?"}
        </span>
      </button>
    </div>
  );
}
