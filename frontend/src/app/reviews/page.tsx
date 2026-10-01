"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import { HiOutlineStar, HiOutlineCheckCircle } from "react-icons/hi";

export default function ReviewsPage() {
  const { user, isAuthenticated } = useAuthStore();
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, bookingsRes] = await Promise.all([
        api.get("/reviews/student"),
        api.get("/bookings/student"),
      ]);

      if (reviewsRes.data.success) {
        setReviews(reviewsRes.data.data);
      }
      if (bookingsRes.data.success) {
        // Only allow reviewing completed bookings
        const completed = bookingsRes.data.data.filter(
          (b: any) => b.status === "COMPLETED" && b.tutor
        );
        setCompletedBookings(completed);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load reviews data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleSubmitReview = async () => {
    if (!selectedTutorId || !rating || !comment) return;
    setSubmitting(true);
    setError("");
    setSuccessMsg("");
    try {
      const { data } = await api.post("/reviews", {
        tutorProfileId: selectedTutorId,
        rating,
        comment,
      });

      if (data.success) {
        setSuccessMsg("Review submitted successfully!");
        setRating(0);
        setComment("");
        setSelectedTutorId("");
        // Reload reviews list
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit review");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Compute metrics dynamically
  const totalReviewsCount = reviews.length;
  const averageScore =
    totalReviewsCount > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
      : "0.0";

  // Calculate rating distribution
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = r.rating as 5 | 4 | 3 | 2 | 1;
    if (ratingDistribution[star] !== undefined) {
      ratingDistribution[star]++;
    }
  });

  const getPercent = (starCount: number) => {
    if (totalReviewsCount === 0) return 0;
    return Math.round((starCount / totalReviewsCount) * 100);
  };

  const mainContent = (
    <div className="max-w-4xl mx-auto">
      <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
        রিভিউ ও রেটিং
      </span>
      <h1 className="font-display text-4xl font-semibold text-ink mb-3">My Reviews</h1>
      <p className="text-ink-muted mb-12">
        See the reviews you have written and review your active tutors.
      </p>

      {error && (
        <div className="p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta-800 rounded-card text-center mb-8">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-sage/15 border border-sage/40 text-sage-800 rounded-card flex items-center gap-2 mb-8">
          <HiOutlineCheckCircle className="w-5 h-5 text-sage-700" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="md:col-span-1">
          <div className="card">
            <div className="text-center mb-6">
              <p className="font-display text-5xl font-semibold text-ink">{averageScore}</p>
              <div className="flex items-center justify-center gap-0.5 my-3 text-terracotta-700">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiOutlineStar
                    key={s}
                    className={`w-5 h-5 ${s <= Math.round(Number(averageScore)) ? "fill-current" : ""}`}
                  />
                ))}
              </div>
              <p className="text-sm text-ink-muted">{totalReviewsCount} review{totalReviewsCount !== 1 ? "s" : ""} written</p>
            </div>

            {/* Rating bars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star as keyof typeof ratingDistribution];
                const pct = getPercent(count);
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-8 text-ink-muted">{star}★</span>
                    <div className="flex-1 h-2 bg-clay/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-terracotta-700 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-ink-muted">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List + Write Review */}
        <div className="md:col-span-2 space-y-6">
          {/* Write Review */}
          <div className="card">
            <h3 className="font-display text-lg font-semibold text-ink mb-6">Write a Review</h3>

            {completedBookings.length === 0 ? (
              <p className="text-sm text-ink-muted">
                You can write reviews once you have completed classes with a tutor.
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="label text-[11px]">
                    Select Tutor
                  </label>
                  <select
                    value={selectedTutorId}
                    onChange={(e) => setSelectedTutorId(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">-- Choose Tutor --</option>
                    {completedBookings.map((b) => (
                      <option key={b.id} value={b.tutorProfileId}>
                        {b.tutor?.user?.name} ({b.tutor?.subjects?.[0] || "Tuition"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      <HiOutlineStar
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? "text-terracotta-700 fill-current"
                            : "text-stone"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this tutor..."
                  className="input-field"
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={!selectedTutorId || !rating || !comment || submitting}
                  className="btn-primary"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="card text-center py-12 text-ink-muted hover:translate-y-0">
                <p className="font-display font-medium">No reviews written yet.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="card hover:translate-y-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-image bg-clay/40 border border-stone flex items-center justify-center font-display font-semibold text-primary-800 text-sm">
                        {review.tutor?.user?.name
                          ? review.tutor.user.name.split(" ").map((n: string) => n[0]).join("")
                          : "T"}
                      </div>
                      <div>
                        <p className="font-medium text-ink text-sm">
                          Tutor: {review.tutor?.user?.name || "Tutor"}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-terracotta-700 text-sm">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <HiOutlineStar
                          key={s}
                          className={`w-4 h-4 ${s <= review.rating ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-ink-muted text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone border-t-primary-800 mx-auto"></div>
          <p className="text-ink-muted mt-4">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-8 flex items-center justify-center">
          <div className="card max-w-md text-center p-10 hover:translate-y-0">
            <h2 className="font-display text-2xl font-semibold text-ink mb-3">Login Required</h2>
            <p className="text-ink-muted mb-8">Please log in to view and write reviews.</p>
            <a href="/login" className="btn-primary inline-block">Go to Login</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="STUDENT" />
      <div className="flex-1 p-6 lg:p-12">{mainContent}</div>
    </div>
  );
}
