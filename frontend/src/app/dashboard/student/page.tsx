"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import {
  HiOutlineBookOpen,
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
  HiOutlineStar,
} from "react-icons/hi";
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
  const upcomingClasses = bookings.filter(
    (b) => b.status === "ACCEPTED" || b.status === "PENDING"
  );
  const completedClasses = bookings.filter((b) => b.status === "COMPLETED");

  // Get unique tutor profiles
  const uniqueTutorsMap = new Map();
  bookings.forEach((b) => {
    if (b.tutor) {
      uniqueTutorsMap.set(b.tutor.id, b.tutor);
    }
  });
  const activeTutorsCount = uniqueTutorsMap.size;

  const totalSpent = completedClasses.reduce(
    (sum, b) => sum + (b.amount || 0),
    0
  );

  const stats = [
    {
      label: "Pending/Accepted Bookings",
      value: String(upcomingClasses.length),
      icon: HiOutlineBookOpen,
    },
    {
      label: "Active Tutors",
      value: String(activeTutorsCount),
      icon: HiOutlineUserGroup,
    },
    {
      label: "Total Spent",
      value: `৳${totalSpent.toLocaleString()}`,
      icon: HiOutlineCurrencyDollar,
    },
    {
      label: "Completed Classes",
      value: String(completedClasses.length),
      icon: HiOutlineStar,
    },
  ];

  const statusClass = (status: string) =>
    status === "ACCEPTED"
      ? "badge-success"
      : status === "COMPLETED"
      ? "badge-primary"
      : status === "REJECTED"
      ? "badge-danger"
      : "badge-warning";

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="STUDENT" />
      <div className="flex-1 p-6 lg:p-12">
        <div className="max-w-6xl">
          <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
            শিক্ষার্থী ড্যাশবোর্ড
          </span>
          <h1 className="font-display text-4xl font-semibold text-ink mb-3">
            Student Dashboard
          </h1>
          <p className="text-ink-muted mb-12">
            Welcome back! Here&apos;s your learning overview.
          </p>

          {/* Loading / Error States */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone border-t-primary-800 mx-auto" />
              <p className="text-ink-muted mt-4">Loading dashboard...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta-800 rounded-card text-center mb-10">
              {error}
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="stat-card">
                      <span className="stat-icon">
                        <Icon className="w-5 h-5" />
                      </span>
                      <div>
                        <p className="font-display text-2xl font-semibold text-ink">
                          {stat.value}
                        </p>
                        <p className="text-sm text-ink-muted mt-0.5">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bookings + Active Tutors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="card p-8 hover:translate-y-0">
                  <h2 className="font-display text-lg font-semibold text-ink mb-6 flex items-center gap-2">
                    <HiOutlineBookOpen className="w-5 h-5 text-sage-700" />{" "}
                    Bookings List
                  </h2>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                    {bookings.length === 0 ? (
                      <p className="text-ink-muted text-sm py-4">
                        No bookings found. Try finding a tutor!
                      </p>
                    ) : (
                      bookings.map((cls) => (
                        <div
                          key={cls.id}
                          className="flex items-center gap-4 p-3.5 bg-clay-light border border-stone rounded-card"
                        >
                          <div className="w-10 h-10 rounded-full bg-clay/50 border border-stone flex items-center justify-center font-display font-semibold text-primary-800 text-sm flex-shrink-0">
                            {cls.tutor?.subjects?.[0]?.[0] || "T"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-ink truncate">
                              {cls.tutor?.subjects?.slice(0, 2).join(", ") ||
                                "Tuition"}
                            </p>
                            <p className="text-xs text-ink-muted truncate mt-0.5">
                              Tutor: {cls.tutor?.user?.name || "N/A"} |{" "}
                              {new Date(cls.date).toLocaleDateString()} at{" "}
                              {cls.timeSlot}
                            </p>
                          </div>
                          <span className={statusClass(cls.status)}>
                            {cls.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="card p-8 hover:translate-y-0">
                  <h2 className="font-display text-lg font-semibold text-ink mb-6 flex items-center gap-2">
                    <HiOutlineUserGroup className="w-5 h-5 text-sage-700" />{" "}
                    Active Tutors
                  </h2>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                    {Array.from(uniqueTutorsMap.values()).length === 0 ? (
                      <p className="text-ink-muted text-sm py-4">
                        No active tutors yet.
                      </p>
                    ) : (
                      Array.from(uniqueTutorsMap.values()).map(
                        (tutorObj: any) => (
                          <div
                            key={tutorObj.id}
                            className="flex items-center gap-4 p-3.5 bg-clay-light border border-stone rounded-card"
                          >
                            <div className="w-10 h-10 rounded-full bg-clay/50 border border-stone flex items-center justify-center font-display font-semibold text-primary-800 text-sm flex-shrink-0">
                              {tutorObj.user?.name
                                ? tutorObj.user.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                : "T"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-ink truncate">
                                {tutorObj.user?.name}
                              </p>
                              <p className="text-xs text-ink-muted truncate mt-0.5">
                                {tutorObj.subjects?.slice(0, 2).join(", ")} | ⭐{" "}
                                {tutorObj.averageRating?.toFixed(1) || "New"}
                              </p>
                            </div>
                            <Link
                              href={`/tutors/${tutorObj.id}`}
                              className="text-xs text-primary-700 font-medium hover:text-primary-800 transition-colors duration-300"
                            >
                              Profile
                            </Link>
                          </div>
                        )
                      )
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
