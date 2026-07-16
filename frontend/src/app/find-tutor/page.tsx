"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineHeart, HiStar } from "react-icons/hi";
import { SUBJECTS, CLASSES, MEDIUMS, DISTRICTS } from "@shared/types";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

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
      if (filters.gender && filters.gender !== "ALL") queryParams.set("gender", filters.gender);
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title & Search Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Find the Perfect Tutor</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Discover and connect with expert tutors near you.</p>
            </div>

            {/* Top Search bar */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex gap-3 flex-1 max-w-xl">
              <div className="relative flex-1">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by subject, tutor name..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-950 dark:text-white shadow-sm"
                />
              </div>
              <button type="submit" className="btn-primary px-6 py-2.5 font-semibold text-sm flex items-center gap-2 rounded-xl">
                <HiOutlineSearch className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column - Filters (3/12 width) */}
            <div className="lg:col-span-3 space-y-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-bold text-slate-900 dark:text-white text-base">Filters</h2>
                <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                  🔄 Reset
                </button>
              </div>

              {/* Subject Filter */}
              <div className="space-y-2">
                <label className="label text-xs uppercase tracking-wider text-slate-400 font-bold">Subject</label>
                <select 
                  className="input-field py-2 text-xs" 
                  value={filters.subject} 
                  onChange={(e) => handleFilterChange("subject", e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Class/Grade Filter */}
              <div className="space-y-2">
                <label className="label text-xs uppercase tracking-wider text-slate-400 font-bold">Class / Grade</label>
                <select 
                  className="input-field py-2 text-xs" 
                  value={filters.class} 
                  onChange={(e) => handleFilterChange("class", e.target.value)}
                >
                  <option value="">Select Class</option>
                  {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Medium Filter */}
              <div className="space-y-2">
                <label className="label text-xs uppercase tracking-wider text-slate-400 font-bold">Medium</label>
                <select 
                  className="input-field py-2 text-xs" 
                  value={filters.medium} 
                  onChange={(e) => handleFilterChange("medium", e.target.value)}
                >
                  <option value="">Select Medium</option>
                  {MEDIUMS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="label text-xs uppercase tracking-wider text-slate-400 font-bold">Location</label>
                <select 
                  className="input-field py-2 text-xs" 
                  value={filters.location} 
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                >
                  <option value="">Select Location</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Gender Radio buttons */}
              <div className="space-y-2">
                <label className="label text-xs uppercase tracking-wider text-slate-400 font-bold">Gender</label>
                <div className="flex gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="gender" value="ALL" checked={filters.gender === "ALL"} onChange={() => handleFilterChange("gender", "ALL")} className="text-primary-600 focus:ring-primary-500" />
                    All
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="gender" value="Male" checked={filters.gender === "Male"} onChange={() => handleFilterChange("gender", "Male")} className="text-primary-600 focus:ring-primary-500" />
                    Male
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="gender" value="Female" checked={filters.gender === "Female"} onChange={() => handleFilterChange("gender", "Female")} className="text-primary-600 focus:ring-primary-500" />
                    Female
                  </label>
                </div>
              </div>

              {/* Availability checkboxes */}
              <div className="space-y-2">
                <label className="label text-xs uppercase tracking-wider text-slate-400 font-bold">Availability</label>
                <div className="flex flex-col gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.weekdays} onChange={(e) => handleFilterChange("weekdays", e.target.checked)} className="rounded text-primary-600 focus:ring-primary-500" />
                    Weekdays
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.weekends} onChange={(e) => handleFilterChange("weekends", e.target.checked)} className="rounded text-primary-600 focus:ring-primary-500" />
                    Weekends
                  </label>
                </div>
              </div>

              {/* Budget Slider */}
              <div className="space-y-3">
                <label className="label text-xs uppercase tracking-wider text-slate-400 font-bold">Budget (৳/hr)</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.maxBudget}
                  onChange={(e) => handleFilterChange("maxBudget", e.target.value)}
                  className="w-full accent-primary-600"
                />
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400">Min</span>
                    <input type="text" value={`৳ ${filters.minBudget}`} readOnly className="w-full p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold text-slate-700 dark:text-slate-300" />
                  </div>
                  <span className="text-slate-400 mt-4">—</span>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400">Max</span>
                    <input type="text" value={`৳ ${Number(filters.maxBudget).toLocaleString()}${Number(filters.maxBudget) >= 5000 ? "+" : ""}`} readOnly className="w-full p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold text-slate-700 dark:text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Tutor Type checkboxes */}
              <div className="space-y-2">
                <label className="label text-xs uppercase tracking-wider text-slate-400 font-bold">Tutor Type</label>
                <div className="flex flex-col gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.tutorTypeOnline} onChange={(e) => handleFilterChange("tutorTypeOnline", e.target.checked)} className="rounded text-primary-600 focus:ring-primary-500" />
                    Online Tutors
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.tutorTypeHome} onChange={(e) => handleFilterChange("tutorTypeHome", e.target.checked)} className="rounded text-primary-600 focus:ring-primary-500" />
                    Home Tutors
                  </label>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button 
                onClick={fetchTutors} 
                className="w-full py-2.5 border border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 text-primary-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>🎚️</span> Apply Filters
              </button>
            </div>

            {/* Right Column - Results Grid (9/12 width) */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Stats Header */}
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-5 py-3 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-sm">
                <span>Showing {(currentPage - 1) * 12 + 1}-{Math.min(currentPage * 12, totalCount)} of {totalCount} tutors</span>
                
                <div className="flex items-center gap-2">
                  <span>Sort by:</span>
                  <select className="bg-transparent border-none text-slate-800 dark:text-slate-200 focus:ring-0 text-xs font-bold cursor-pointer">
                    <option>Most Relevant</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Loader or Tutors Grid */}
              {loading ? (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-slate-500 mt-4 font-semibold text-sm">Searching for tutors...</p>
                </div>
              ) : tutors.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 text-lg font-bold">No tutors found matching your criteria.</p>
                  <button onClick={clearFilters} className="mt-4 btn-primary text-xs py-2 px-5">Clear Filters</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tutors.map((tutor) => {
                    const tutorRate = tutor.hourlyRate || Math.round((tutor.expectedSalary || 16000) / 32) || 500;
                    return (
                      <div key={tutor.id} className="card p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow relative">
                        
                        {/* Left part: Photo & Bio details */}
                        <div className="flex gap-5 items-start">
                          
                          {/* Image Container with Online green dot */}
                          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold overflow-hidden shadow-sm relative flex-shrink-0">
                            {tutor.photoUrl ? (
                              <img src={tutor.photoUrl} alt={tutor.user?.name} className="w-full h-full object-cover" />
                            ) : (
                              tutor.user?.name ? tutor.user.name.split(" ").map((n: string) => n[0]).join("") : "T"
                            )}
                            {/* Online green indicator */}
                            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          </div>

                          {/* Info block */}
                          <div className="space-y-1">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-1">
                              {tutor.user?.name}
                              <span className="text-blue-500 text-xs" title="Verified Tutor">✓</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{tutor.qualification || "Mathematics Specialist"}</p>
                            
                            <div className="flex items-center gap-1 text-yellow-500 text-xs">
                              <HiStar className="w-4 h-4 fill-current" />
                              <span className="font-bold text-slate-700 dark:text-slate-300">{tutor.averageRating?.toFixed(1) || "4.9"}</span>
                              <span className="text-slate-400 text-[10px]">({tutor.totalReviews || 120} Reviews)</span>
                            </div>

                            <p className="text-xs text-slate-500 font-medium">
                              🎓 {tutor.institution || "BUET"} <span className="text-slate-300 mx-1">|</span> 💼 {tutor.experienceYears}+ Years Experience
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              📚 <span className="font-semibold">Teaches:</span> Class 6 - 12, HSC, Admission
                            </p>

                            {/* Tags list */}
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {tutor.subjects?.slice(0, 3).map((sub: string) => (
                                <span key={sub} className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                  {sub}
                                </span>
                              ))}
                              {tutor.subjects?.length > 3 && (
                                <span className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                  +{tutor.subjects.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* Right part: Price, location & view profile buttons */}
                        <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-end gap-3 self-stretch md:self-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                          
                          {/* Badge tag */}
                          <div className="text-right">
                            <span className="inline-block text-[10px] bg-green-50/50 dark:bg-green-950/20 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-lg border border-green-200/50 dark:border-green-950/50 mb-1">
                              Online & Home Tutor
                            </span>
                            <p className="font-extrabold text-slate-900 dark:text-white text-lg">৳ {tutor.hourlyRate || 500} <span className="text-xs text-slate-400 font-normal">/hr</span></p>
                            <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400">৳ {tutor.expectedSalary?.toLocaleString() || "6,000"} <span className="text-[9px] text-slate-400 font-normal">/month</span></p>
                            <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1.5 mt-0.5">
                              <HiOutlineLocationMarker className="w-3.5 h-3.5 text-slate-400" />
                              {tutor.locationArea || "Dhanmondi"}, {tutor.locationDistrict || "Dhaka"}
                            </p>
                          </div>

                          {/* Action Buttons row */}
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => handleToggleWishlist(tutor.id)}
                              className={`p-2 border rounded-xl transition-all bg-white dark:bg-slate-900 ${
                                wishlistIds.includes(tutor.id)
                                  ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-950/20 fill-current"
                                  : "border-slate-200 dark:border-slate-800 text-slate-400 hover:border-red-500 hover:text-red-500"
                              }`}
                            >
                              <HiOutlineHeart className="w-5 h-5" />
                            </button>
                            <Link href={`/tutors/${tutor.id}`} className="btn-primary text-xs font-bold py-2.5 px-6 rounded-xl">
                              View Profile
                            </Link>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination footer */}
              {!loading && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-1.5 text-xs font-semibold">
                  <button 
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} 
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center disabled:opacity-40" 
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        p === currentPage 
                          ? "bg-primary-600 text-white font-bold" 
                          : "border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} 
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center disabled:opacity-40" 
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    }>
      <FindTutorContent />
    </Suspense>
  );
}
