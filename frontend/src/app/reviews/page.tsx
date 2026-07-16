"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiOutlineStar } from "react-icons/hi";

export default function ReviewsPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const reviews = [
    { id: "1", student: "Rafiq Hasan", rating: 5, comment: "Excellent tutor! My son improved significantly in math. Very patient and knowledgeable.", date: "2024-01-15" },
    { id: "2", student: "Ayesha Begum", rating: 4, comment: "Good teaching style. Explains concepts clearly. Would recommend to others.", date: "2024-01-10" },
    { id: "3", student: "Karim Uddin", rating: 5, comment: "Best math tutor I've ever had. Makes difficult topics easy to understand.", date: "2024-01-05" },
    { id: "4", student: "Maliha Rahman", rating: 3, comment: "Decent tutor, but sometimes runs late for sessions.", date: "2024-01-02" },
  ];

  const ratingDistribution = { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 };
  const totalReviews = 100;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Reviews</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="md:col-span-1">
              <div className="card">
                <div className="text-center mb-6">
                  <p className="text-5xl font-bold text-slate-900 dark:text-white">4.8</p>
                  <div className="flex items-center justify-center gap-0.5 my-2 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <HiOutlineStar key={s} className={`w-5 h-5 ${s <= 4 ? "fill-current" : ""}`} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">{totalReviews} total reviews</p>
                </div>

                {/* Rating bars */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-slate-500">{star}★</span>
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${ratingDistribution[star as keyof typeof ratingDistribution]}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-slate-500">{ratingDistribution[star as keyof typeof ratingDistribution]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews List + Write Review */}
            <div className="md:col-span-2 space-y-6">
              {/* Write Review */}
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Write a Review</h3>
                <div className="flex items-center gap-1 mb-4">
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
                          star <= (hoverRating || rating) ? "text-yellow-500 fill-current" : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="input-field mb-4"
                />
                <button className="btn-primary" disabled={!rating || !comment}>
                  Submit Review
                </button>
              </div>

              {/* Reviews */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm">
                          {review.student.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm">{review.student}</p>
                          <p className="text-xs text-slate-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-yellow-500 text-sm">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <HiOutlineStar key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-current" : ""}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
