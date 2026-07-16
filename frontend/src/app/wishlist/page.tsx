"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import { HiHeart, HiOutlineLocationMarker, HiOutlineAcademicCap } from "react-icons/hi";

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
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-slate-500 mt-2">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "STUDENT") {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <div className="card max-w-sm text-center p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Only students are authorized to access this page.</p>
          <Link href="/login" className="btn-primary inline-block">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="STUDENT" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Saved Tutors</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Quickly view and manage the tutor profiles you saved for later reference.</p>

          {error && <div className="p-4 bg-red-50 text-red-650 rounded-lg text-center mb-6">{error}</div>}

          {wishlist.length === 0 ? (
            <div className="card text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 bg-pink-50 dark:bg-pink-950/20 text-pink-500 rounded-full flex items-center justify-center text-3xl mx-auto">
                ❤️
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Your wishlist is empty</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-xs">
                Browse our tutor search panel and save tutors you like so they appear here!
              </p>
              <Link href="/find-tutor" className="btn-primary inline-block text-xs py-2 px-6">
                Find Tutors
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((tutor) => {
                const name = tutor.user?.name || "Tutor Name";
                return (
                  <div key={tutor.id} className="card p-5 flex flex-col justify-between relative group hover:shadow-md transition-shadow">
                    {/* Heart wishlist toggle */}
                    <button
                      onClick={() => handleToggleWishlist(tutor.id)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-500 hover:text-slate-400 flex items-center justify-center transition-colors"
                      title="Remove from Saved"
                    >
                      <HiHeart className="w-5 h-5" />
                    </button>

                    <div>
                      {/* Avatar / basic details */}
                      <div className="flex gap-4 items-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                          {tutor.photoUrl ? (
                            <img src={tutor.photoUrl} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                              {name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm hover:text-primary-600 transition-colors">
                            <Link href={`/tutors/${tutor.id}`}>{name}</Link>
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-yellow-500 text-xs">★</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                              {tutor.averageRating?.toFixed(1) || "5.0"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({tutor.totalReviews || 0} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                        {tutor.bio || "No biography provided by the tutor."}
                      </p>

                      {/* Info badges */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-400">
                          <HiOutlineAcademicCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{tutor.subjects?.join(", ") || "General"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-400">
                          <HiOutlineLocationMarker className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{tutor.locationArea}, {tutor.locationDistrict}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-auto flex justify-between items-center">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Tuition</p>
                        <p className="text-sm font-extrabold text-primary-600 dark:text-primary-400">
                          ৳{tutor.expectedSalary?.toLocaleString() || "6,000"}
                        </p>
                      </div>
                      <Link href={`/tutors/${tutor.id}`} className="btn-primary py-1.5 px-4 text-xs font-semibold">
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
