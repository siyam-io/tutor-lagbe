"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  HiOutlineStar,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiCheck,
  HiOutlineHeart,
  HiHeart,
  HiOutlineBriefcase,
  HiShieldCheck,
} from "react-icons/hi";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import JsonLd from "@/components/JsonLd";

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<
    "about" | "reviews" | "teaching" | "availability" | "faqs"
  >("about");
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const [reviews, setReviews] = useState<any[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  const fetchWishlistStatus = async () => {
    if (!isAuthenticated || user?.role !== "STUDENT") return;
    try {
      const { data } = await api.get("/wishlist/ids");
      if (data.success && data.data) {
        setIsWishlisted((data.data as string[]).includes(params.id));
      }
    } catch (err) {
      console.error("Failed to fetch wishlist status:", err);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (user?.role !== "STUDENT") return;
    try {
      const { data } = await api.post(`/wishlist/${params.id}`);
      if (data.success) {
        setIsWishlisted(data.added);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/tutor/${params.id}`);
      if (data.success) {
        setReviews(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (user?.role !== "STUDENT") return;
    setSubmittingReview(true);
    setReviewSuccessMsg("");
    try {
      const { data } = await api.post("/reviews", {
        tutorProfileId: tutor.id,
        rating: Number(newRating),
        comment: newComment,
      });
      if (data.success) {
        setReviewSuccessMsg("Review posted successfully!");
        setNewComment("");
        setNewRating(5);
        fetchReviews();
        // Refresh tutor details
        const { data: updatedTutor } = await api.get(`/tutors/${params.id}`);
        if (updatedTutor.success) {
          setTutor(updatedTutor.data);
        }
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const { data } = await api.get(`/tutors/${params.id}`);
        if (data.success && data.data) {
          setTutor(data.data);
        } else {
          setError(data.error || "Tutor not found");
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load tutor profile");
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [params.id]);

  useEffect(() => {
    fetchWishlistStatus();
    fetchReviews();
  }, [isAuthenticated, user, params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-stone border-t-primary-800" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !tutor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-ink mb-3">
            Error
          </h2>
          <p className="text-ink-muted mb-8">
            {error || "Tutor profile could not be found."}
          </p>
          <Link href="/find-tutor" className="btn-primary">
            Back to Search
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const name = tutor.user?.name || "Tutor";
  const bio =
    tutor.bio ||
    "I help students build strong concepts in Mathematics and problem solving with easy techniques and real-life examples.";
  const subjects = tutor.subjects || [];
  const rating = tutor.averageRating || 0.0;
  const totalReviews = tutor.totalReviews || 0;
  const hourlyRate =
    tutor.hourlyRate || Math.round((tutor.expectedSalary || 16000) / 32) || 800;
  const experience = tutor.experienceYears || 0;
  const institution = tutor.institution || "N/A";
  const qualification = tutor.qualification || "Tutor Profile";
  const location = tutor.locationDistrict || "Dhaka";
  const area = tutor.locationArea || "";

  // Dynamic statistics calculations
  const totalBookingsCount = tutor.bookings?.length || 0;
  const completedCount = (tutor.bookings || []).filter(
    (b: any) => b.status === "COMPLETED"
  ).length;

  // Calculate unique student count
  const uniqueStudentsCount = Array.from(
    new Set((tutor.bookings || []).map((b: any) => b.studentId))
  ).length;

  // Calculate Response Rate: ratio of non-pending responses
  const respondedBookings = (tutor.bookings || []).filter(
    (b: any) => b.status !== "PENDING"
  ).length;
  const responseRate =
    totalBookingsCount > 0
      ? Math.round((respondedBookings / totalBookingsCount) * 100)
      : 100;

  // Languages based on medium
  const languagesList = ["Bengali (Native)"];
  if (tutor.mediums?.some((m: string) => m.toLowerCase().includes("english"))) {
    languagesList.push("English (Fluent)");
  }

  const tutorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    jobTitle: qualification,
    worksFor: {
      "@type": "EducationalOrganization",
      name: institution,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressRegion: area,
      addressCountry: "BD",
    },
    description: bio,
  };

  const stats = [
    { label: "Experience", value: `${experience}+ Years` },
    { label: "Students Taught", value: uniqueStudentsCount },
    { label: "Classes Completed", value: completedCount },
    { label: "Response Rate", value: `${responseRate}%` },
  ];

  const highlights = [
    {
      title: "ID Verification Verified",
      desc: "Tutor profile identity and certificates checked by platform.",
      icon: "🛡️",
    },
    {
      title: "Highly Experienced",
      desc: `Over ${experience} year${
        experience !== 1 ? "s" : ""
      } of active experience tutoring students.`,
      icon: "💼",
    },
    {
      title: "Proven Track Record",
      desc: `Successfully completed ${completedCount} classes on Tutor Lagbe.`,
      icon: "📊",
    },
    {
      title: "Dynamic Availability",
      desc: `Offers slots on days like ${
        Array.from(
          new Set(
            (tutor.availableSlots || []).map((s: string) => s.split("-")[0])
          )
        ).join(", ") || "various weekdays"
      }.`,
      icon: "📅",
    },
  ];

  const chip =
    "text-xs bg-clay-light text-ink px-3.5 py-1.5 rounded-full border border-stone font-medium";

  return (
    <>
      <JsonLd data={tutorJsonLd} />
      <Navbar />
      <main className="py-10 pb-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb & Save Row */}
          <div className="flex justify-between items-center mb-8">
            <nav className="flex text-xs text-ink-muted gap-2">
              <Link href="/" className="hover:text-primary-800 transition-colors duration-300">
                Home
              </Link>
              <span className="text-stone">&gt;</span>
              <Link
                href="/find-tutor"
                className="hover:text-primary-800 transition-colors duration-300"
              >
                Find Tutors
              </Link>
              <span className="text-stone">&gt;</span>
              <span className="text-ink font-medium">Tutor Details</span>
            </nav>

            <button
              onClick={handleToggleWishlist}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                isWishlisted
                  ? "border-terracotta-700 text-terracotta-700 bg-terracotta/10"
                  : "border-stone text-ink-muted bg-white hover:border-terracotta-700 hover:text-terracotta-700"
              }`}
            >
              {isWishlisted ? (
                <>
                  <HiHeart className="w-4 h-4" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <HiOutlineHeart className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>

          {/* Hero Section */}
          <div className="bg-white border border-stone rounded-card p-6 md:p-8 mb-10 shadow-soft">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Portrait — the arch treatment */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="relative w-full max-w-[240px] aspect-[3/4] rounded-arch bg-clay/40 border border-stone overflow-hidden">
                  {tutor.photoUrl ? (
                    <img
                      src={tutor.photoUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-5xl font-semibold text-primary-800">
                      {name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                  )}
                  {/* Verified Overlay */}
                  {tutor.verificationStatus === "APPROVED" && (
                    <span className="absolute bottom-3 left-3 bg-primary-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-1.5">
                      🛡️ ID Verified
                    </span>
                  )}
                  {/* Online Dot */}
                  <span className="absolute top-4 right-4 w-3 h-3 bg-bangla-green border-2 border-white rounded-full" />
                </div>
              </div>

              {/* Bio Info */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink flex items-center gap-2">
                    {name}
                    {tutor.verificationStatus === "APPROVED" && (
                      <span className="text-sage-700 text-lg" title="Verified Tutor">
                        ✓
                      </span>
                    )}
                  </h1>
                  <p className="text-sm text-ink-muted mt-2">{qualification}</p>
                </div>

                {/* Stars and students count */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
                  <div className="flex items-center gap-1.5 text-terracotta-700">
                    <HiOutlineStar className="w-4 h-4" />
                    <span className="text-ink font-semibold">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-ink-muted">
                      ({totalReviews} Reviews)
                    </span>
                  </div>
                  <span className="text-stone">•</span>
                  <span>
                    {uniqueStudentsCount} Active Student
                    {uniqueStudentsCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Institution / Experience / Location */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <HiOutlineAcademicCap className="w-4 h-4 text-sage-700" />
                    {institution}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiOutlineBriefcase className="w-4 h-4 text-sage-700" />
                    {experience}+ Years Experience
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiOutlineLocationMarker className="w-4 h-4 text-sage-700" />
                    {area ? `${area}, ` : ""}
                    {location}
                  </span>
                </div>

                <span className="badge-success">
                  {tutor.mediums?.join(" & ") || "Online & Home Tutor"}
                </span>

                <p className="text-sm text-ink-muted leading-relaxed max-w-xl">
                  {bio}
                </p>

                {/* Subjects I Teach */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase tracking-widest text-sage-700 font-medium">
                    Subjects I Teach
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((sub: string) => (
                      <span key={sub} className={chip}>
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking CTA */}
              <div className="lg:col-span-3 bg-clay-light p-6 rounded-card border border-stone space-y-6">
                <div>
                  <span className="font-display text-3xl font-semibold text-ink">
                    ৳ {hourlyRate}
                  </span>
                  <span className="text-xs text-ink-muted"> /hr</span>
                  <div className="mt-2">
                    <span className="text-sm font-medium text-primary-800">
                      ৳ {tutor.expectedSalary?.toLocaleString() || "6,000"}
                    </span>
                    <span className="text-[10px] text-ink-muted"> /month</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-ink-muted">
                  <div className="flex items-center gap-2">
                    <HiCheck className="w-4 h-4 text-sage-700" />
                    <span>Flexible Schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiCheck className="w-4 h-4 text-sage-700" />
                    <span>First Class Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiCheck className="w-4 h-4 text-sage-700" />
                    <span>100% Satisfaction Guarantee</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/booking?tutorId=${tutor.id}`}
                    className="btn-primary w-full text-xs"
                  >
                    <HiOutlineCalendar className="w-4 h-4" /> Book a Session
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Content Tabs vs Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Content Area (8/12 width) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Tab Navigation */}
              <div className="flex flex-wrap border-b border-stone gap-8">
                {(
                  ["about", "reviews", "teaching", "availability", "faqs"] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs font-medium uppercase tracking-widest border-b-2 transition-colors duration-300 ${
                      activeTab === tab
                        ? "border-primary-800 text-primary-800"
                        : "border-transparent text-ink-muted hover:text-ink"
                    }`}
                  >
                    {tab === "about"
                      ? "About"
                      : tab === "reviews"
                      ? `Reviews (${totalReviews})`
                      : tab === "teaching"
                      ? "Teaching Info"
                      : tab === "availability"
                      ? "Availability"
                      : "FAQs"}
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              {activeTab === "about" && (
                <div className="space-y-8">
                  <div className="card p-8 space-y-7 hover:translate-y-0">
                    <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                      👤 About Me
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {bio}
                    </p>

                    {/* Metric Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-clay-light p-4 rounded-card border border-stone text-center"
                        >
                          <span className="text-xs text-ink-muted">
                            {stat.label}
                          </span>
                          <p className="font-display font-semibold text-ink text-lg mt-1.5">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What Students Say */}
                  {reviews.length > 0 && (
                    <div className="card p-8 space-y-6 hover:translate-y-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                          ⭐ What Students Say
                        </h3>
                        <button
                          onClick={() => setActiveTab("reviews")}
                          className="text-xs text-primary-700 hover:text-primary-800 font-medium transition-colors duration-300"
                        >
                          View All Reviews
                        </button>
                      </div>

                      <div className="border border-stone p-6 rounded-card bg-canvas space-y-5">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="w-11 h-11 rounded-full bg-clay/40 border border-stone flex items-center justify-center text-xs font-medium text-primary-800">
                              {reviews[0].student?.name
                                ? reviews[0].student.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                : "S"}
                            </div>
                            <div>
                              <h4 className="font-medium text-ink text-sm">
                                {reviews[0].student?.name}
                              </h4>
                              <p className="text-[10px] text-ink-muted mt-0.5">
                                Verified Student
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-0.5 text-terracotta-700 text-xs">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>
                                  {i < reviews[0].rating ? "★" : "☆"}
                                </span>
                              ))}
                              <span className="font-semibold text-ink ml-1.5">
                                {reviews[0].rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-[10px] text-ink-muted block mt-1">
                              {new Date(
                                reviews[0].createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-ink-muted leading-relaxed">
                          {reviews[0].comment}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  <div className="card p-8 space-y-6 hover:translate-y-0">
                    <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                      💡 Highlights
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {highlights.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 p-5 bg-clay-light border border-stone rounded-card"
                        >
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <h5 className="font-medium text-ink text-sm">
                              {item.title}
                            </h5>
                            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  {/* Write a review */}
                  {isAuthenticated && user?.role === "STUDENT" && (
                    <form
                      onSubmit={handlePostReview}
                      className="card p-8 space-y-5 border-primary-200 hover:translate-y-0"
                    >
                      <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                        ⭐ Leave a Review & Rating
                      </h3>
                      {reviewSuccessMsg && (
                        <div className="p-3 bg-sage/15 border border-sage/40 text-sage-800 text-xs font-medium rounded-full text-center">
                          {reviewSuccessMsg}
                        </div>
                      )}

                      <div className="space-y-3">
                        <label className="text-xs font-medium text-sage-700 uppercase tracking-widest block">
                          Select Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className={`p-2 rounded-full text-lg transition-all duration-300 ${
                                star <= newRating
                                  ? "text-terracotta-700 bg-terracotta/10"
                                  : "text-stone hover:text-terracotta"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-medium text-sage-700 uppercase tracking-widest block">
                          Your Review
                        </label>
                        <textarea
                          rows={3}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your learning experience with this tutor..."
                          className="input-field"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn-primary text-xs"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}

                  {/* Reviews list */}
                  <div className="card p-8 space-y-6 hover:translate-y-0">
                    <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                      👥 Reviews History
                    </h3>

                    {reviews.length === 0 ? (
                      <p className="text-sm text-ink-muted">
                        No reviews yet for this tutor.
                      </p>
                    ) : (
                      <div className="space-y-6 divide-y divide-stone">
                        {reviews.map((rev, idx) => (
                          <div
                            key={rev.id}
                            className={`space-y-3 ${idx === 0 ? "" : "pt-6"}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-clay/40 border border-stone flex items-center justify-center text-xs font-medium text-primary-800 overflow-hidden">
                                  {rev.student?.avatarUrl ? (
                                    <img
                                      src={rev.student.avatarUrl}
                                      alt={rev.student.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : rev.student?.name ? (
                                    rev.student.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                  ) : (
                                    "S"
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-ink text-sm">
                                    {rev.student?.name || "Student"}
                                  </h4>
                                  <p className="text-[10px] text-ink-muted mt-0.5">
                                    Verified Student
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="flex items-center gap-0.5 text-terracotta-700 text-xs">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>
                                      {i < rev.rating ? "★" : "☆"}
                                    </span>
                                  ))}
                                  <span className="font-semibold text-ink ml-1.5">
                                    {rev.rating.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-[10px] text-ink-muted block mt-1">
                                  {new Date(rev.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-ink-muted leading-relaxed">
                              {rev.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "teaching" && (
                <div className="card p-8 space-y-7 hover:translate-y-0">
                  <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                    📚 Teaching Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs text-sage-700 font-medium uppercase tracking-widest mb-3">
                        Subjects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((s: string) => (
                          <span key={s} className={chip}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs text-sage-700 font-medium uppercase tracking-widest mb-3">
                        Classes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tutor.classes?.map((c: string) => (
                          <span key={c} className={chip}>
                            {c}
                          </span>
                        )) || <span className="text-xs text-ink-muted">N/A</span>}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs text-sage-700 font-medium uppercase tracking-widest mb-3">
                        Mediums
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tutor.mediums?.map((m: string) => (
                          <span key={m} className={chip}>
                            {m}
                          </span>
                        )) || <span className="text-xs text-ink-muted">N/A</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "availability" && (
                <div className="card p-8 space-y-7 hover:translate-y-0">
                  <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                    📅 Availability Schedule
                  </h3>
                  {tutor.availableSlots && tutor.availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {tutor.availableSlots.map((slot: string) => (
                        <div
                          key={slot}
                          className="px-4 py-3 bg-sage/10 border border-sage/30 text-sage-800 rounded-full text-xs font-medium text-center"
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-ink-muted">
                      No specific availability slots listed.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "faqs" && (
                <div className="card p-8 space-y-7 hover:translate-y-0">
                  <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                    ❓ Frequently Asked Questions
                  </h3>
                  {tutor.faqs && (tutor.faqs as any[]).length > 0 ? (
                    <div className="space-y-4">
                      {(tutor.faqs as any[]).map(
                        (faq: { question: string; answer: string }, idx) => (
                          <div
                            key={idx}
                            className="p-5 bg-clay-light rounded-card border border-stone space-y-2.5"
                          >
                            <h4 className="font-medium text-ink text-sm">
                              Q: {faq.question}
                            </h4>
                            <p className="text-sm text-ink-muted">
                              A: {faq.answer}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-ink-muted">
                      No FAQs provided by the tutor yet.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Widgets Column (4/12 width) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Availability Widget */}
              <div className="card p-6 space-y-5 hover:translate-y-0">
                <h3 className="font-display font-semibold text-ink text-sm flex items-center gap-2">
                  📅 Availability Slots
                </h3>

                <div className="space-y-3.5 text-xs">
                  {tutor.availableSlots && tutor.availableSlots.length > 0 ? (
                    (() => {
                      const daysMap: Record<string, string[]> = {};
                      tutor.availableSlots.forEach((slot: string) => {
                        const [day, time] = slot.split("-");
                        if (day && time) {
                          if (!daysMap[day]) daysMap[day] = [];
                          daysMap[day].push(time);
                        }
                      });
                      return Object.entries(daysMap).map(([day, times]) => (
                        <div
                          key={day}
                          className="flex justify-between items-center text-ink-muted"
                        >
                          <span className="font-medium text-ink">
                            {day === "Sat"
                              ? "Saturday"
                              : day === "Sun"
                              ? "Sunday"
                              : day === "Mon"
                              ? "Monday"
                              : day === "Tue"
                              ? "Tuesday"
                              : day === "Wed"
                              ? "Wednesday"
                              : day === "Thu"
                              ? "Thursday"
                              : "Friday"}
                          </span>
                          <span className="text-primary-800">
                            {times.join(", ")}
                          </span>
                        </div>
                      ));
                    })()
                  ) : (
                    <p className="text-ink-muted">No available slots.</p>
                  )}
                </div>
              </div>

              {/* Education Widget */}
              <div className="card p-6 space-y-5 hover:translate-y-0">
                <h3 className="font-display font-semibold text-ink text-sm flex items-center gap-2">
                  🎓 Education
                </h3>

                <div className="flex gap-4">
                  <span className="stat-icon">🏫</span>
                  <div>
                    <h4 className="font-medium text-ink text-sm">
                      {qualification}
                    </h4>
                    <p className="text-xs text-ink-muted mt-1">
                      {institution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Languages Widget */}
              <div className="card p-6 space-y-5 hover:translate-y-0">
                <h3 className="font-display font-semibold text-ink text-sm flex items-center gap-2">
                  🌐 Languages
                </h3>

                <div className="flex flex-wrap gap-2">
                  {languagesList.map((lang) => (
                    <span key={lang} className={chip}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Conversion Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-canvas/95 backdrop-blur-md border-t border-stone md:hidden flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-ink-muted block">
              মাসিক পারিশ্রমিক
            </span>
            <p className="font-display font-semibold text-primary-800 text-lg">
              ৳{tutor.expectedSalary || hourlyRate * 12}/মাস
            </p>
          </div>
          <Link
            href={`/booking?tutorId=${tutor.id}`}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <span>বুকিং / ডেমো ক্লাস</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
