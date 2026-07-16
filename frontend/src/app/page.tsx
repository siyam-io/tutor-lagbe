"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSearch, HiOutlineArrowRight } from "react-icons/hi";
import { FaBook, FaFlask, FaCalculator, FaAtom, FaGlobe, FaLaptopCode } from "react-icons/fa";
import api from "@/lib/api";

const subjects = [
  { name: "Mathematics", icon: FaCalculator, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
  { name: "Physics", icon: FaAtom, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" },
  { name: "Chemistry", icon: FaFlask, color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" },
  { name: "English", icon: FaGlobe, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" },
  { name: "ICT", icon: FaLaptopCode, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300" },
  { name: "Biology", icon: FaBook, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300" },
];

const features = [
  { icon: "✅", title: "Verified Tutors", desc: "All tutors are verified with academic credentials" },
  { icon: "⚡", title: "Fast Booking", desc: "Book a session in under 2 minutes" },
  { icon: "🔒", title: "Secure Payments", desc: "Your payments are always safe and protected" },
  { icon: "📍", title: "Local Tutors", desc: "Find tutors near your location in Bangladesh" },
];

export default function HomePage() {
  const router = useRouter();
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSubject, setSearchSubject] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const fetchFeaturedTutors = async () => {
      try {
        const { data } = await api.get("/tutors?limit=4");
        if (data.success && data.data) {
          setTutors(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured tutors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedTutors();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchSubject) params.set("subject", searchSubject);
    if (searchLocation) params.set("location", searchLocation);
    router.push(`/find-tutor?${params.toString()}`);
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
                Find the Perfect{" "}
                <span className="text-accent-300">Tutor</span> for Your Child
              </h1>
              <p className="text-xl text-primary-100 mb-4 font-bangla">
                যোগ্য শিক্ষক খুঁজছেন?
              </p>
              <p className="text-lg text-primary-200 mb-10 max-w-xl mx-auto">
                Bangladesh&apos;s most trusted platform to connect with verified
                tutors for home tuition, online classes, and group studies.
              </p>

              {/* Search */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <select 
                  value={searchSubject} 
                  onChange={(e) => setSearchSubject(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:max-w-[160px] [&>option]:text-slate-900"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <select 
                  value={searchLocation} 
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:max-w-[160px] [&>option]:text-slate-900"
                >
                  <option value="">Location</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                </select>
                <button
                  onClick={handleSearch}
                  className="btn-primary bg-white text-primary-700 hover:bg-primary-50 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <HiOutlineSearch className="w-5 h-5" />
                  Search Tutors
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative -mt-10 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "5,000+", label: "Verified Tutors" },
                { value: "50,000+", label: "Happy Students" },
                { value: "64", label: "Districts Covered" },
                { value: "4.8/5", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label} className="card text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600">{stat.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Subjects */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Popular Subjects</h2>
              <p className="section-subtitle">Find expert tutors for your desired subject</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                return (
                  <Link
                    key={subject.name}
                    href={`/find-tutor?subject=${subject.name}`}
                    className="card group hover:border-primary-300 dark:hover:border-primary-700 text-center cursor-pointer hover:-translate-y-1 transition-transform"
                  >
                    <div className={`w-14 h-14 mx-auto rounded-xl ${subject.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">{subject.name}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Tutors */}
        <section className="py-16 sm:py-20 bg-slate-100 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title mb-2">Featured Tutors</h2>
                <p className="section-subtitle mb-0">Meet our top-rated verified tutors</p>
              </div>
              <Link href="/find-tutor" className="btn-outline hidden sm:flex items-center gap-2">
                View All <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-slate-500 mt-2">Loading top tutors...</p>
                </div>
              ) : tutors.length === 0 ? (
                <div className="col-span-full text-center py-10 text-slate-500">
                  No featured tutors found.
                </div>
              ) : (
                tutors.map((tutor) => (
                  <div key={tutor.id} className="card group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {tutor.user?.name ? tutor.user.name.split(" ").map((n: string) => n[0]).join("") : "T"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{tutor.user?.name}</h3>
                        <p className="text-sm text-slate-500">{tutor.institution || "Tutor"}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Subjects:</span>
                        <span className="font-medium text-slate-900 dark:text-white truncate max-w-[150px]" title={tutor.subjects?.join(", ")}>
                          {tutor.subjects?.slice(0, 2).join(", ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span className="font-medium text-yellow-500">⭐ {tutor.averageRating?.toFixed(1) || "New"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salary:</span>
                        <span className="font-medium text-primary-600">৳{tutor.expectedSalary}/mo</span>
                      </div>
                    </div>
                    <Link
                      href={`/tutors/${tutor.id}`}
                      className="btn-primary text-sm w-full mt-4 text-center block"
                    >
                      View Profile
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/find-tutor" className="btn-outline inline-flex items-center gap-2">
                View All Tutors <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Why Choose Tutor Lagbe?</h2>
              <p className="section-subtitle">We make finding the right tutor easy and reliable</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="card text-center hover:-translate-y-1 transition-transform">
                  <span className="text-4xl block mb-4">{feature.icon}</span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Tutor?</h2>
            <p className="text-lg text-primary-100 mb-8">Join thousands of students who have found success with Tutor Lagbe</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/find-tutor" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 text-lg px-8 py-3">
                Find a Tutor
              </Link>
              <Link href="/register" className="btn-outline border-white text-white hover:bg-white/10 text-lg px-8 py-3">
                Become a Tutor
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
