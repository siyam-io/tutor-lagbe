"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import api from "@/lib/api";
import { HiOutlineClipboardList } from "react-icons/hi";

export default function TutorRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/bookings/tutor");
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (bookingId: string, status: "ACCEPTED" | "REJECTED") => {
    setActionLoadingId(bookingId);
    try {
      const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
      if (data.success) {
        setRequests((prev) =>
          prev.map((req) => (req.id === bookingId ? { ...req, status } : req))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update booking status");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="TUTOR" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-5xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Tuition Requests</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Manage incoming booking requests from students</p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-slate-500 mt-2">Loading requests...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center mb-8">{error}</div>
          ) : (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="card text-center py-12 text-slate-500">
                  <HiOutlineClipboardList className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                  <p className="font-medium">No booking requests found.</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                        {req.student?.name ? req.student.name.split(" ").map((n: string) => n[0]).join("") : "S"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{req.student?.name || "Student"}</p>
                        <p className="text-sm text-slate-500">
                          {req.notes || "Tuition request"} | {req.tuitionType} | Slot: {req.timeSlot}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Requested date: {new Date(req.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {req.status === "PENDING" ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req.id, "ACCEPTED")}
                            disabled={actionLoadingId === req.id}
                            className="btn-primary text-sm py-1.5 px-4"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                            disabled={actionLoadingId === req.id}
                            className="btn-secondary text-sm py-1.5 px-4"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          req.status === "ACCEPTED" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
                          req.status === "REJECTED" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                        }`}>{req.status}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

