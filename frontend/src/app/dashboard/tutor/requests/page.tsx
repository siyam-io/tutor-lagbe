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
    <div className="flex min-h-screen">
      <DashboardSidebar role="TUTOR" />
      <div className="flex-1 p-6 lg:p-12">
        <div className="max-w-5xl">
          <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
            বুকিং রিকোয়েস্ট
          </span>
          <h1 className="font-display text-4xl font-semibold text-ink mb-3">Tuition Requests</h1>
          <p className="text-ink-muted mb-12">Manage incoming booking requests from students</p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone border-t-primary-800 mx-auto"></div>
              <p className="text-ink-muted mt-4">Loading requests...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta-800 rounded-card text-center mb-8">{error}</div>
          ) : (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="card text-center py-16 text-ink-muted hover:translate-y-0">
                  <HiOutlineClipboardList className="w-12 h-12 mx-auto text-stone mb-4" />
                  <p className="font-display text-lg font-medium">No booking requests found.</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-image bg-clay/40 border border-stone flex items-center justify-center font-display font-semibold text-primary-800">
                        {req.student?.name ? req.student.name.split(" ").map((n: string) => n[0]).join("") : "S"}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-ink">{req.student?.name || "Student"}</p>
                        <p className="text-sm text-ink-muted">
                          {req.notes || "Tuition request"} | {req.tuitionType} | Slot: {req.timeSlot}
                        </p>
                        <p className="text-xs text-ink-muted mt-1">
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
                            className="btn-primary text-[11px]"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                            disabled={actionLoadingId === req.id}
                            className="btn-outline text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={
                          req.status === "ACCEPTED"
                            ? "badge-success"
                            : req.status === "REJECTED"
                            ? "badge-danger"
                            : "badge-warning"
                        }>{req.status}</span>
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

