"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { HiOutlineStar, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineAcademicCap, HiOutlineChatAlt, HiCheck, HiOutlineShare, HiOutlineHeart, HiOutlineBriefcase } from "react-icons/hi";
import api from "@/lib/api";

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "teaching" | "availability" | "faqs">("about");
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const rating = tutor.averageRating || 4.9;
  const totalReviews = tutor.totalReviews || 120;
  const hourlyRate = tutor.hourlyRate || Math.round((tutor.expectedSalary || 16000) / 32) || 800;
  const experience = tutor.experienceYears || 5;
  const institution = tutor.institution || "BUET";
  const qualification = tutor.qualification || "Mathematics Specialist";
  const location = tutor.locationDistrict || "Dhaka";
  const area = tutor.locationArea || "Dhanmondi";

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
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all">
                <HiOutlineShare className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all">
                <HiOutlineHeart className="w-4 h-4" /> Save
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
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    🛡️ ID Verified
                  </span>
                  {/* Online Dot */}
                  <span className="absolute top-3 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
              </div>

              {/* Middle Profile Bio Info */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    {name}
                    <span className="text-blue-500 text-lg" title="Verified Tutor">✓</span>
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
                  <span>10K+ Students</span>
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
                    {area}, {location}
                  </span>
                </div>

                {/* Badge Tag */}
                <span className="inline-block text-[10px] bg-green-50/50 dark:bg-green-950/20 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-lg border border-green-200/50 dark:border-green-950/50">
                  Online & Home Tutor
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
                    {subjects.length > 4 && (
                      <span className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-3 py-1 rounded-xl border border-slate-100 dark:border-slate-800">
                        +{subjects.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Booking Call to Action (3/12 width) */}
              <div className="lg:col-span-3 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">৳ {hourlyRate}</span>
                  <span className="text-xs text-slate-400 font-medium"> /hr</span>
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
                    <span>100% Satisfaction</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Link href={`/booking?tutorId=${tutor.id}`} className="w-full btn-primary py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                    <HiOutlineCalendar className="w-4 h-4" /> Book a Session
                  </Link>
                  <button className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <HiOutlineChatAlt className="w-4 h-4" /> Message
                  </button>
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
                        <p className="font-extrabold text-slate-900 dark:text-white text-base mt-1">10K+</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 font-medium">Classes Completed</span>
                        <p className="font-extrabold text-slate-900 dark:text-white text-base mt-1">1,200+</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 font-medium">Response Rate</span>
                        <p className="font-extrabold text-slate-900 dark:text-white text-base mt-1">98%</p>
                      </div>
                    </div>
                  </div>

                  {/* What Students Say Review Slider */}
                  <div className="card p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                        ⭐ What Students Say
                      </h3>
                      <button className="text-xs text-primary-600 hover:text-primary-700 font-bold">View All Reviews</button>
                    </div>

                    <div className="border border-slate-150 dark:border-slate-800 p-5 rounded-2xl bg-white dark:bg-slate-900 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                            NJ
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Nusrat Jahan</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">HSC Student</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-0.5 text-yellow-500 text-xs">
                            {"★★★★★".split("").map((star, idx) => <span key={idx}>{star}</span>)}
                            <span className="font-bold text-slate-700 dark:text-slate-300 ml-1">5.0</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-1">2 weeks ago</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Fahad vaiya explains concepts very clearly. His solving techniques and shortcuts helped me a lot in my exams. Highly recommended!
                      </p>
                    </div>
                  </div>

                  {/* Teaching Approach */}
                  <div className="card p-6 md:p-8 space-y-6">
                    <h3 className="text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                      💡 Teaching Approach
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: "Concept Based Learning", desc: "Focuses on building core principles before problem-solving." },
                        { title: "Problem Solving Techniques", desc: "Easy shortcuts, formulas, and math techniques." },
                        { title: "Regular Assessments", desc: "Weekly quizzes and tests to review learning progress." },
                        { title: "Friendly & Supportive Environment", desc: "Interactive classes with zero hesitation." }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-3.5 p-4 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <span className="text-xl">🎓</span>
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
                <div className="card p-6 md:p-8">
                  <p className="text-xs text-slate-500">Reviews and ratings list loading...</p>
                </div>
              )}

              {activeTab === "teaching" && (
                <div className="card p-6 md:p-8">
                  <p className="text-xs text-slate-500">Teaching curriculum details loading...</p>
                </div>
              )}

              {activeTab === "availability" && (
                <div className="card p-6 md:p-8">
                  <p className="text-xs text-slate-500">Detailed calendar schedule loading...</p>
                </div>
              )}

              {activeTab === "faqs" && (
                <div className="card p-6 md:p-8">
                  <p className="text-xs text-slate-500">Frequently Asked Questions loading...</p>
                </div>
              )}

            </div>

            {/* Right Widgets Column (4/12 width) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Availability Status Card */}
              <div className="card p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    📅 Availability
                  </h3>
                  <button className="text-[10px] text-primary-600 hover:text-primary-700 font-bold">View Calendar</button>
                </div>

                <div className="space-y-3.5 text-xs">
                  {[
                    { day: "Monday", time: "6:00 PM - 10:00 PM", status: "Available" },
                    { day: "Tuesday", time: "6:00 PM - 10:00 PM", status: "Available" },
                    { day: "Wednesday", time: "6:00 PM - 10:00 PM", status: "Available" },
                    { day: "Thursday", time: "6:00 PM - 10:00 PM", status: "Available" },
                    { day: "Friday", time: "6:00 PM - 10:00 PM", status: "Available" },
                    { day: "Saturday", time: "10:00 AM - 8:00 PM", status: "Available" },
                    { day: "Sunday", time: "Not Available", status: "Unavailable" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span className="font-medium">{item.day}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{item.time}</span>
                        <span className={`font-bold ${item.status === "Available" ? "text-green-600" : "text-red-500"}`}>
                          • {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">BSc in Mathematics</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Bangladesh University of Engineering and Technology (BUET)</p>
                      <span className="text-[9px] font-bold text-slate-400 block mt-1">2015 - 2019</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                      🏫
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">HSC - Science</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Notre Dame College, Dhaka</p>
                      <span className="text-[9px] font-bold text-slate-400 block mt-1">2013 - 2015</span>
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
                  {["Bengali (Native)", "English (Fluent)", "Hindi (Basic)"].map((lang) => (
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
