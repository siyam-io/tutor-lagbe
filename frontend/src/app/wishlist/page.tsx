"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import {
  HiHeart,
  HiOutlineLocationMarker,
  HiOutlineAcademicCap,
} from "react-icons/hi";

export default function StudentWishlistPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/wishlist");
      if (data.success) {
        setWishlist(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setError("Failed to load your wishlist items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "STUDENT") {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleToggleWishlist = async (tutorId: string) => {
    try {
      const { data } = await api.post(`/wishlist/${tutorId}`);
      if (data.success && !data.added) {
        // Removed from wishlist, update state
        setWishlist((prev) => prev.filter((item) => item.id !== tutorId));
      }
    } catch (err) {
      console.error("Failed to toggle wishlist item:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone border-t-primary-800 mx-auto" />
          <p className="font-display text-ink-muted mt-4">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "STUDENT") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-sm text-center p-10 hover:translate-y-0">
          <h2 className="font-display text-2xl font-semibold text-ink mb-3">
            Access Denied
          </h2>
          <p className="text-ink-muted mb-8">
            Only students are authorized to access this page.
          </p>
          <Link href="/login" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="STUDENT" />
      <div className="flex-1 p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
            আপনার সংরক্ষিত তালিকা
          </span>
          <h1 className="font-display text-4xl font-semibold text-ink mb-3">
            My Saved Tutors
          </h1>
          <p className="text-ink-muted mb-12">
            Quickly view and manage the tutor profiles you saved for later
            reference.
          </p>

          {error && (
            <div className="p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta-800 rounded-card text-center mb-8">
              {error}
            </div>
          )}

          {wishlist.length === 0 ? (
            <div className="card text-center py-20 px-6 space-y-5 hover:translate-y-0">
              <div className="w-16 h-16 bg-terracotta/10 text-terracotta-700 rounded-full flex items-center justify-center text-3xl mx-auto">
                ❤️
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink">
                Your wishlist is empty
              </h3>
              <p className="text-ink-muted max-w-sm mx-auto text-sm leading-relaxed">
                Browse our tutor search panel and save tutors you like so they
                appear here!
              </p>
              <Link href="/find-tutor" className="btn-primary text-xs">
                Find Tutors
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {wishlist.map((tutor, index) => {
                const name = tutor.user?.name || "Tutor Name";
                return (
                  <div
                    key={tutor.id}
                    className={`card p-6 flex flex-col justify-between relative ${
                      index % 2 === 1 ? "md:translate-y-8" : ""
                    }`}
                  >
                    {/* Heart wishlist toggle */}
                    <button
                      onClick={() => handleToggleWishlist(tutor.id)}
                      className="absolute top-5 right-5 w-9 h-9 rounded-full bg-terracotta/10 text-terracotta-700 hover:bg-terracotta/20 flex items-center justify-center transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                      title="Remove from Saved"
                      aria-label="Remove from saved"
                    >
                      <HiHeart className="w-5 h-5" />
                    </button>

                    <div>
                      {/* Avatar / basic details */}
                      <div className="flex gap-4 items-center mb-5">
                        <div className="w-16 h-16 rounded-image bg-clay/40 border border-stone overflow-hidden flex-shrink-0">
                          {tutor.photoUrl ? (
                            <img
                              src={tutor.photoUrl}
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-display font-semibold text-primary-800">
                              {name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-ink text-base hover:text-primary-800 transition-colors duration-300">
                            <Link href={`/tutors/${tutor.id}`}>{name}</Link>
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-terracotta-700 text-xs">
                              ★
                            </span>
                            <span className="text-xs font-semibold text-ink">
                              {tutor.averageRating?.toFixed(1) || "5.0"}
                            </span>
                            <span className="text-[10px] text-ink-muted">
                              ({tutor.totalReviews || 0} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-ink-muted line-clamp-2 mb-5 leading-relaxed">
                        {tutor.bio || "No biography provided by the tutor."}
                      </p>

                      {/* Info badges */}
                      <div className="space-y-2.5 mb-5">
                        <div className="flex items-center gap-2 text-xs text-ink-muted">
                          <HiOutlineAcademicCap className="w-4 h-4 text-sage-700 flex-shrink-0" />
                          <span className="truncate">
                            {tutor.subjects?.join(", ") || "General"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-ink-muted">
                          <HiOutlineLocationMarker className="w-4 h-4 text-sage-700 flex-shrink-0" />
                          <span className="truncate">
                            {tutor.locationArea}, {tutor.locationDistrict}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-stone pt-5 mt-auto flex justify-between items-center gap-3">
                      <div>
                        <p className="text-[10px] uppercase font-medium tracking-wider text-ink-muted">
                          Monthly / Hourly
                        </p>
                        <p className="text-sm font-semibold text-primary-800">
                          ৳{tutor.expectedSalary?.toLocaleString() || "6,000"}
                          /mo
                        </p>
                        <p className="text-[10px] text-ink-muted">
                          ৳{tutor.hourlyRate || 500}/hr
                        </p>
                      </div>
                      <Link
                        href={`/tutors/${tutor.id}`}
                        className="btn-primary py-2 px-5 text-[11px]"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
