
"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import api from "@/lib/api";

export default function AdminSubPage({ params }: { params: { page: string } }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const limit = 20;

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
      }
    } catch (err) {
      console.error("Failed to verify tutor:", err);
    } finally {
      setActionLoadingId(null);
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
      if (params.page === "users" || params.page === "tutors" || params.page === "students" || params.page === "bookings") {
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
    if (params.page !== "users" && params.page !== "tutors" && params.page !== "students" && params.page !== "bookings") {
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
      return <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">{error}</div>;
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
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">No users found.</td>
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
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Verification Status</th>
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
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">৳{tutor.expectedSalary?.toLocaleString()}/mo</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          tutor.verificationStatus === "APPROVED" ? "bg-green-100 text-green-700" :
                          tutor.verificationStatus === "REJECTED" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {tutor.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={tutor.verificationStatus}
                          disabled={actionLoadingId === tutor.id}
                          onChange={(e) => handleVerify(tutor.id, e.target.value as "APPROVED" | "REJECTED" | "PENDING")}
                          className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-white font-medium"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
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
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">No students found.</td>
                  </tr>
                ) : (
                  data.map((student) => (
                    <tr key={student.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{student.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{student.email}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{student.phone || "N/A"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{new Date(student.createdAt).toLocaleDateString()}</td>
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
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="ADMIN" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Manage platform {params.page.toLowerCase()}</p>

          {/* Search and Filters */}
          {(params.page === "users" || params.page === "tutors" || params.page === "students" || params.page === "bookings") && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`Search ${params.page.toLowerCase()} by name, email...`}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-slate-900 dark:text-white"
                />
              </div>

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

          {!loading && !error && totalPages > 1 && (
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
    </div>
  );
}
