"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";
import { SUBJECTS, CLASSES, MEDIUMS, DISTRICTS } from "@shared/types";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-400">
            Available Tuition Jobs
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Browse and apply to tuition job postings from students and parents.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full flex-1">
            <HiOutlineSearch className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, subject, description..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={clearFilters}
            className="w-full sm:w-auto px-6 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>⚡</span> Filter Jobs
              </h2>

              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Subject
                  </label>
                  <select
                    value={filters.subject}
                    onChange={(e) => handleFilterChange("subject", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Class / Grade
                  </label>
                  <select
                    value={filters.class}
                    onChange={(e) => handleFilterChange("class", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Medium
                  </label>
                  <select
                    value={filters.medium}
                    onChange={(e) => handleFilterChange("medium", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    District
                  </label>
                  <select
                    value={filters.locationDistrict}
                    onChange={(e) => handleFilterChange("locationDistrict", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi"
                    value={filters.locationArea}
                    onChange={(e) => handleFilterChange("locationArea", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Tuition Type */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Tuition Type
                  </label>
                  <select
                    value={filters.tuitionType}
                    onChange={(e) => handleFilterChange("tuitionType", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Types</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline (Home Tuition)</option>
                  </select>
                </div>

                {/* Gender Preference */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Gender Preference
                  </label>
                  <select
                    value={filters.genderPreference}
                    onChange={(e) => handleFilterChange("genderPreference", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className="animate-pulse bg-white dark:bg-slate-900 h-64 border border-slate-200 dark:border-slate-800 rounded-2xl"
                  ></div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-4xl">🔍</span>
                <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">No Jobs Found</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative group"
                    >
                      {/* Top Info */}
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                              {post.tuitionType === "ONLINE" ? "🌐 Online" : "🏠 Offline"}
                            </span>
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                              👥 {post._count?.applications || 0} Applied
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                          {post.description}
                        </p>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-4 mb-4">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                            <span className="line-clamp-1">
                              {post.locationArea}, {post.locationDistrict}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <HiOutlineCurrencyDollar className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold">{post.salary} BDT/month</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                            <span>{post.daysPerWeek} days/week</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <HiOutlineUser className="w-4 h-4 text-slate-400" />
                            <span>Gender: {post.genderPreference}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">
                            {post.class}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">
                            {post.subject}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">
                            {post.medium}
                          </span>
                        </div>
                      </div>

                      {/* Apply Action */}
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            {post.student?.avatarUrl ? (
                              <img
                                src={post.student.avatarUrl}
                                alt={post.student.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="w-full h-full flex items-center justify-center font-bold text-slate-500 uppercase text-sm">
                                {post.student?.name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {post.student?.name}
                          </span>
                        </div>

                        {post.hasApplied ? (
                          <button
                            disabled
                            className="bg-slate-100 dark:bg-slate-850 text-slate-400 dark:text-slate-500 py-1.5 px-4 text-xs font-semibold rounded-lg cursor-not-allowed border border-slate-200 dark:border-slate-800"
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
                            className="btn-primary py-1.5 px-4 text-xs font-semibold"
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
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-scale-up">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Apply for Tuition</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Posting: <span className="font-semibold">{selectedPost.title}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Expected Salary (BDT/month)
                </label>
                <input
                  type="number"
                  placeholder={`Recommended budget is ${selectedPost.salary} BDT`}
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Cover Letter / Proposal
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain why you are the best fit for this tuition. Mention your experience, qualifications, and teaching methods..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 text-sm leading-relaxed"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-6 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    }>
      <TuitionsContent />
    </Suspense>
  );
}
