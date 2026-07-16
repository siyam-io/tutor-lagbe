"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineShieldCheck, HiOutlineClipboardList, HiEye } from "react-icons/hi";
import api from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [pendingTutors, setPendingTutors] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal states
  const [selectedTutorDetails, setSelectedTutorDetails] = useState<any | null>(null);

  const fetchAdminData = async () => {
    try {
      const [statsRes, payoutsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/withdrawals/admin"),
      ]);

      if (statsRes.data.success) {
        const payload = statsRes.data.data;
        setStats(payload);
        setPendingTutors(payload.pendingTutorsList || []);
        setRecentBookings(payload.recentBookings || []);
      }
      if (payoutsRes.data.success) {
        setPayouts(payoutsRes.data.data.filter((w: any) => w.status === "PENDING"));
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
        setSelectedTutorDetails(null);
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

  const handlePayoutAction = async (payoutId: string, status: "APPROVED" | "REJECTED") => {
    const txnId = status === "APPROVED" ? prompt("Enter reference Transaction ID (Bkash/Nagad Ref):") || "TXN_PAID" : null;
    try {
      const { data } = await api.patch(`/withdrawals/admin/${payoutId}`, { status, transactionId: txnId });
      if (data.success) {
        setPayouts((prev) => prev.filter((p) => p.id !== payoutId));
      }
    } catch (err) {
      console.error("Payout action failed:", err);
    }
  };

  const handleToggleBan = async (userId: string) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/ban`);
      if (data.success) {
        setStats((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentUsers: prev.recentUsers.map((u: any) =>
              u.id === userId ? { ...u, isBanned: data.data.isBanned } : u
            ),
          };
        });
      }
    } catch (err) {
      console.error("Failed to toggle user ban:", err);
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
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">NID Number</th>
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
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{tutor.subjects?.join(", ") || "N/A"}</td>
                            <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono">{tutor.nidNumber || "N/A"}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedTutorDetails(tutor)}
                                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-semibold"
                                >
                                  <HiEye className="w-4 h-4" /> View Details
                                </button>
                                <button 
                                  onClick={() => handleVerify(tutor.id, "APPROVED")} 
                                  disabled={actionLoadingId === tutor.id}
                                  className="btn-primary text-xs py-1.5 px-3"
                                >
                                  Approve
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

              {/* Pending Payout Requests */}
              <div className="card mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Pending Payout Requests</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Tutor</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Payout Method</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Wallet Details</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500">No pending payout requests.</td>
                        </tr>
                      ) : (
                        payouts.map((payout) => (
                          <tr key={payout.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                              {payout.tutorProfile?.user?.name || "Tutor"}
                            </td>
                            <td className="py-3 px-4 text-slate-655 dark:text-slate-400 font-semibold">{payout.method}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">{payout.accountDetails}</td>
                            <td className="py-3 px-4 text-primary-600 font-bold">৳{payout.amount.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handlePayoutAction(payout.id, "APPROVED")}
                                  className="btn-primary text-xs py-1.5 px-3"
                                >
                                  Mark Processed
                                </button>
                                <button
                                  onClick={() => handlePayoutAction(payout.id, "REJECTED")}
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
              <div className="card mb-8">
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

              {/* Recent Users with Ban toggles */}
              <div className="card">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recent Registered Users</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Joined Date</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!stats?.recentUsers || stats.recentUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500">No users found.</td>
                        </tr>
                      ) : (
                        stats.recentUsers.map((u: any) => (
                          <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{u.name}</td>
                            <td className="py-3 px-4 text-slate-650 dark:text-slate-400 font-semibold">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                                u.role === "ADMIN" ? "bg-red-100 text-red-700" :
                                u.role === "TUTOR" ? "bg-green-100 text-green-700" :
                                "bg-blue-100 text-blue-700"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-550 dark:text-slate-450">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              {u.role !== "ADMIN" && (
                                <button
                                  onClick={() => handleToggleBan(u.id)}
                                  className={`text-xs py-1.5 px-4 rounded-xl border font-bold transition-all ${
                                    u.isBanned
                                      ? "border-green-500 text-green-600 bg-green-50/50 hover:bg-green-100"
                                      : "border-red-500 text-red-600 bg-red-50/50 hover:bg-red-100"
                                  }`}
                                >
                                  {u.isBanned ? "Unban" : "Ban"}
                                </button>
                              )}
                            </td>
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

      {/* Tutor details view modal */}
      {selectedTutorDetails && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-250 dark:border-slate-800 p-6 max-w-lg w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Review Tutor Credentials</h3>
            
            <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-450">Full Name</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedTutorDetails.user?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-450">Email</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedTutorDetails.user?.email}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-450">Qualification & Institution</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {selectedTutorDetails.qualification || "N/A"} ({selectedTutorDetails.institution || "N/A"})
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-450">Tutor Bio</p>
                <p className="mt-0.5 leading-relaxed bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">{selectedTutorDetails.bio || "No biography details available."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-455">District / Area</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedTutorDetails.locationDistrict} - {selectedTutorDetails.locationArea}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-455">NID Card Number</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5 font-mono">{selectedTutorDetails.nidNumber || "N/A"}</p>
                </div>
              </div>

              {selectedTutorDetails.documentUrl && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-450 mb-1">NID Document Upload Scan</p>
                  <a
                    href={selectedTutorDetails.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary-600 font-bold hover:underline"
                  >
                    📂 Click here to inspect NID Scan
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTutorDetails(null)}
                className="btn-secondary py-1.5 px-4 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleVerify(selectedTutorDetails.id, "REJECTED")}
                className="btn-secondary bg-red-50 hover:bg-red-100 border-red-200 text-red-655 py-1.5 px-4 text-xs font-semibold"
              >
                Reject Verification
              </button>
              <button
                type="button"
                onClick={() => handleVerify(selectedTutorDetails.id, "APPROVED")}
                className="btn-primary py-1.5 px-4 text-xs font-semibold"
              >
                Approve Tutor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
