"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { HiOutlineBookOpen, HiOutlineCurrencyDollar, HiOutlineUserGroup, HiOutlineStar } from "react-icons/hi";
import api from "@/lib/api";

export default function StudentDashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get("/bookings/student");
        if (data.success && data.data) {
          setBookings(data.data);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Compute metrics dynamically
  const upcomingClasses = bookings.filter((b) => b.status === "ACCEPTED" || b.status === "PENDING");
  const completedClasses = bookings.filter((b) => b.status === "COMPLETED");
  
  // Get unique tutor profiles
  const uniqueTutorsMap = new Map();
  bookings.forEach((b) => {
    if (b.tutor) {
      uniqueTutorsMap.set(b.tutor.id, b.tutor);
    }
  });
  const activeTutorsCount = uniqueTutorsMap.size;

  const totalSpent = completedClasses.reduce((sum, b) => sum + (b.amount || 0), 0);

  const stats = [
    { label: "Pending/Accepted Bookings", value: String(upcomingClasses.length), icon: HiOutlineBookOpen, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
    { label: "Active Tutors", value: String(activeTutorsCount), icon: HiOutlineUserGroup, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" },
    { label: "Total Spent", value: `৳${totalSpent.toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" },
    { label: "Completed Classes", value: String(completedClasses.length), icon: HiOutlineStar, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="STUDENT" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Student Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Welcome back! Here&apos;s your learning overview.</p>

          {/* Loading / Error States */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-slate-500 mt-2">Loading dashboard...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center mb-8">{error}</div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="stat-card">
                      <div className={`stat-icon ${stat.color}`}><Icon /></div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upcoming Classes + Recent Tutors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <HiOutlineBookOpen className="w-5 h-5 text-primary-600" /> Bookings List
                  </h2>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {bookings.length === 0 ? (
                      <p className="text-slate-500 text-sm py-4">No bookings found. Try finding a tutor!</p>
                    ) : (
                      bookings.map((cls) => (
                        <div key={cls.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 font-bold text-sm">
                            {cls.tutor?.subjects?.[0]?.[0] || "T"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                              {cls.tutor?.subjects?.slice(0, 2).join(", ") || "Tuition"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              Tutor: {cls.tutor?.user?.name || "N/A"} | {new Date(cls.date).toLocaleDateString()} at {cls.timeSlot}
                            </p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            cls.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                            cls.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                            cls.status === "REJECTED" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {cls.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <HiOutlineUserGroup className="w-5 h-5 text-primary-600" /> Active Tutors
                  </h2>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {Array.from(uniqueTutorsMap.values()).length === 0 ? (
                      <p className="text-slate-500 text-sm py-4">No active tutors yet.</p>
                    ) : (
                      Array.from(uniqueTutorsMap.values()).map((tutorObj: any) => (
                        <div key={tutorObj.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                            {tutorObj.user?.name ? tutorObj.user.name.split(" ").map((n: string) => n[0]).join("") : "T"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{tutorObj.user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">
                              {tutorObj.subjects?.slice(0, 2).join(", ")} | ⭐ {tutorObj.averageRating?.toFixed(1) || "New"}
                            </p>
                          </div>
                          <Link href={`/tutors/${tutorObj.id}`} className="text-xs text-primary-600 font-medium hover:underline">Profile</Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
