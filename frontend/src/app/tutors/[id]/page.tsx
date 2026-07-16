"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { HiOutlineStar, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineAcademicCap, HiOutlineChatAlt, HiCheck, HiOutlineShare, HiOutlineHeart, HiHeart, HiOutlineBriefcase } from "react-icons/hi";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "teaching" | "availability" | "faqs">("about");
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !tutor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Error</h2>
          <p className="text-slate-500 mb-6">{error || "Tutor profile could not be found."}</p>
          <Link href="/find-tutor" className="btn-primary">Back to Search</Link>
        </div>
        <Footer />
      </>
    );
  }

  const name = tutor.user?.name || "Tutor";
  const bio = tutor.bio || "I help students build strong concepts in Mathematics and problem solving with easy techniques and real-life examples.";
  const subjects = tutor.subjects || [];
  const rating = tutor.averageRating || 0.0;
  const totalReviews = tutor.totalReviews || 0;
  const hourlyRate = tutor.hourlyRate || Math.round((tutor.expectedSalary || 16000) / 32) || 800;
  const experience = tutor.experienceYears || 0;
  const institution = tutor.institution || "N/A";
  const qualification = tutor.qualification || "Tutor Profile";
  const location = tutor.locationDistrict || "Dhaka";
  const area = tutor.locationArea || "";

  // Dynamic statistics calculations
  const totalBookingsCount = tutor.bookings?.length || 0;
  const completedCount = (tutor.bookings || []).filter((b: any) => b.status === "COMPLETED").length;
  
  // Calculate unique student count
  const uniqueStudentsCount = Array.from(
    new Set((tutor.bookings || []).map((b: any) => b.studentId))
  ).length;

  // Calculate Response Rate: ratio of non-pending responses
  const respondedBookings = (tutor.bookings || []).filter(
    (b: any) => b.status !== "PENDING"
  ).length;
  const responseRate = totalBookingsCount > 0 
    ? Math.round((respondedBookings / totalBookingsCount) * 100) 
    : 100;

  // Languages based on medium
  const languagesList = ["Bengali (Native)"];
  if (tutor.mediums?.some((m: string) => m.toLowerCase().includes("english"))) {
    languagesList.push("English (Fluent)");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Breadcrumb & Share/Save Buttons Row */}
          <div className="flex justify-between items-center mb-6">
            <nav className="flex text-xs text-slate-400 dark:text-slate-500 gap-1.5">
              <Link href="/" className="hover:underline">Home</Link>
              <span>&gt;</span>
              <Link href="/find-tutor" className="hover:underline">Find Tutors</Link>
              <span>&gt;</span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Tutor Details</span>
            </nav>

            <div className="flex gap-2">
              <button 
                onClick={handleToggleWishlist}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm"
              >
                {isWishlisted ? (
                  <>
                    <HiHeart className="w-4 h-4 text-red-500 fill-current" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <HiOutlineHeart className="w-4 h-4 text-slate-500" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hero Section Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Profile Picture */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="w-full max-w-[240px] aspect-square md:aspect-[3/4] rounded-2xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative shadow-sm">
                  {tutor.photoUrl ? (
                    <img src={tutor.photoUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-5xl font-bold">
                      {name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                  )}
                  {/* Verified Overlay */}
                  {tutor.verificationStatus === "APPROVED" && (
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      🛡️ ID Verified
                    </span>
                  )}
                  {/* Online Dot */}
                  <span className="absolute top-3 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
              </div>

              {/* Middle Profile Bio Info */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    {name}
                    {tutor.verificationStatus === "APPROVED" && (
                      <span className="text-blue-500 text-lg" title="Verified Tutor">✓</span>
                    )}
                  </h1>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{qualification}</p>
                </div>

                {/* Stars and students count info */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <HiOutlineStar className="w-4 h-4 fill-current" />
                    <span className="text-slate-800 dark:text-slate-200">{rating.toFixed(1)}</span>
                    <span className="text-slate-400">({totalReviews} Reviews)</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span>{uniqueStudentsCount} Active Student{uniqueStudentsCount !== 1 ? "s" : ""}</span>
                </div>

                {/* Institution / Experience / Location list */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <HiOutlineAcademicCap className="w-4 h-4 text-slate-400" />
                    {institution}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiOutlineBriefcase className="w-4 h-4 text-slate-400" />
                    {experience}+ Years Experience
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                    {area ? `${area}, ` : ""}{location}
                  </span>
                </div>

                {/* Badge Tag */}
                <span className="inline-block text-[10px] bg-green-50/50 dark:bg-green-950/20 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-lg border border-green-200/50 dark:border-green-950/50">
                  {tutor.mediums?.join(" & ") || "Online & Home Tutor"}
                </span>

                {/* Mini Paragraph Bio */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  {bio}
                </p>

                {/* Subjects I Teach list */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Subjects I Teach</h4>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((sub: string) => (
                      <span key={sub} className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-3 py-1 rounded-xl border border-slate-100 dark:border-slate-800">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Booking Call to Action */}
              <div className="lg:col-span-3 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5">
                <div>
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">৳ {hourlyRate}</span>
                    <span className="text-xs text-slate-400 font-medium"> /hr</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">৳ {tutor.expectedSalary?.toLocaleString() || "6,000"}</span>
                    <span className="text-[10px] text-slate-400 font-medium"> /month</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  <div className="flex items-center gap-2">
                    <HiCheck className="w-4 h-4 text-blue-500" />
                    <span>Flexible Schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiCheck className="w-4 h-4 text-blue-500" />
                    <span>First Class Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiCheck className="w-4 h-4 text-blue-500" />
                    <span>100% Satisfaction Guarantee</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Link href={`/booking?tutorId=${tutor.id}`} className="w-full btn-primary py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                    <HiOutlineCalendar className="w-4 h-4" /> Book a Session
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Grid: Navigation Tabs vs Right Column Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Content Area (8/12 width) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-200 dark:border-slate-850 gap-6">
                {(["about", "reviews", "teaching", "availability", "faqs"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeTab === tab
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab === "about" ? "About" : tab === "reviews" ? `Reviews (${totalReviews})` : tab === "teaching" ? "Teaching Info" : tab === "availability" ? "Availability" : "FAQs"}
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              {activeTab === "about" && (
                <div className="space-y-8">
                  {/* About Me Section */}
                  <div className="card p-6 md:p-8 space-y-6">
                    <h3 className="text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                      👤 About Me
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {bio}
                    </p>

                    {/* Metric Stats Cards Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 font-medium">Experience</span>
                        <p className="font-extrabold text-slate-900 dark:text-white text-base mt-1">{experience}+ Years</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 font-medium">Students Taught</span>
                        <p className="font-extrabold text-slate-900 dark:text-white text-base mt-1">{uniqueStudentsCount}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 font-medium">Classes Completed</span>
                        <p className="font-extrabold text-slate-900 dark:text-white text-base mt-1">{completedCount}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 font-medium">Response Rate</span>
                        <p className="font-extrabold text-slate-900 dark:text-white text-base mt-1">{responseRate}%</p>
                      </div>
                    </div>
                  </div>

                  {/* What Students Say Slider */}
                  {reviews.length > 0 && (
                    <div className="card p-6 md:p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                          ⭐ What Students Say
                        </h3>
                        <button 
                          onClick={() => setActiveTab("reviews")}
                          className="text-xs text-primary-600 hover:text-primary-700 font-bold"
                        >
                          View All Reviews
                        </button>
                      </div>

                      <div className="border border-slate-150 dark:border-slate-800 p-5 rounded-2xl bg-white dark:bg-slate-900 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                              {reviews[0].student?.name ? reviews[0].student.name.split(" ").map((n: string) => n[0]).join("") : "S"}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{reviews[0].student?.name}</h4>
                              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Verified Student</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-0.5 text-yellow-500 text-xs">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{i < reviews[0].rating ? "★" : "☆"}</span>
                              ))}
                              <span className="font-bold text-slate-700 dark:text-slate-300 ml-1">{reviews[0].rating.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                              {new Date(reviews[0].createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {reviews[0].comment}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Teaching Approach */}
                  <div className="card p-6 md:p-8 space-y-6">
                    <h3 className="text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                      💡 Highlights
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: "ID Verification Verified", desc: "Tutor profile identity and certificates checked by platform.", icon: "🛡️" },
                        { title: "Highly Experienced", desc: `Over ${experience} year${experience !== 1 ? 's' : ''} of active experience tutoring students.`, icon: "💼" },
                        { title: "Proven Track Record", desc: `Successfully completed ${completedCount} classes on Tutor Lagbe.`, icon: "📊" },
                        { title: "Dynamic Availability", desc: `Offers slots on days like ${Array.from(new Set((tutor.availableSlots || []).map((s: string) => s.split("-")[0]))).join(", ") || "various weekdays"}.`, icon: "📅" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-3.5 p-4 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <h5 className="font-bold text-slate-900 dark:text-white text-xs">{item.title}</h5>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Write a review section */}
                  {isAuthenticated && user?.role === "STUDENT" && (
                    <form onSubmit={handlePostReview} className="card p-6 md:p-8 space-y-4 border border-primary-100 dark:border-primary-950 bg-gradient-to-br from-white to-primary-50/10 dark:from-slate-900 dark:to-primary-950/10 shadow-sm">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        ⭐ Leave a Review & Rating
                      </h3>
                      {reviewSuccessMsg && <div className="p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200">{reviewSuccessMsg}</div>}
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">Select Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className={`p-1.5 rounded-lg text-lg transition-all ${
                                star <= newRating 
                                  ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20" 
                                  : "text-slate-300 hover:text-yellow-400"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">Your Review</label>
                        <textarea
                          rows={3}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your learning experience with this tutor..."
                          className="input-field"
                          required
                        />
                      </div>

                      <button type="submit" disabled={submittingReview} className="btn-primary py-2.5 px-6 text-xs font-bold rounded-xl">
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}

                  {/* Reviews list */}
                  <div className="card p-6 md:p-8 space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      👥 Reviews History
                    </h3>

                    {reviews.length === 0 ? (
                      <p className="text-xs text-slate-500">No reviews yet for this tutor.</p>
                    ) : (
                      <div className="space-y-5 divide-y divide-slate-100 dark:divide-slate-800">
                        {reviews.map((rev, idx) => (
                          <div key={rev.id} className={`pt-5 ${idx === 0 ? "pt-0" : ""} space-y-3`}>
                            <div className="flex justify-between items-start">
                              <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden">
                                  {rev.student?.avatarUrl ? (
                                    <img src={rev.student.avatarUrl} alt={rev.student.name} className="w-full h-full object-cover" />
                                  ) : (
                                    rev.student?.name ? rev.student.name.split(" ").map((n: string) => n[0]).join("") : "S"
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{rev.student?.name || "Student"}</h4>
                                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Verified Student</p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="flex items-center gap-0.5 text-yellow-500 text-xs">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                                  ))}
                                  <span className="font-bold text-slate-700 dark:text-slate-300 ml-1">{rev.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-[9px] text-slate-400 font-semibold block mt-1">
                                  {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
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
                <div className="card p-6 md:p-8 space-y-6">
                  <h3 className="text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                    📚 Teaching Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs text-slate-400 font-bold uppercase mb-2">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((s: string) => <span key={s} className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800 font-semibold">{s}</span>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-400 font-bold uppercase mb-2">Classes</h4>
                      <div className="flex flex-wrap gap-2">
                        {tutor.classes?.map((c: string) => <span key={c} className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800 font-semibold">{c}</span>) || <span className="text-xs text-slate-500">N/A</span>}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-400 font-bold uppercase mb-2">Mediums</h4>
                      <div className="flex flex-wrap gap-2">
                        {tutor.mediums?.map((m: string) => <span key={m} className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800 font-semibold">{m}</span>) || <span className="text-xs text-slate-500">N/A</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "availability" && (
                <div className="card p-6 md:p-8 space-y-6">
                  <h3 className="text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                    📅 Availability Schedule
                  </h3>
                  {tutor.availableSlots && tutor.availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {tutor.availableSlots.map((slot: string) => (
                        <div key={slot} className="px-4 py-3 bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 text-primary-700 dark:text-primary-300 rounded-xl text-xs font-bold text-center">
                          {slot}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No specific availability slots listed.</p>
                  )}
                </div>
              )}

              {activeTab === "faqs" && (
                <div className="card p-6 md:p-8 space-y-6">
                  <h3 className="text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                    ❓ Frequently Asked Questions
                  </h3>
                  {tutor.faqs && (tutor.faqs as any[]).length > 0 ? (
                    <div className="space-y-4">
                      {(tutor.faqs as any[]).map((faq, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs">Q: {faq.question}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No FAQs provided by the tutor yet.</p>
                  )}
                </div>
              )}

            </div>

            {/* Right Widgets Column (4/12 width) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Availability Status Card (Dynamic grouping from availableSlots) */}
              <div className="card p-5 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  📅 Availability Slots
                </h3>

                <div className="space-y-3 text-xs">
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
                        <div key={day} className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {day === "Sat" ? "Saturday" :
                             day === "Sun" ? "Sunday" :
                             day === "Mon" ? "Monday" :
                             day === "Tue" ? "Tuesday" :
                             day === "Wed" ? "Wednesday" :
                             day === "Thu" ? "Thursday" : "Friday"}
                          </span>
                          <span className="text-primary-600 font-medium">{times.join(", ")}</span>
                        </div>
                      ));
                    })()
                  ) : (
                    <p className="text-slate-500">No available slots.</p>
                  )}
                </div>
              </div>

              {/* Education Timeline Card */}
              <div className="card p-5 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  🎓 Education
                </h3>

                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                      🏫
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{qualification}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{institution}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages Card */}
              <div className="card p-5 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  🌐 Languages
                </h3>

                <div className="flex gap-2">
                  {languagesList.map((lang) => (
                    <span key={lang} className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-3 py-1 rounded-xl border border-slate-150 dark:border-slate-800">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
