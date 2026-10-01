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
    { label: "Total Earnings", value: `৳${totalEarnings.toLocaleString()}`, icon: HiOutlineCurrencyDollar },
    { label: "Active Students", value: String(activeStudentsCount), icon: HiOutlineUserGroup },
    { label: "Total Bookings", value: String(bookings.length), icon: HiOutlineCalendar },
    { label: "Average Rating", value: averageRating.toFixed(1), icon: HiOutlineStar },
  ];

  const pendingRequests = bookings.filter((b) => b.status === "PENDING");

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="TUTOR" />
      <div className="flex-1 p-6 lg:p-12">
        <div className="max-w-6xl">
          <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
            শিক্ষক ড্যাশবোর্ড
          </span>
          <h1 className="font-display text-4xl font-semibold text-ink mb-3">Tutor Dashboard</h1>
          <p className="text-ink-muted mb-12">Track your earnings, students, and upcoming sessions.</p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone border-t-primary-800 mx-auto"></div>
              <p className="text-ink-muted mt-4">Loading dashboard...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta-800 rounded-card text-center mb-8">{error}</div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="stat-card">
                      <span className="stat-icon"><Icon className="w-5 h-5" /></span>
                      <div>
                        <p className="font-display text-2xl font-semibold text-ink">{stat.value}</p>
                        <p className="text-sm text-ink-muted mt-0.5">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Monthly Income Charts placeholder */}
                <div className="card">
                  <h2 className="font-display text-lg font-semibold text-ink mb-6">Monthly Income</h2>
                  <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
                      const heights = [40, 65, 45, 80, 55, 90];
                      return (
                        <div key={month} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full max-w-[40px] bg-primary-800 rounded-t-full transition-colors duration-300 hover:bg-primary-700"
                            style={{ height: `${heights[i]}%` }}
                          />
                          <span className="text-xs text-ink-muted mt-2">{month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pending Requests */}
                <div className="card">
                  <h2 className="font-display text-lg font-semibold text-ink mb-6">Tuition Requests</h2>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {pendingRequests.length === 0 ? (
                      <p className="text-ink-muted text-sm py-4">No pending tuition requests.</p>
                    ) : (
                      pendingRequests.map((req) => (
                        <div key={req.id} className="flex items-center gap-4 p-4 bg-clay-light border border-stone rounded-card">
                          <div className="w-10 h-10 rounded-image bg-clay/40 border border-stone flex items-center justify-center font-display font-semibold text-primary-800 text-sm">
                            {req.student?.name ? req.student.name.split(" ").map((n: string) => n[0]).join("") : "S"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-ink truncate">{req.student?.name}</p>
                            <p className="text-xs text-ink-muted truncate">
                              Type: {req.tuitionType} | Slot: {req.timeSlot} | {new Date(req.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(req.id, "ACCEPTED")}
                              disabled={actionLoadingId === req.id}
                              className="btn-primary text-[10px]"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                              disabled={actionLoadingId === req.id}
                              className="btn-outline text-[10px]"
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
