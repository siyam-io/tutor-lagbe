"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import api from "@/lib/api";
import { HiEye, HiOutlineClipboardList, HiOutlineCurrencyDollar, HiOutlineShieldCheck, HiOutlineUserGroup } from "react-icons/hi";

export default function AdminSubPage({ params }: { params: { page: string } }) {
  const [data, setData] = useState<any[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const limit = 20;

  // Modal states
  const [selectedTutorDetails, setSelectedTutorDetails] = useState<any | null>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [bookingsModalUser, setBookingsModalUser] = useState<string>("");

  const title = params.page.charAt(0).toUpperCase() + params.page.slice(1);

  const handleVerify = async (tutorId: string, status: "APPROVED" | "REJECTED" | "PENDING") => {
    setActionLoadingId(tutorId);
    try {
      const { data: res } = await api.patch(`/admin/verify-tutor/${tutorId}`, { status });
      if (res.success) {
        setData((prev) =>
          prev.map((item) =>
            item.id === tutorId ? { ...item, verificationStatus: status } : item
          )
        );
        setSelectedTutorDetails(null);
      }
    } catch (err) {
      console.error("Failed to verify tutor:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleBan = async (userId: string) => {
    try {
      const { data: res } = await api.patch(`/admin/users/${userId}/ban`);
      if (res.success) {
        // Toggle isBanned for users or students list directly
        setData((prev) =>
          prev.map((item) => {
            const matchesId = item.id === userId || item.userId === userId || item.user?.id === userId;
            if (matchesId) {
              if (item.user) {
                return { ...item, user: { ...item.user, isBanned: res.data.isBanned } };
              }
              return { ...item, isBanned: res.data.isBanned };
            }
            return item;
          })
        );
      }
    } catch (err) {
      console.error("Failed to toggle user ban:", err);
    }
  };

  const handleFetchBookings = async (userId: string, userName: string) => {
    try {
      setBookingsModalUser(userName);
      const { data: res } = await api.get(`/admin/users/${userId}/bookings`);
      if (res.success) {
        setUserBookings(res.data || []);
        setShowBookingsModal(true);
      }
    } catch (err) {
      console.error("Failed to load user bookings:", err);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    setActionLoadingId(bookingId);
    try {
      const { data: res } = await api.patch(`/bookings/${bookingId}/status`, { status });
      if (res.success) {
        setData((prev) =>
          prev.map((item) =>
            item.id === bookingId ? { ...item, status } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to update booking status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (params.page === "reports") {
        const { data: res } = await api.get("/admin/reports");
        if (res.success) {
          setReportData(res.data);
        }
      } else if (
        params.page === "users" ||
        params.page === "tutors" ||
        params.page === "students" ||
        params.page === "bookings" ||
        params.page === "payments"
      ) {
        const url = `/admin/${params.page}?page=${page}&limit=${limit}&search=${search}&role=${filter}&status=${filter}`;
        const { data: res } = await api.get(url);
        if (res.success) {
          setData(res.data || []);
          setTotalPages(res.pagination?.totalPages || 1);
          setTotal(res.pagination?.total || 0);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to fetch ${params.page}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setSearch("");
    setFilter("ALL");
  }, [params.page]);

  useEffect(() => {
    fetchData();
  }, [params.page, page, search, filter]);

  const renderContent = () => {
    if (
      params.page !== "users" &&
      params.page !== "tutors" &&
      params.page !== "students" &&
      params.page !== "bookings" &&
      params.page !== "payments" &&
      params.page !== "reports"
    ) {
      return (
        <div className="card text-center py-16">
          <p className="text-ink-muted text-lg">🚧 {title} management panel coming soon</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sage-700 mx-auto"></div>
          <p className="text-ink-muted mt-3 text-sm">Loading {title}...</p>
        </div>
      );
    }

    if (error) {
      return <div className="p-4 bg-terracotta/10 text-terracotta-800 rounded-2xl text-center border border-terracotta/30">{error}</div>;
    }

    if (params.page === "users") {
      return (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone">
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Phone</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Role</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Joined Date</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-ink-muted">No users found.</td>
                  </tr>
                ) : (
                  data.map((user) => (
                    <tr key={user.id} className="border-b border-stone/70">
                      <td className="py-3 px-4 font-medium text-ink">{user.name}</td>
                      <td className="py-3 px-4 text-ink-muted">{user.email}</td>
                      <td className="py-3 px-4 text-ink-muted">{user.phone || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span className={`${
                          user.role === "ADMIN" ? "badge-danger" :
                          user.role === "TUTOR" ? "badge-success" :
                          "badge-primary"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-ink-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => handleFetchBookings(user.id, user.name)}
                          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-semibold"
                        >
                          <HiOutlineClipboardList className="w-4 h-4" /> Bookings
                        </button>
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() => handleToggleBan(user.id)}
                            className={`text-xs py-1.5 px-3 rounded-xl border font-bold transition-all ${
                              user.isBanned
                                ? "border-green-500 text-green-600 bg-green-50/50 hover:bg-green-100"
                                : "border-red-500 text-red-650 bg-red-50/50 hover:bg-red-100"
                            }`}
                          >
                            {user.isBanned ? "Unban" : "Ban"}
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
      );
    }

    if (params.page === "tutors") {
      return (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone">
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Tutor Name</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Subjects</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Expected Salary</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Verification</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-ink-muted">No tutors found.</td>
                  </tr>
                ) : (
                  data.map((tutor) => (
                    <tr key={tutor.id} className="border-b border-stone/70">
                      <td className="py-3 px-4 font-medium text-ink">{tutor.user?.name}</td>
                      <td className="py-3 px-4 text-ink-muted">{tutor.user?.email}</td>
                      <td className="py-3 px-4 text-ink-muted">{tutor.subjects?.join(", ") || "N/A"}</td>
                      <td className="py-3 px-4 text-ink-muted font-semibold">৳{tutor.expectedSalary?.toLocaleString()}/mo</td>
                      <td className="py-3 px-4">
                        <select
                          value={tutor.verificationStatus}
                          disabled={actionLoadingId === tutor.id}
                          onChange={(e) => handleVerify(tutor.id, e.target.value as "APPROVED" | "REJECTED" | "PENDING")}
                          className={`text-xs px-2.5 py-1 rounded-full border font-bold focus:outline-none focus:ring-1 focus:ring-sage-700 ${
                            tutor.verificationStatus === "APPROVED" ? "bg-sage/15 border-sage/40 text-sage-700" :
                            tutor.verificationStatus === "REJECTED" ? "bg-terracotta/10 border-terracotta/30 text-terracotta-800" :
                            "bg-ochre/10 border-ochre/30 text-ochre-800"
                          }`}
                        >
                          <option value="PENDING" className="bg-white text-ink">Pending</option>
                          <option value="APPROVED" className="bg-white text-ink">Approved</option>
                          <option value="REJECTED" className="bg-white text-ink">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTutorDetails(tutor)}
                          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-semibold"
                        >
                          <HiEye className="w-4 h-4" /> View Details
                        </button>
                        <button
                          onClick={() => handleFetchBookings(tutor.userId, tutor.user?.name || "Tutor")}
                          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-semibold"
                        >
                          <HiOutlineClipboardList className="w-4 h-4" /> History
                        </button>
                        <button
                          onClick={() => handleToggleBan(tutor.userId)}
                          className={`text-xs py-1.5 px-3 rounded-xl border font-bold transition-all ${
                            tutor.user?.isBanned
                              ? "border-green-500 text-green-600 bg-green-50/50 hover:bg-green-100"
                              : "border-red-500 text-red-650 bg-red-50/50 hover:bg-red-100"
                          }`}
                        >
                          {tutor.user?.isBanned ? "Unban" : "Ban"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (params.page === "students") {
      return (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone">
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Student Name</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Phone</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Joined Date</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-ink-muted">No students found.</td>
                  </tr>
                ) : (
                  data.map((student) => (
                    <tr key={student.id} className="border-b border-stone/70">
                      <td className="py-3 px-4 font-medium text-ink">{student.name}</td>
                      <td className="py-3 px-4 text-ink-muted">{student.email}</td>
                      <td className="py-3 px-4 text-ink-muted">{student.phone || "N/A"}</td>
                      <td className="py-3 px-4 text-ink-muted">{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => handleFetchBookings(student.id, student.name)}
                          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-semibold"
                        >
                          <HiOutlineClipboardList className="w-4 h-4" /> Bookings History
                        </button>
                        <button
                          onClick={() => handleToggleBan(student.id)}
                          className={`text-xs py-1.5 px-3 rounded-xl border font-bold transition-all ${
                            student.isBanned
                              ? "border-green-500 text-green-600 bg-green-50/50 hover:bg-green-100"
                              : "border-red-500 text-red-650 bg-red-50/50 hover:bg-red-100"
                          }`}
                        >
                          {student.isBanned ? "Unban" : "Ban"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (params.page === "bookings") {
      return (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone">
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Student</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Tutor</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Time Slot</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-ink-muted">No bookings found.</td>
                  </tr>
                ) : (
                  data.map((booking) => (
                    <tr key={booking.id} className="border-b border-stone/70">
                      <td className="py-3 px-4 font-medium text-ink">
                        <p>{booking.student?.name}</p>
                        <p className="text-xs text-ink-muted">{booking.student?.email}</p>
                      </td>
                      <td className="py-3 px-4 text-ink-muted">{booking.tutor?.user?.name || "N/A"}</td>
                      <td className="py-3 px-4 text-ink-muted">{booking.tuitionType}</td>
                      <td className="py-3 px-4 text-ink-muted">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-ink-muted">{booking.timeSlot}</td>
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
                      <td className="py-3 px-4">
                        <select
                          value={booking.status}
                          disabled={actionLoadingId === booking.id}
                          onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                          className="px-2.5 py-1 bg-white border border-stone rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-sage-700 text-ink font-medium"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (params.page === "payments") {
      return (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone">
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Student</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Tutor</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Method</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Amount</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-ink-muted">No payments found.</td>
                  </tr>
                ) : (
                  data.map((payment) => (
                    <tr key={payment.id} className="border-b border-stone/70">
                      <td className="py-3 px-4 font-medium text-ink">
                        <p>{payment.student?.name || "Deleted User"}</p>
                        <p className="text-xs text-ink-muted">{payment.student?.email || ""}</p>
                      </td>
                      <td className="py-3 px-4 text-ink-muted">{payment.booking?.tutorName || "N/A"}</td>
                      <td className="py-3 px-4 text-ink-muted font-semibold">{payment.method}</td>
                      <td className="py-3 px-4 text-ink-muted font-mono">{payment.transactionId || "N/A"}</td>
                      <td className="py-3 px-4 text-primary-600 font-bold">৳{payment.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`${
                          payment.status === "COMPLETED" ? "badge-success" :
                          payment.status === "FAILED" ? "badge-danger" :
                          "badge-warning"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-ink-muted">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (params.page === "reports" && reportData) {
      const summary = reportData.summary;
      return (
        <div className="space-y-8">
          {/* Stats summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="stat-card">
              <div className="stat-icon bg-ochre/15 text-ochre-800">
                <HiOutlineCurrencyDollar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-ink">৳{summary.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Total Revenue</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon bg-clay/40 text-sage-700">
                <HiOutlineClipboardList className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-ink">{summary.totalBookingsCount}</p>
                <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Total Bookings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon bg-sage/15 text-sage-700">
                <HiOutlineShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-ink">{summary.totalTutorsCount}</p>
                <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Active Tutors</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon bg-clay/40 text-sage-700">
                <HiOutlineUserGroup className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-ink">{summary.totalStudentsCount}</p>
                <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Active Students</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Chart */}
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink mb-4">Monthly Revenue Timeline</h3>
              <div className="space-y-4 pt-2">
                {reportData.monthlyRevenue.map((item: any) => {
                  const maxAmt = Math.max(...reportData.monthlyRevenue.map((r: any) => r.amount), 1);
                  const percentage = (item.amount / maxAmt) * 100;
                  return (
                    <div key={item.month} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-ink-muted">{item.month}</span>
                        <span className="text-ink font-semibold">৳{item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-3 bg-clay-light rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sage-600 to-primary-800 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {reportData.monthlyRevenue.length === 0 && (
                  <p className="text-sm text-ink-muted text-center py-8">No billing history found.</p>
                )}
              </div>
            </div>

            {/* Booking Status Breakdown */}
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink mb-4">Booking Status Distribution</h3>
              <div className="space-y-4 pt-2">
                {reportData.bookingsByStatus.map((item: any) => {
                  const totalBookings = reportData.bookingsByStatus.reduce((sum: number, b: any) => sum + b.count, 0) || 1;
                  const percentage = (item.count / totalBookings) * 100;
                  
                  const statusColors: any = {
                    ACCEPTED: "bg-sage-600",
                    COMPLETED: "bg-primary-700",
                    REJECTED: "bg-terracotta-700",
                    CANCELLED: "bg-ink-muted",
                    PENDING: "bg-ochre",
                  };
                  const color = statusColors[item.status] || "bg-primary-700";

                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-ink-muted">{item.status}</span>
                        <span className="text-ink font-semibold">
                          {item.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-clay-light rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {reportData.bookingsByStatus.length === 0 && (
                  <p className="text-sm text-ink-muted text-center py-8">No booking statistics available.</p>
                )}
              </div>
            </div>

            {/* User Registration Timeline */}
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink mb-4">User Acquisition Growth</h3>
              <div className="space-y-5 pt-2">
                {reportData.userGrowth.map((item: any) => {
                  const totalUsers = item.students + item.tutors || 1;
                  const studentPercentage = (item.students / totalUsers) * 100;
                  const tutorPercentage = (item.tutors / totalUsers) * 100;
                  return (
                    <div key={item.month} className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-ink font-semibold">{item.month}</span>
                        <span className="text-ink-muted text-xs">
                          Students: <span className="font-semibold text-primary-700">{item.students}</span> | Tutors: <span className="font-semibold text-sage-700">{item.tutors}</span>
                        </span>
                      </div>
                      <div className="w-full h-4 bg-clay-light rounded-full flex overflow-hidden">
                        <div
                          className="h-full bg-primary-600 transition-all duration-500"
                          style={{ width: `${studentPercentage}%` }}
                          title={`Students: ${item.students}`}
                        />
                        <div
                          className="h-full bg-sage-600 transition-all duration-500"
                          style={{ width: `${tutorPercentage}%` }}
                          title={`Tutors: ${item.tutors}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification Status Distribution */}
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink mb-4">Tutor Profile Verification Metrics</h3>
              <div className="space-y-4 pt-2">
                {reportData.verifications.map((item: any) => {
                  const totalTutors = reportData.verifications.reduce((sum: number, v: any) => sum + v.count, 0) || 1;
                  const percentage = (item.count / totalTutors) * 100;

                  const statusColors: any = {
                    APPROVED: "bg-sage-600",
                    PENDING: "bg-ochre",
                    REJECTED: "bg-terracotta-700",
                  };
                  const color = statusColors[item.status] || "bg-primary-700";

                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-ink-muted">{item.status}</span>
                        <span className="text-ink font-semibold">
                          {item.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-clay-light rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {reportData.verifications.length === 0 && (
                  <p className="text-sm text-ink-muted text-center py-8">No verification metrics found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <DashboardSidebar role="ADMIN" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl">
          <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">Administration</span>
          <h1 className="font-display text-4xl font-semibold text-ink mb-2">{title}</h1>
          <p className="text-ink-muted mb-8">Manage platform {params.page.toLowerCase()}</p>

          {/* Search and Filters */}
          {(params.page === "users" || params.page === "tutors" || params.page === "students" || params.page === "bookings" || params.page === "payments") && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`Search ${params.page.toLowerCase()} by name, email, transaction...`}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="input-field text-sm"
                />
              </div>

              {/* Status filter for payments */}
              {params.page === "payments" && (
                <div className="w-full sm:w-48">
                  <select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setPage(1);
                    }}
                    className="input-field text-sm"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
              )}

              {/* Role filter for users */}
              {params.page === "users" && (
                <div className="w-full sm:w-48">
                  <select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setPage(1);
                    }}
                    className="input-field text-sm"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="STUDENT">Student</option>
                    <option value="TUTOR">Tutor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              )}

              {/* Verification Status filter for tutors */}
              {params.page === "tutors" && (
                <div className="w-full sm:w-48">
                  <select
                    value={filter}
                    onChange={(e) => {
                       setFilter(e.target.value);
                       setPage(1);
                    }}
                    className="input-field text-sm"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              )}

              {/* Booking status filter */}
              {params.page === "bookings" && (
                <div className="w-full sm:w-48">
                  <select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setPage(1);
                    }}
                    className="input-field text-sm"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {renderContent()}

          {!loading && !error && totalPages > 1 && params.page !== "reports" && (
            <div className="flex items-center justify-between mt-6 bg-white px-6 py-4 rounded-card border border-stone shadow-soft">
              <p className="text-sm text-ink-muted">
                Showing <span className="font-semibold text-ink">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-semibold text-ink">
                  {Math.min(page * limit, total)}
                </span>{" "}
                of <span className="font-semibold text-ink">{total}</span> records
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="btn-secondary py-1.5 px-4 disabled:opacity-50 text-xs"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="btn-secondary py-1.5 px-4 disabled:opacity-50 text-xs"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tutor Details Modal */}
      {selectedTutorDetails && (
        <div className="fixed inset-0 bg-ink/55 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-card border border-stone p-6 max-w-lg w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-soft-xl">
            <h3 className="font-display text-lg font-semibold text-ink border-b border-stone pb-2">Tutor Credentials Profile</h3>
            
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
              {selectedTutorDetails.verificationStatus !== "APPROVED" && (
                <button
                  type="button"
                  onClick={() => handleVerify(selectedTutorDetails.id, "APPROVED")}
                  className="btn-primary py-1.5 px-4 text-xs font-semibold"
                >
                  Approve Tutor
                </button>
              )}
              {selectedTutorDetails.verificationStatus !== "REJECTED" && (
                <button
                  type="button"
                  onClick={() => handleVerify(selectedTutorDetails.id, "REJECTED")}
                  className="btn-outline border-terracotta/50 text-terracotta-700 hover:bg-terracotta/10 py-1.5 px-4 text-xs font-semibold"
                >
                  Reject Tutor
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bookings History Modal */}
      {showBookingsModal && (
        <div className="fixed inset-0 bg-ink/55 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-card border border-stone p-6 max-w-3xl w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-soft-xl">
            <h3 className="font-display text-lg font-semibold text-ink border-b border-stone pb-2">
              Bookings History for: <span className="text-primary-800">{bookingsModalUser}</span>
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone text-ink-muted font-medium">
                    <th className="py-2 px-3">Student</th>
                    <th className="py-2 px-3">Tutor</th>
                    <th className="py-2 px-3">Tuition Type</th>
                    <th className="py-2 px-3">Schedule Date</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-ink-muted">No booking request history found.</td>
                    </tr>
                  ) : (
                    userBookings.map((b) => (
                      <tr key={b.id} className="border-b border-stone/70">
                        <td className="py-2.5 px-3 font-semibold text-ink">{b.student?.name}</td>
                        <td className="py-2.5 px-3 text-ink-muted">{b.tutor?.user?.name || "Tutor"}</td>
                        <td className="py-2.5 px-3">{b.tuitionType}</td>
                        <td className="py-2.5 px-3">{new Date(b.date).toLocaleDateString()} ({b.timeSlot})</td>
                        <td className="py-2.5 px-3 font-bold text-primary-800">
                          {b.amount 
                            ? `৳${b.amount.toLocaleString()}` 
                            : b.tutor?.expectedSalary 
                              ? `৳${b.tutor.expectedSalary.toLocaleString()} (mo)` 
                              : b.tutor?.hourlyRate 
                                ? `৳${b.tutor.hourlyRate.toLocaleString()} (hr)` 
                                : "৳6,000"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`${
                            b.status === "COMPLETED" ? "badge-primary" :
                            b.status === "ACCEPTED" ? "badge-success" :
                            b.status === "REJECTED" ? "badge-danger" :
                            "badge-warning"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone">
              <button
                type="button"
                onClick={() => setShowBookingsModal(false)}
                className="btn-primary py-1.5 px-5 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
