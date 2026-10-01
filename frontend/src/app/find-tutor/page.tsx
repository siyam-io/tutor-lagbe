"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineHeart,
  HiStar,
  HiShieldCheck,
} from "react-icons/hi";
import { SUBJECTS, CLASSES, MEDIUMS, DISTRICTS } from "@shared/types";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import TutorCardSkeleton from "@/components/TutorCardSkeleton";

const initialsOf = (name?: string) =>
  name
    ? name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
    : "T";

function FindTutorContent() {
  const searchParams = useSearchParams();
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuthStore();

  const fetchWishlistIds = async () => {
    if (!isAuthenticated || user?.role !== "STUDENT") return;
    try {
      const { data } = await api.get("/wishlist/ids");
      if (data.success) {
        setWishlistIds(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist ids:", err);
    }
  };

  const handleToggleWishlist = async (tutorId: string) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (user?.role !== "STUDENT") return;
    try {
      const { data } = await api.post(`/wishlist/${tutorId}`);
      if (data.success) {
        if (data.added) {
          setWishlistIds((prev) => [...prev, tutorId]);
        } else {
          setWishlistIds((prev) => prev.filter((id) => id !== tutorId));
        }
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlistIds();
  }, [isAuthenticated, user]);

  // States matching the image filters
  const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState({
    subject: searchParams.get("subject") || "",
    class: searchParams.get("class") || "",
    medium: searchParams.get("medium") || "",
    gender: searchParams.get("gender") || "ALL",
    location: searchParams.get("location") || "",
    minBudget: "0",
    maxBudget: "5000",
    tutorTypeOnline: true,
    tutorTypeHome: true,
    weekdays: true,
    weekends: true,
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      class: "",
      medium: "",
      gender: "ALL",
      location: "",
      minBudget: "0",
      maxBudget: "5000",
      tutorTypeOnline: true,
      tutorTypeHome: true,
      weekdays: true,
      weekends: true,
    });
    setSearchVal("");
    setCurrentPage(1);
  };

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.subject) queryParams.set("subject", filters.subject);
      if (filters.class) queryParams.set("class", filters.class);
      if (filters.medium) queryParams.set("medium", filters.medium);
      if (filters.gender && filters.gender !== "ALL")
        queryParams.set("gender", filters.gender);
      if (filters.location) queryParams.set("locationDistrict", filters.location);
      if (filters.minBudget) queryParams.set("minBudget", filters.minBudget);
      if (filters.maxBudget) queryParams.set("maxBudget", filters.maxBudget);
      if (searchVal) queryParams.set("search", searchVal);
      queryParams.set("page", String(currentPage));
      queryParams.set("limit", "12");

      const { data } = await api.get(`/tutors?${queryParams.toString()}`);
      if (data.success) {
        setTutors(data.data || []);
        // Mock larger pagination details if needed, else pull from API
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || data.data?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, [currentPage, filters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTutors();
  };

  const filterLabel =
    "label text-[11px] uppercase tracking-wider text-ink-muted font-medium";
  const checkControl =
    "accent-primary-800 w-4 h-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

  return (
    <>
      <Navbar />
      <main className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title & Search Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-14">
            <div>
              <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                টিউটর খুঁজুন
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-ink leading-tight">
                Find the <em className="italic text-primary-700">Perfect</em>{" "}
                Tutor
              </h1>
              <p className="text-ink-muted mt-3">
                Discover and connect with expert tutors near you.
              </p>
            </div>

            {/* Top Search bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full md:w-auto flex gap-3 flex-1 max-w-xl"
            >
              <div className="relative flex-1">
                <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Search by subject, tutor name..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
              <button type="submit" className="btn-primary px-6 text-xs">
                <HiOutlineSearch className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column - Filters (3/12 width) */}
            <aside className="lg:col-span-3 lg:sticky lg:top-24 self-start card p-6 space-y-7 hover:translate-y-0 hover:shadow-soft">
              <div className="flex justify-between items-center pb-4 border-b border-stone">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-700 hover:text-primary-800 font-medium flex items-center gap-1 transition-colors duration-300"
                >
                  🔄 Reset
                </button>
              </div>

              {/* Subject Filter */}
              <div className="space-y-2">
                <label className={filterLabel}>Subject</label>
                <select
                  className="input-field py-2.5 text-sm"
                  value={filters.subject}
                  onChange={(e) => handleFilterChange("subject", e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class/Grade Filter */}
              <div className="space-y-2">
                <label className={filterLabel}>Class / Grade</label>
                <select
                  className="input-field py-2.5 text-sm"
                  value={filters.class}
                  onChange={(e) => handleFilterChange("class", e.target.value)}
                >
                  <option value="">Select Class</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Medium Filter */}
              <div className="space-y-2">
                <label className={filterLabel}>Medium</label>
                <select
                  className="input-field py-2.5 text-sm"
                  value={filters.medium}
                  onChange={(e) => handleFilterChange("medium", e.target.value)}
                >
                  <option value="">Select Medium</option>
                  {MEDIUMS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className={filterLabel}>Location</label>
                <select
                  className="input-field py-2.5 text-sm"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                >
                  <option value="">Select Location</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Radio buttons */}
              <div className="space-y-2">
                <label className={filterLabel}>Gender</label>
                <div className="flex gap-4 text-xs font-medium text-ink-muted">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="ALL"
                      checked={filters.gender === "ALL"}
                      onChange={() => handleFilterChange("gender", "ALL")}
                      className={checkControl}
                    />
                    All
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={filters.gender === "Male"}
                      onChange={() => handleFilterChange("gender", "Male")}
                      className={checkControl}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={filters.gender === "Female"}
                      onChange={() => handleFilterChange("gender", "Female")}
                      className={checkControl}
                    />
                    Female
                  </label>
                </div>
              </div>

              {/* Availability checkboxes */}
              <div className="space-y-2">
                <label className={filterLabel}>Availability</label>
                <div className="flex flex-col gap-2 text-xs font-medium text-ink-muted">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.weekdays}
                      onChange={(e) =>
                        handleFilterChange("weekdays", e.target.checked)
                      }
                      className={`rounded-full ${checkControl}`}
                    />
                    Weekdays
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.weekends}
                      onChange={(e) =>
                        handleFilterChange("weekends", e.target.checked)
                      }
                      className={`rounded-full ${checkControl}`}
                    />
                    Weekends
                  </label>
                </div>
              </div>

              {/* Budget Slider */}
              <div className="space-y-3">
                <label className={filterLabel}>Budget (৳/hr)</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.maxBudget}
                  onChange={(e) =>
                    handleFilterChange("maxBudget", e.target.value)
                  }
                  className="w-full accent-primary-800"
                />
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex-1">
                    <span className="text-[10px] text-ink-muted">Min</span>
                    <input
                      type="text"
                      value={`৳ ${filters.minBudget}`}
                      readOnly
                      className="w-full px-2 py-2 rounded-full bg-clay-light border border-stone text-center font-semibold text-ink text-xs"
                    />
                  </div>
                  <span className="text-ink-muted mt-4">—</span>
                  <div className="flex-1">
                    <span className="text-[10px] text-ink-muted">Max</span>
                    <input
                      type="text"
                      value={`৳ ${Number(filters.maxBudget).toLocaleString()}${
                        Number(filters.maxBudget) >= 5000 ? "+" : ""
                      }`}
                      readOnly
                      className="w-full px-2 py-2 rounded-full bg-clay-light border border-stone text-center font-semibold text-ink text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Tutor Type checkboxes */}
              <div className="space-y-2">
                <label className={filterLabel}>Tutor Type</label>
                <div className="flex flex-col gap-2 text-xs font-medium text-ink-muted">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tutorTypeOnline}
                      onChange={(e) =>
                        handleFilterChange("tutorTypeOnline", e.target.checked)
                      }
                      className={`rounded-full ${checkControl}`}
                    />
                    Online Tutors
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tutorTypeHome}
                      onChange={(e) =>
                        handleFilterChange("tutorTypeHome", e.target.checked)
                      }
                      className={`rounded-full ${checkControl}`}
                    />
                    Home Tutors
                  </label>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={fetchTutors}
                className="btn-secondary w-full text-xs"
              >
                <span>🎚️</span> Apply Filters
              </button>
            </aside>

            {/* Right Column - Results (9/12 width) */}
            <div className="lg:col-span-9 space-y-8">
              {/* Stats Header */}
              <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-ink-muted bg-white border border-stone rounded-full px-6 py-3 shadow-soft">
                <span>
                  Showing {(currentPage - 1) * 12 + 1}-
                  {Math.min(currentPage * 12, totalCount)} of {totalCount} tutors
                </span>

                <div className="flex items-center gap-2">
                  <span>Sort by:</span>
                  <select className="bg-transparent text-ink font-medium text-xs cursor-pointer focus:outline-none">
                    <option>Most Relevant</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Loader or Tutors List */}
              {loading ? (
                <div className="space-y-6">
                  <TutorCardSkeleton count={4} />
                </div>
              ) : tutors.length === 0 ? (
                <div className="text-center py-20 px-6 card border-dashed hover:translate-y-0 hover:shadow-soft">
                  <span className="text-4xl block mb-4">🔍</span>
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    আপনার সার্চ অনুযায়ী কোনো শিক্ষক পাওয়া যায়নি
                  </h3>
                  <p className="text-ink-muted text-sm max-w-md mx-auto mt-3 leading-relaxed">
                    চিন্তার কারণ নেই! মাত্র ১ মিনিটে আপনার টিউশন রিকুয়েস্ট পোস্ট
                    করুন, সেরা শিক্ষকরা সরাসরি আপনার সাথে যোগাযোগ করবেন।
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    <button
                      onClick={clearFilters}
                      className="btn-outline text-xs"
                    >
                      ফিল্টার রিসেট করুন
                    </button>
                    <Link href="/tuitions" className="btn-primary text-xs">
                      ফ্রি টিউশন পোস্ট দিন &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {tutors.map((tutor) => (
                    <div
                      key={tutor.id}
                      className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                      {/* Left part: Photo & Bio details */}
                      <div className="flex gap-5 items-start">
                        {/* Photo in a soft-radius frame (falls back to initials) */}
                        <div className="relative flex-shrink-0">
                          {tutor.photoUrl ? (
                            <img
                              src={tutor.photoUrl}
                              alt={tutor.user?.name || "Tutor"}
                              className="w-20 h-20 rounded-image object-cover border border-stone"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-image bg-clay/40 border border-stone flex items-center justify-center font-display text-xl font-semibold text-primary-800">
                              {initialsOf(tutor.user?.name)}
                            </div>
                          )}
                          {/* Online indicator */}
                          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-bangla-green border-2 border-white rounded-full" />
                        </div>

                        {/* Info block */}
                        <div className="space-y-2">
                          <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2 flex-wrap">
                            <span>{tutor.user?.name}</span>
                            <span
                              className="badge-verified text-[10px] py-0.5 px-2"
                              title="NID & Academic Verified"
                            >
                              <HiShieldCheck className="w-3 h-3" />
                              ভেরিফাইড
                            </span>
                          </h3>
                          <p className="text-sm text-ink-muted">
                            {tutor.qualification || "Mathematics Specialist"}
                          </p>

                          <div className="flex items-center gap-1.5 text-xs">
                            <HiStar className="w-4 h-4 text-terracotta-700" />
                            <span className="font-semibold text-ink">
                              {tutor.averageRating?.toFixed(1) || "4.9"}
                            </span>
                            <span className="text-ink-muted text-[10px]">
                              ({tutor.totalReviews || 120} Reviews)
                            </span>
                          </div>

                          <p className="text-xs text-ink-muted">
                            🎓 {tutor.institution || "BUET"}{" "}
                            <span className="text-stone mx-1">|</span> 💼{" "}
                            {tutor.experienceYears}+ Years Experience
                          </p>
                          <p className="text-xs text-ink-muted">
                            📚{" "}
                            <span className="font-medium text-ink">Teaches:</span>{" "}
                            Class 6 - 12, HSC, Admission
                          </p>

                          {/* Tags list */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {tutor.subjects?.slice(0, 3).map((sub: string) => (
                              <span key={sub} className="badge">
                                {sub}
                              </span>
                            ))}
                            {tutor.subjects?.length > 3 && (
                              <span className="badge">
                                +{tutor.subjects.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right part: Price, location & actions */}
                      <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-end gap-4 self-stretch md:self-auto border-t md:border-t-0 border-stone pt-5 md:pt-0">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end mb-2">
                            <span className="badge-guarantee text-[10px] py-0.5 px-2">
                              ফ্রি ডেমো ক্লাস
                            </span>
                            <span className="badge-success text-[10px] py-0.5 px-2">
                              অনলাইন ও হোম
                            </span>
                          </div>
                          <p className="font-display text-2xl font-semibold text-ink">
                            ৳ {tutor.hourlyRate || 500}{" "}
                            <span className="text-xs text-ink-muted font-normal">
                              /hr
                            </span>
                          </p>
                          <p className="text-[11px] font-medium text-primary-800 mt-0.5">
                            ৳ {tutor.expectedSalary?.toLocaleString() || "6,000"}{" "}
                            <span className="text-[9px] text-ink-muted font-normal">
                              /month
                            </span>
                          </p>
                          <p className="text-[11px] text-ink-muted flex items-center justify-end gap-1.5 mt-1">
                            <HiOutlineLocationMarker className="w-3.5 h-3.5 text-sage-700" />
                            {tutor.locationArea || "Dhanmondi"},{" "}
                            {tutor.locationDistrict || "Dhaka"}
                          </p>
                        </div>

                        {/* Action Buttons row */}
                        <div className="flex gap-3 items-center">
                          <button
                            onClick={() => handleToggleWishlist(tutor.id)}
                            aria-label="Add to wishlist"
                            className={`p-3 rounded-full border bg-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                              wishlistIds.includes(tutor.id)
                                ? "border-terracotta-700 text-terracotta-700 bg-terracotta/10"
                                : "border-stone text-ink-muted hover:border-terracotta-700 hover:text-terracotta-700"
                            }`}
                          >
                            <HiOutlineHeart className="w-5 h-5" />
                          </button>
                          <Link
                            href={`/tutors/${tutor.id}`}
                            className="btn-primary text-xs whitespace-nowrap"
                          >
                            প্রোফাইল ও বুকিং &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination footer */}
              {!loading && totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2 text-xs font-medium">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="w-10 h-10 rounded-full border border-stone text-ink-muted flex items-center justify-center disabled:opacity-40 hover:border-sage hover:text-primary-800 transition-colors duration-300"
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          p === currentPage
                            ? "bg-primary-800 text-white font-semibold"
                            : "border border-stone text-ink-muted hover:border-sage hover:text-primary-800"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    className="w-10 h-10 rounded-full border border-stone text-ink-muted flex items-center justify-center disabled:opacity-40 hover:border-sage hover:text-primary-800 transition-colors duration-300"
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function FindTutorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-canvas">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-stone border-t-primary-800" />
        </div>
      }
    >
      <FindTutorContent />
    </Suspense>
  );
}
