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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <div className="flex">
        <DashboardSidebar role="TUTOR" />

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Applied Tuition Jobs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track the status of your applications submitted for tuition postings.
            </p>
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-slate-900 h-40 border border-slate-200 dark:border-slate-800 rounded-2xl"
                ></div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-4xl">💼</span>
              <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">No Applications Yet</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
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
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800">
                            {post.tuitionType}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                              app.status === "PENDING"
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                                : app.status === "ACCEPTED"
                                ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                            }`}
                          >
                            Status: {app.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {post.title}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                          <span>{post.locationArea}, {post.locationDistrict}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HiOutlineCurrencyDollar className="w-4 h-4 text-slate-400" />
                          <span>Offered: {post.salary} BDT</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                          <span>{post.daysPerWeek} days/wk</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HiOutlineUser className="w-4 h-4 text-slate-400" />
                          <span>Class: {post.class} • {post.subject}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg text-xs leading-relaxed text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-400">My Proposal:</span> (Expected Salary: {app.expectedSalary} BDT)
                        <p className="mt-1 line-clamp-2 italic">"{app.coverLetter}"</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="text-xs text-slate-400">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden text-[10px] flex items-center justify-center font-bold">
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
