"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Navbar from "@/components/Navbar";
import { HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function TutorApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tuitions/my-applications");
      if (data.success) {
        setApplications(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
      toast.error("Failed to load your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex">
        <DashboardSidebar role="TUTOR" />

        <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
              আপনার আবেদন
            </span>
            <h1 className="font-display text-4xl font-semibold text-ink">Applied Tuition Jobs</h1>
            <p className="text-sm text-ink-muted mt-3">
              Track the status of your applications submitted for tuition postings.
            </p>
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse card h-40 hover:translate-y-0"
                ></div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="card text-center py-20 hover:translate-y-0">
              <span className="text-4xl">💼</span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">No Applications Yet</h3>
              <p className="mt-3 text-ink-muted">
                Browse available tuition postings and submit your applications to start.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const post = app.tuitionPost;
                if (!post) return null;
                return (
                  <div
                    key={app.id}
                    className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <span className="badge">
                            {post.tuitionType}
                          </span>
                          <span
                            className={
                              app.status === "PENDING"
                                ? "badge-warning"
                                : app.status === "ACCEPTED"
                                ? "badge-success"
                                : "badge-danger"
                            }
                          >
                            Status: {app.status}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-ink">
                          {post.title}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 text-xs text-ink-muted">
                        <div className="flex items-center gap-1.5">
                          <HiOutlineLocationMarker className="w-4 h-4 text-sage-700" />
                          <span>{post.locationArea}, {post.locationDistrict}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HiOutlineCurrencyDollar className="w-4 h-4 text-sage-700" />
                          <span>Offered: {post.salary} BDT</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HiOutlineCalendar className="w-4 h-4 text-sage-700" />
                          <span>{post.daysPerWeek} days/wk</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HiOutlineUser className="w-4 h-4 text-sage-700" />
                          <span>Class: {post.class} • {post.subject}</span>
                        </div>
                      </div>

                      <div className="bg-clay-light p-4 rounded-card text-xs leading-relaxed text-ink-muted border border-stone">
                        <span className="font-medium text-sage-700">My Proposal:</span> (Expected Salary: {app.expectedSalary} BDT)
                        <p className="mt-1 line-clamp-2 italic">"{app.coverLetter}"</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 self-stretch md:self-auto justify-between border-t border-stone md:border-t-0 pt-5 md:pt-0">
                      <div className="text-xs text-ink-muted">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs font-medium text-ink flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-full bg-clay/40 border border-stone overflow-hidden text-[10px] flex items-center justify-center font-display font-semibold text-primary-800">
                          {post.student?.avatarUrl ? (
                            <img src={post.student.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            post.student?.name?.charAt(0)
                          )}
                        </div>
                        <span>Student: {post.student?.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
