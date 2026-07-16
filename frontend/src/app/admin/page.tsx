"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineShieldCheck, HiOutlineClipboardList } from "react-icons/hi";
import api from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [pendingTutors, setPendingTutors] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.get("/admin/stats");
      if (statsRes.data.success) {
        const payload = statsRes.data.data;
        setStats(payload);
        setPendingTutors(payload.pendingTutorsList || []);
        setRecentBookings(payload.recentBookings || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (tutorId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoadingId(tutorId);
    try {
      const { data } = await api.patch(`/admin/verify-tutor/${tutorId}`, { status });
      if (data.success) {
        setPendingTutors((prev) => prev.filter((t) => t.id !== tutorId));
        // Refresh stats
        const statsRes = await api.get("/admin/stats");
        if (statsRes.data.success) setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error("Failed to verify tutor:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const statItems = [
    { label: "Total Users", value: stats ? String(stats.totalUsers) : "0", icon: HiOutlineUserGroup, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
    { label: "Active Tutors", value: stats ? String(stats.totalTutors) : "0", icon: HiOutlineShieldCheck, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" },
    { label: "Revenue", value: stats ? `৳${stats.revenue.toLocaleString()}` : "৳0", icon: HiOutlineCurrencyDollar, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" },
    { label: "Pending Verifications", value: stats ? String(stats.pendingTutors) : "0", icon: HiOutlineClipboardList, color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="ADMIN" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Platform overview and management</p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-slate-500 mt-2">Loading admin console...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center mb-8">{error}</div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {statItems.map((stat) => {
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

              {/* Verification Queue */}
              <div className="card mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Pending Tutor Verification</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Subjects</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Documents</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingTutors.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500">No tutors waiting for verification.</td>
                        </tr>
                      ) : (
                        pendingTutors.map((tutor) => (
                          <tr key={tutor.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{tutor.user?.name}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{tutor.user?.email}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{tutor.subjects?.join(", ")}</td>
                            <td className="py-3 px-4">
                              <span className="text-slate-500 text-xs">NID: {tutor.nidNumber || "N/A"}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleVerify(tutor.id, "APPROVED")} 
                                  disabled={actionLoadingId === tutor.id}
                                  className="btn-primary text-xs py-1.5 px-3"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleVerify(tutor.id, "REJECTED")} 
                                  disabled={actionLoadingId === tutor.id}
                                  className="btn-secondary text-xs py-1.5 px-3"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="card">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recent Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Student</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Tutor</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Type</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500">No bookings yet on the platform.</td>
                        </tr>
                      ) : (
                        recentBookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{booking.student?.name}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{booking.tutor?.user?.name || "N/A"}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{booking.tuitionType}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                booking.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                                booking.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                                booking.status === "REJECTED" ? "bg-red-100 text-red-700" :
                                "bg-yellow-100 text-yellow-700"
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{new Date(booking.date).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Users */}
              <div className="card mt-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recent Registered Users</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!stats?.recentUsers || stats.recentUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-500">No users found.</td>
                        </tr>
                      ) : (
                        stats.recentUsers.map((u: any) => (
                          <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{u.name}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                                u.role === "ADMIN" ? "bg-red-100 text-red-700" :
                                u.role === "TUTOR" ? "bg-green-100 text-green-700" :
                                "bg-blue-100 text-blue-700"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
