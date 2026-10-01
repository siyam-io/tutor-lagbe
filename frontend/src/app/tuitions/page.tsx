"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineCalendar, HiOutlineUser, HiShieldCheck } from "react-icons/hi";
import { SUBJECTS, CLASSES, MEDIUMS, DISTRICTS } from "@shared/types";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import toast from "react-hot-toast";
import JsonLd from "@/components/JsonLd";

function TuitionsContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isAuthenticated } = useAuthStore();

  // Filter States
  const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState({
    subject: searchParams.get("subject") || "",
    class: searchParams.get("class") || "",
    medium: searchParams.get("medium") || "",
    genderPreference: "ALL",
    locationDistrict: searchParams.get("district") || "",
    locationArea: "",
    tuitionType: "",
  });

  // Apply Modal State
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      class: "",
      medium: "",
      genderPreference: "ALL",
      locationDistrict: "",
      locationArea: "",
      tuitionType: "",
    });
    setSearchVal("");
    setCurrentPage(1);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchVal) params.append("search", searchVal);
      if (filters.subject) params.append("subject", filters.subject);
      if (filters.class) params.append("class", filters.class);
      if (filters.medium) params.append("medium", filters.medium);
      if (filters.genderPreference !== "ALL") params.append("genderPreference", filters.genderPreference);
      if (filters.locationDistrict) params.append("locationDistrict", filters.locationDistrict);
      if (filters.locationArea) params.append("locationArea", filters.locationArea);
      if (filters.tuitionType) params.append("tuitionType", filters.tuitionType);
      params.append("page", currentPage.toString());
      params.append("limit", "6");

      const { data } = await api.get(`/tuitions?${params.toString()}`);
      if (data.success) {
        setPosts(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch tuition posts:", err);
      toast.error("Failed to load tuition posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, filters, searchVal]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to apply");
      window.location.href = "/login?redirect=/tuitions";
      return;
    }
    if (user?.role !== "TUTOR") {
      toast.error("Only tutors can apply for tuition jobs!");
      return;
    }
    if (!coverLetter || !expectedSalary) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post(`/tuitions/${selectedPost.id}/apply`, {
        coverLetter,
        expectedSalary: Number(expectedSalary),
      });

      if (data.success) {
        toast.success("Successfully applied!");
        setSelectedPost(null);
        setCoverLetter("");
        setExpectedSalary("");
        fetchPosts(); // Refresh count
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header Section */}
        <div className="mb-12 text-center sm:text-left">
          <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
            টিউশন জব বোর্ড
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-ink">
            Available <em className="italic text-primary-700">Tuition Jobs</em>
          </h1>
          <p className="mt-3 text-ink-muted">
            Browse and apply to tuition job postings from students and parents.
          </p>
        </div>

        {/* Search Bar */}
        <div className="card p-4 mb-10 flex flex-col sm:flex-row gap-4 items-center hover:translate-y-0 hover:shadow-soft">
          <div className="relative w-full flex-1">
            <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, subject, description..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <button
            onClick={clearFilters}
            className="btn-outline w-full sm:w-auto text-xs"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6 hover:translate-y-0 hover:shadow-soft">
              <h2 className="font-display text-lg font-semibold text-ink mb-6 flex items-center gap-2">
                <span>⚡</span> Filter Jobs
              </h2>

              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="label text-[11px] uppercase tracking-wider text-ink-muted font-medium">
                    Subject
                  </label>
                  <select
                    value={filters.subject}
                    onChange={(e) => handleFilterChange("subject", e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">All Subjects</option>
                    {SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label className="label text-[11px] uppercase tracking-wider text-ink-muted font-medium">
                    Class / Grade
                  </label>
                  <select
                    value={filters.class}
                    onChange={(e) => handleFilterChange("class", e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">All Classes</option>
                    {CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medium */}
                <div>
                  <label className="label text-[11px] uppercase tracking-wider text-ink-muted font-medium">
                    Medium
                  </label>
                  <select
                    value={filters.medium}
                    onChange={(e) => handleFilterChange("medium", e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">All Mediums</option>
                    {MEDIUMS.map((med) => (
                      <option key={med} value={med}>
                        {med}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="label text-[11px] uppercase tracking-wider text-ink-muted font-medium">
                    District
                  </label>
                  <select
                    value={filters.locationDistrict}
                    onChange={(e) => handleFilterChange("locationDistrict", e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">All Districts</option>
                    {DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="label text-[11px] uppercase tracking-wider text-ink-muted font-medium">
                    Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi"
                    value={filters.locationArea}
                    onChange={(e) => handleFilterChange("locationArea", e.target.value)}
                    className="input-field py-2.5 text-sm"
                  />
                </div>

                {/* Tuition Type */}
                <div>
                  <label className="label text-[11px] uppercase tracking-wider text-ink-muted font-medium">
                    Tuition Type
                  </label>
                  <select
                    value={filters.tuitionType}
                    onChange={(e) => handleFilterChange("tuitionType", e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline (Home Tuition)</option>
                  </select>
                </div>

                {/* Gender Preference */}
                <div>
                  <label className="label text-[11px] uppercase tracking-wider text-ink-muted font-medium">
                    Gender Preference
                  </label>
                  <select
                    value={filters.genderPreference}
                    onChange={(e) => handleFilterChange("genderPreference", e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="ALL">Any Gender</option>
                    <option value="MALE">Male Tutor</option>
                    <option value="FEMALE">Female Tutor</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings Feed */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="card relative overflow-hidden h-64 p-6 space-y-4 animate-pulse hover:translate-y-0"
                  >
                    <div className="absolute inset-0 shimmer pointer-events-none" />
                    <div className="flex justify-between">
                      <div className="h-5 bg-clay/40 rounded w-28" />
                      <div className="h-4 bg-clay/40 rounded w-20" />
                    </div>
                    <div className="h-6 bg-clay/40 rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-3.5 bg-clay/40 rounded w-full" />
                      <div className="h-3.5 bg-clay/40 rounded w-5/6" />
                    </div>
                    <div className="h-10 bg-clay/40 rounded-xl mt-6" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="card text-center py-20 hover:translate-y-0">
                <span className="text-4xl block mb-2">🔍</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">কোনো টিউশন জব পাওয়া যায়নি</h3>
                <p className="mt-3 text-ink-muted text-sm">অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা নতুন পোস্টের জন্য অপেক্ষা করুন।</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="card p-6 flex flex-col justify-between relative group"
                    >
                      {/* Top Info */}
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="badge-primary">
                              {post.tuitionType === "ONLINE" ? "🌐 অনলাইন" : "🏠 অফলাইন/হোম"}
                            </span>
                            <span className="badge-verified">
                              <HiShieldCheck className="w-3.5 h-3.5 text-sage-700" />
                              ভেরিফাইড
                            </span>
                            <span className="badge">
                              👥 {post._count?.applications || 0} আবেদন
                            </span>
                          </div>
                          <span className="text-xs text-ink-muted">
                            {new Date(post.createdAt).toLocaleDateString("bn-BD")}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-semibold text-ink line-clamp-1 mb-2.5 group-hover:text-primary-800 transition-colors duration-300">
                          {post.title}
                        </h3>
                        <p className="text-sm text-ink-muted line-clamp-3 mb-5 leading-relaxed">
                          {post.description}
                        </p>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-t border-stone pt-5 mb-5">
                          <div className="flex items-center gap-2 text-ink-muted">
                            <HiOutlineLocationMarker className="w-4 h-4 text-sage-700" />
                            <span className="line-clamp-1">
                              {post.locationArea}, {post.locationDistrict}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-ink-muted">
                            <HiOutlineCurrencyDollar className="w-4 h-4 text-sage-700" />
                            <span className="font-semibold">{post.salary} BDT/month</span>
                          </div>
                          <div className="flex items-center gap-2 text-ink-muted">
                            <HiOutlineCalendar className="w-4 h-4 text-sage-700" />
                            <span>{post.daysPerWeek} days/week</span>
                          </div>
                          <div className="flex items-center gap-2 text-ink-muted">
                            <HiOutlineUser className="w-4 h-4 text-sage-700" />
                            <span>Gender: {post.genderPreference}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <span className="badge">
                            {post.class}
                          </span>
                          <span className="badge">
                            {post.subject}
                          </span>
                          <span className="badge">
                            {post.medium}
                          </span>
                        </div>
                      </div>

                      {/* Apply Action */}
                      <div className="flex items-center justify-between border-t border-stone pt-5 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-clay/40 border border-stone overflow-hidden">
                            {post.student?.avatarUrl ? (
                              <img
                                src={post.student.avatarUrl}
                                alt={post.student.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="w-full h-full flex items-center justify-center font-display font-semibold text-primary-800 uppercase text-sm">
                                {post.student?.name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-medium text-ink">
                            {post.student?.name}
                          </span>
                        </div>

                        {post.hasApplied ? (
                          <button
                            disabled
                            className="bg-clay-light text-ink-muted py-2 px-5 text-xs font-medium rounded-full cursor-not-allowed border border-stone"
                          >
                            Applied
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                toast.error("Please login to apply");
                                window.location.href = `/login?redirect=/tuitions`;
                                return;
                              }
                              if (user?.role !== "TUTOR") {
                                toast.error("Only Tutors can apply to tuition jobs!");
                                return;
                              }
                              setSelectedPost(post);
                            }}
                            className="btn-primary py-2 px-5 text-[11px]"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-6">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-5 py-2.5 border border-stone text-ink-muted rounded-full disabled:opacity-50 hover:border-sage hover:text-primary-800 transition-colors duration-300"
                    >
                      Prev
                    </button>
                    <span className="px-4 py-2 text-ink-muted">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-5 py-2.5 border border-stone text-ink-muted rounded-full disabled:opacity-50 hover:border-sage hover:text-primary-800 transition-colors duration-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-stone rounded-card p-8 w-full max-w-lg shadow-soft-xl animate-fade-up">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-ink">Apply for Tuition</h3>
                <p className="text-xs text-ink-muted mt-1">
                  Posting: <span className="font-semibold">{selectedPost.title}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-full text-ink-muted hover:bg-clay-light transition-colors duration-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="label">
                  Expected Salary (BDT/month)
                </label>
                <input
                  type="number"
                  placeholder={`Recommended budget is ${selectedPost.salary} BDT`}
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">
                  Cover Letter / Proposal
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain why you are the best fit for this tuition. Mention your experience, qualifications, and teaching methods..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="input-field text-sm leading-relaxed"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs"
                >
                  {submitting ? "Sending..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function TuitionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone border-t-primary-800"></div>
      </div>
    }>
      <TuitionsContent />
    </Suspense>
  );
}
