"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { HiOutlineCurrencyDollar, HiOutlineUserGroup, HiOutlineCalendar, HiOutlineStar } from "react-icons/hi";
import api from "@/lib/api";

export default function TutorDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        api.get("/tutors/profile"),
        api.get("/bookings/tutor"),
      ]);

      if (profileRes.data.success) {
        setProfile(profileRes.data.data);
      }
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, status: "ACCEPTED" | "REJECTED") => {
    setActionLoadingId(bookingId);
    try {
      const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
      if (data.success) {
        // Refresh bookings
        const updatedBookings = bookings.map((b) =>
          b.id === bookingId ? { ...b, status } : b
        );
        setBookings(updatedBookings);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Compute stats
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  // Get unique students count
  const activeStudentsMap = new Map();
  bookings.forEach((b) => {
    if (b.student && (b.status === "ACCEPTED" || b.status === "COMPLETED")) {
      activeStudentsMap.set(b.student.id, b.student);
    }
  });
  const activeStudentsCount = activeStudentsMap.size;

  const upcomingSessionsCount = bookings.filter((b) => b.status === "ACCEPTED" || b.status === "PENDING").length;
  const averageRating = profile?.averageRating || 0;

  const stats = [
    { label: "Total Earnings", value: `৳${totalEarnings.toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" },
    { label: "Active Students", value: String(activeStudentsCount), icon: HiOutlineUserGroup, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
    { label: "Total Bookings", value: String(bookings.length), icon: HiOutlineCalendar, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" },
    { label: "Average Rating", value: averageRating.toFixed(1), icon: HiOutlineStar, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300" },
  ];

  const pendingRequests = bookings.filter((b) => b.status === "PENDING");

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="TUTOR" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Tutor Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Track your earnings, students, and upcoming sessions.</p>

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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Income Charts placeholder */}
                <div className="card">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Income</h2>
                  <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
                      const heights = [40, 65, 45, 80, 55, 90];
                      return (
                        <div key={month} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full max-w-[40px] bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                            style={{ height: `${heights[i]}%` }}
                          />
                          <span className="text-xs text-slate-500 mt-2">{month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pending Requests */}
                <div className="card">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tuition Requests</h2>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {pendingRequests.length === 0 ? (
                      <p className="text-slate-500 text-sm py-4">No pending tuition requests.</p>
                    ) : (
                      pendingRequests.map((req) => (
                        <div key={req.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm">
                            {req.student?.name ? req.student.name.split(" ").map((n: string) => n[0]).join("") : "S"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{req.student?.name}</p>
                            <p className="text-xs text-slate-500 truncate">
                              Type: {req.tuitionType} | Slot: {req.timeSlot} | {new Date(req.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(req.id, "ACCEPTED")}
                              disabled={actionLoadingId === req.id}
                              className="btn-primary text-xs py-1.5 px-3"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                              disabled={actionLoadingId === req.id}
                              className="btn-secondary text-xs py-1.5 px-3"
                            >
                              Reject
                            </button>
                          </div>
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
