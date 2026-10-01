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
    { label: "Total Users", value: stats ? String(stats.totalUsers) : "0", icon: HiOutlineUserGroup, color: "bg-clay/40 text-sage-700" },
    { label: "Active Tutors", value: stats ? String(stats.totalTutors) : "0", icon: HiOutlineShieldCheck, color: "bg-sage/15 text-sage-700" },
    { label: "Revenue", value: stats ? `৳${stats.revenue.toLocaleString()}` : "৳0", icon: HiOutlineCurrencyDollar, color: "bg-ochre/15 text-ochre-800" },
    { label: "Pending Verifications", value: stats ? String(stats.pendingTutors) : "0", icon: HiOutlineClipboardList, color: "bg-terracotta/15 text-terracotta-800" },
  ];

  return (
    <div className="flex min-h-screen bg-canvas">
      <DashboardSidebar role="ADMIN" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl">
          <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">Administration</span>
          <h1 className="font-display text-4xl font-semibold text-ink mb-2">Admin Dashboard</h1>
          <p className="text-ink-muted mb-8">Platform overview and management</p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sage-700 mx-auto"></div>
              <p className="text-ink-muted mt-3 text-sm">Loading admin console...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-terracotta/10 text-terracotta-800 rounded-2xl text-center mb-8 border border-terracotta/30">{error}</div>
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
                        <p className="text-2xl font-bold text-ink">{stat.value}</p>
                        <p className="text-sm text-ink-muted">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Verification Queue */}
              <div className="card mb-8">
                <h2 className="font-display text-xl font-semibold text-ink mb-6">Pending Tutor Verification</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone">
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Name</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Email</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Subjects</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">NID Number</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingTutors.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-ink-muted">No tutors waiting for verification.</td>
                        </tr>
                      ) : (
                        pendingTutors.map((tutor) => (
                          <tr key={tutor.id} className="border-b border-stone/70">
                            <td className="py-3 px-4 font-medium text-ink">{tutor.user?.name}</td>
                            <td className="py-3 px-4 text-ink-muted">{tutor.user?.email}</td>
                            <td className="py-3 px-4 text-ink-muted">{tutor.subjects?.join(", ") || "N/A"}</td>
                            <td className="py-3 px-4 text-ink-muted font-mono">{tutor.nidNumber || "N/A"}</td>
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
                <h2 className="font-display text-xl font-semibold text-ink mb-6">Pending Payout Requests</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone">
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Tutor</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Payout Method</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Wallet Details</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Amount</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-ink-muted">No pending payout requests.</td>
                        </tr>
                      ) : (
                        payouts.map((payout) => (
                          <tr key={payout.id} className="border-b border-stone/70">
                            <td className="py-3 px-4 font-medium text-ink">
                              {payout.tutorProfile?.user?.name || "Tutor"}
                            </td>
                            <td className="py-3 px-4 text-ink font-semibold">{payout.method}</td>
                            <td className="py-3 px-4 text-ink-muted font-mono">{payout.accountDetails}</td>
                            <td className="py-3 px-4 text-primary-800 font-bold">৳{payout.amount.toLocaleString()}</td>
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
                <h2 className="font-display text-xl font-semibold text-ink mb-6">Recent Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone">
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Student</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Tutor</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Type</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-ink-muted">No bookings yet on the platform.</td>
                        </tr>
                      ) : (
                        recentBookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-stone/70">
                            <td className="py-3 px-4 font-medium text-ink">{booking.student?.name}</td>
                            <td className="py-3 px-4 text-ink-muted">{booking.tutor?.user?.name || "N/A"}</td>
                            <td className="py-3 px-4 text-ink-muted">{booking.tuitionType}</td>
                            <td className="py-3 px-4">
                              <span className={`${
                                booking.status === "ACCEPTED" ? "badge-success" :
                                booking.status === "COMPLETED" ? "badge-primary" :
                                booking.status === "REJECTED" ? "badge-danger" :
                                "badge-warning"
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-ink-muted">{new Date(booking.date).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Users with Ban toggles */}
              <div className="card">
                <h2 className="font-display text-xl font-semibold text-ink mb-6">Recent Registered Users</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone">
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Name</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Email</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Role</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Joined Date</th>
                        <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!stats?.recentUsers || stats.recentUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-ink-muted">No users found.</td>
                        </tr>
                      ) : (
                        stats.recentUsers.map((u: any) => (
                          <tr key={u.id} className="border-b border-stone/70">
                            <td className="py-3 px-4 font-medium text-ink">{u.name}</td>
                            <td className="py-3 px-4 text-ink font-semibold">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`${
                                u.role === "ADMIN" ? "badge-danger" :
                                u.role === "TUTOR" ? "badge-success" :
                                "badge-primary"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-ink-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              {u.role !== "ADMIN" && (
                                <button
                                  onClick={() => handleToggleBan(u.id)}
                                  className={`text-xs py-1.5 px-4 rounded-full border font-bold transition-all ${
                                    u.isBanned
                                      ? "border-sage-600 text-sage-700 bg-sage/10 hover:bg-sage/20"
                                      : "border-terracotta/50 text-terracotta-700 bg-terracotta/5 hover:bg-terracotta/15"
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
        <div className="fixed inset-0 bg-ink/55 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-card border border-stone p-6 max-w-lg w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-soft-xl">
            <h3 className="font-display text-lg font-semibold text-ink border-b border-stone pb-2">Review Tutor Credentials</h3>
            
            <div className="space-y-3.5 text-xs text-ink">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-ink-muted">Full Name</p>
                  <p className="font-semibold text-ink mt-0.5">{selectedTutorDetails.user?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-ink-muted">Email</p>
                  <p className="font-semibold text-ink mt-0.5">{selectedTutorDetails.user?.email}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-ink-muted">Qualification & Institution</p>
                <p className="font-semibold text-ink mt-0.5">
                  {selectedTutorDetails.qualification || "N/A"} ({selectedTutorDetails.institution || "N/A"})
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-ink-muted">Tutor Bio</p>
                <p className="mt-0.5 leading-relaxed bg-clay-light p-2.5 rounded-xl border border-stone">{selectedTutorDetails.bio || "No biography details available."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-ink-muted">District / Area</p>
                  <p className="font-semibold text-ink mt-0.5">{selectedTutorDetails.locationDistrict} - {selectedTutorDetails.locationArea}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-ink-muted">NID Card Number</p>
                  <p className="font-semibold text-ink mt-0.5 font-mono">{selectedTutorDetails.nidNumber || "N/A"}</p>
                </div>
              </div>

              {selectedTutorDetails.documentUrl && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-ink-muted mb-1">NID Document Upload Scan</p>
                  <a
                    href={selectedTutorDetails.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary-800 font-bold hover:underline"
                  >
                    📂 Click here to inspect NID Scan
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-stone">
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
                className="btn-outline border-terracotta/50 text-terracotta-700 hover:bg-terracotta/10 py-1.5 px-4 text-xs font-semibold"
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
