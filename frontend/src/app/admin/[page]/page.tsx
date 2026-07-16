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
          <p className="text-slate-400 text-lg">🚧 {title} management panel coming soon</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-slate-500 mt-2">Loading {title}...</p>
        </div>
      );
    }

    if (error) {
      return <div className="p-4 bg-red-50 text-red-650 rounded-lg text-center">{error}</div>;
    }

    if (params.page === "users") {
      return (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Joined Date</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">No users found.</td>
                  </tr>
                ) : (
                  data.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{user.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{user.phone || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          user.role === "ADMIN" ? "bg-red-100 text-red-700" :
                          user.role === "TUTOR" ? "bg-green-100 text-green-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
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
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Tutor Name</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Subjects</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Expected Salary</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Verification</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">No tutors found.</td>
                  </tr>
                ) : (
                  data.map((tutor) => (
                    <tr key={tutor.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{tutor.user?.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{tutor.user?.email}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{tutor.subjects?.join(", ") || "N/A"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">৳{tutor.expectedSalary?.toLocaleString()}/mo</td>
                      <td className="py-3 px-4">
                        <select
                          value={tutor.verificationStatus}
                          disabled={actionLoadingId === tutor.id}
                          onChange={(e) => handleVerify(tutor.id, e.target.value as "APPROVED" | "REJECTED" | "PENDING")}
                          className={`text-xs px-2 py-1 rounded-lg border font-bold focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                            tutor.verificationStatus === "APPROVED" ? "bg-green-50 border-green-250 text-green-700 dark:bg-green-950/20 dark:border-green-950/50 dark:text-green-350" :
                            tutor.verificationStatus === "REJECTED" ? "bg-red-50 border-red-250 text-red-700 dark:bg-red-950/20 dark:border-red-950/50 dark:text-red-355" :
                            "bg-yellow-50 border-yellow-250 text-yellow-750 dark:bg-yellow-950/20 dark:border-yellow-950/50 dark:text-yellow-350"
                          }`}
                        >
                          <option value="PENDING" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Pending</option>
                          <option value="APPROVED" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Approved</option>
                          <option value="REJECTED" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Rejected</option>
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
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Student Name</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Joined Date</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">No students found.</td>
                  </tr>
                ) : (
                  data.map((student) => (
                    <tr key={student.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{student.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{student.email}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{student.phone || "N/A"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{new Date(student.createdAt).toLocaleDateString()}</td>
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
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Student</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Tutor</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Time Slot</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">No bookings found.</td>
                  </tr>
                ) : (
                  data.map((booking) => (
                    <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                        <p>{booking.student?.name}</p>
                        <p className="text-xs text-slate-400">{booking.student?.email}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{booking.tutor?.user?.name || "N/A"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{booking.tuitionType}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{booking.timeSlot}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          booking.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                          booking.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                          booking.status === "REJECTED" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={booking.status}
                          disabled={actionLoadingId === booking.id}
                          onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                          className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-white font-medium"
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
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Student</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Tutor</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Method</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">No payments found.</td>
                  </tr>
                ) : (
                  data.map((payment) => (
                    <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                        <p>{payment.student?.name || "Deleted User"}</p>
                        <p className="text-xs text-slate-400">{payment.student?.email || ""}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{payment.booking?.tutorName || "N/A"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">{payment.method}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono">{payment.transactionId || "N/A"}</td>
                      <td className="py-3 px-4 text-primary-600 font-bold">৳{payment.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          payment.status === "COMPLETED" ? "bg-green-100 text-green-750 dark:bg-green-950/20 dark:text-green-300" :
                          payment.status === "FAILED" ? "bg-red-100 text-red-750 dark:bg-red-950/20 dark:text-red-300" :
                          "bg-yellow-100 text-yellow-750 dark:bg-yellow-950/20 dark:text-yellow-350"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-450">{new Date(payment.createdAt).toLocaleDateString()}</td>
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
            <div className="stat-card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="stat-icon bg-purple-100 text-purple-650 dark:bg-purple-900 dark:text-purple-300 w-12 h-12 rounded-xl flex items-center justify-center text-xl">
                <HiOutlineCurrencyDollar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">৳{summary.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-450 font-medium uppercase tracking-wider">Total Revenue</p>
              </div>
            </div>
            <div className="stat-card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="stat-icon bg-blue-100 text-blue-650 dark:bg-blue-900 dark:text-blue-300 w-12 h-12 rounded-xl flex items-center justify-center text-xl">
                <HiOutlineClipboardList className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{summary.totalBookingsCount}</p>
                <p className="text-xs text-slate-455 font-medium uppercase tracking-wider">Total Bookings</p>
              </div>
            </div>
            <div className="stat-card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="stat-icon bg-green-100 text-green-650 dark:bg-green-900 dark:text-green-300 w-12 h-12 rounded-xl flex items-center justify-center text-xl">
                <HiOutlineShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{summary.totalTutorsCount}</p>
                <p className="text-xs text-slate-455 font-medium uppercase tracking-wider">Active Tutors</p>
              </div>
            </div>
            <div className="stat-card bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="stat-icon bg-blue-100 text-blue-650 dark:bg-blue-900 dark:text-blue-300 w-12 h-12 rounded-xl flex items-center justify-center text-xl">
                <HiOutlineUserGroup className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{summary.totalStudentsCount}</p>
                <p className="text-xs text-slate-455 font-medium uppercase tracking-wider">Active Students</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Chart */}
            <div className="card p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-4">Monthly Revenue Timeline</h3>
              <div className="space-y-4 pt-2">
                {reportData.monthlyRevenue.map((item: any) => {
                  const maxAmt = Math.max(...reportData.monthlyRevenue.map((r: any) => r.amount), 1);
                  const percentage = (item.amount / maxAmt) * 100;
                  return (
                    <div key={item.month} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400">{item.month}</span>
                        <span className="text-slate-900 dark:text-white font-semibold">৳{item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {reportData.monthlyRevenue.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">No billing history found.</p>
                )}
              </div>
            </div>

            {/* Booking Status Breakdown */}
            <div className="card p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-4">Booking Status Distribution</h3>
              <div className="space-y-4 pt-2">
                {reportData.bookingsByStatus.map((item: any) => {
                  const totalBookings = reportData.bookingsByStatus.reduce((sum: number, b: any) => sum + b.count, 0) || 1;
                  const percentage = (item.count / totalBookings) * 100;
                  
                  const statusColors: any = {
                    ACCEPTED: "bg-green-500",
                    COMPLETED: "bg-blue-500",
                    REJECTED: "bg-red-505",
                    CANCELLED: "bg-slate-500",
                    PENDING: "bg-yellow-500",
                  };
                  const color = statusColors[item.status] || "bg-primary-500";

                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400">{item.status}</span>
                        <span className="text-slate-900 dark:text-white font-semibold">
                          {item.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {reportData.bookingsByStatus.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">No booking statistics available.</p>
                )}
              </div>
            </div>

            {/* User Registration Timeline */}
            <div className="card p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-4">User Acquisition Growth</h3>
              <div className="space-y-5 pt-2">
                {reportData.userGrowth.map((item: any) => {
                  const totalUsers = item.students + item.tutors || 1;
                  const studentPercentage = (item.students / totalUsers) * 100;
                  const tutorPercentage = (item.tutors / totalUsers) * 100;
                  return (
                    <div key={item.month} className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">{item.month}</span>
                        <span className="text-slate-500 text-xs">
                          Students: <span className="font-semibold text-blue-600">{item.students}</span> | Tutors: <span className="font-semibold text-green-600">{item.tutors}</span>
                        </span>
                      </div>
                      <div className="w-full h-4 bg-slate-100 dark:bg-slate-850 rounded-full flex overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${studentPercentage}%` }}
                          title={`Students: ${item.students}`}
                        />
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
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
            <div className="card p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-4">Tutor Profile Verification Metrics</h3>
              <div className="space-y-4 pt-2">
                {reportData.verifications.map((item: any) => {
                  const totalTutors = reportData.verifications.reduce((sum: number, v: any) => sum + v.count, 0) || 1;
                  const percentage = (item.count / totalTutors) * 100;

                  const statusColors: any = {
                    APPROVED: "bg-green-500",
                    PENDING: "bg-yellow-500",
                    REJECTED: "bg-red-500",
                  };
                  const color = statusColors[item.status] || "bg-primary-500";

                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400">{item.status}</span>
                        <span className="text-slate-900 dark:text-white font-semibold">
                          {item.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {reportData.verifications.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">No verification metrics found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="ADMIN" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Manage platform {params.page.toLowerCase()}</p>

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
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-900 dark:text-white"
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
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-900 dark:text-white"
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
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-900 dark:text-white"
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
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-900 dark:text-white"
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
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-900 dark:text-white"
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
            <div className="flex items-center justify-between mt-6 bg-white dark:bg-slate-900 px-6 py-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-800 dark:text-white">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-semibold text-slate-800 dark:text-white">
                  {Math.min(page * limit, total)}
                </span>{" "}
                of <span className="font-semibold text-slate-800 dark:text-white">{total}</span> records
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
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-250 dark:border-slate-800 p-6 max-w-lg w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b pb-2">Tutor Credentials Profile</h3>
            
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
                  className="btn-secondary bg-red-50 hover:bg-red-100 border-red-200 text-red-655 py-1.5 px-4 text-xs font-semibold"
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
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-250 dark:border-slate-800 p-6 max-w-3xl w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b pb-2">
              Bookings History for: <span className="text-primary-600">{bookingsModalUser}</span>
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-medium">
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
                      <td colSpan={6} className="py-6 text-center text-slate-400">No booking request history found.</td>
                    </tr>
                  ) : (
                    userBookings.map((b) => (
                      <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-white">{b.student?.name}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{b.tutor?.user?.name || "Tutor"}</td>
                        <td className="py-2.5 px-3">{b.tuitionType}</td>
                        <td className="py-2.5 px-3">{new Date(b.date).toLocaleDateString()} ({b.timeSlot})</td>
                        <td className="py-2.5 px-3 font-bold text-primary-600">
                          {b.amount 
                            ? `৳${b.amount.toLocaleString()}` 
                            : b.tutor?.expectedSalary 
                              ? `৳${b.tutor.expectedSalary.toLocaleString()} (mo)` 
                              : b.tutor?.hourlyRate 
                                ? `৳${b.tutor.hourlyRate.toLocaleString()} (hr)` 
                                : "৳6,000"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            b.status === "COMPLETED" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" :
                            b.status === "ACCEPTED" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300" :
                            b.status === "REJECTED" ? "bg-red-100 text-red-750 dark:bg-red-950/40 dark:text-red-300" :
                            "bg-yellow-100 text-yellow-750 dark:bg-yellow-950/40 dark:text-yellow-300"
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

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
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
