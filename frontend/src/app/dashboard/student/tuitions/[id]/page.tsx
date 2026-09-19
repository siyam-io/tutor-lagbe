"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function TuitionPostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPostAndApplications = async () => {
    setLoading(true);
    try {
      const [postRes, appsRes] = await Promise.all([
        api.get(`/tuitions/${postId}`),
        api.get(`/tuitions/${postId}/applications`),
      ]);

      if (postRes.data.success) {
        setPost(postRes.data.data);
      }
      if (appsRes.data.success) {
        setApplications(appsRes.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load details:", err);
      toast.error("Failed to load tuition post details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostAndApplications();
    }
  }, [postId]);

  const handleStatusChange = async (appId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      const { data } = await api.put(`/tuitions/applications/${appId}/status`, { status });
      if (data.success) {
        toast.success(`Application ${status.toLowerCase()} successfully!`);
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status } : app))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update application status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-3xl mx-auto p-8 text-center space-y-4">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold">Tuition Post Not Found</h2>
          <button onClick={() => router.push("/dashboard/student/tuitions")} className="btn-primary py-2 px-4 text-sm font-semibold">
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <div className="flex">
        <DashboardSidebar role="STUDENT" />

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto space-y-8">
          {/* Back button */}
          <button
            onClick={() => router.push("/dashboard/student/tuitions")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-semibold"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to My Posts</span>
          </button>

          {/* Job Details Card */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-2">
                  {post.tuitionType}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{post.title}</h1>
              </div>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  post.status === "OPEN"
                    ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                Status: {post.status}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line text-sm leading-relaxed">
              {post.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <HiOutlineLocationMarker className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400">Location</div>
                  <span className="font-semibold">{post.locationArea}, {post.locationDistrict}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <HiOutlineCurrencyDollar className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400">Budget / Salary</div>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">{post.salary} BDT/m</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <HiOutlineCalendar className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400">Schedule</div>
                  <span className="font-semibold">{post.daysPerWeek} days/week</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <HiOutlineUser className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400">Gender Preference</div>
                  <span className="font-semibold">{post.genderPreference}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                Class: {post.class}
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                Subject: {post.subject}
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                Medium: {post.medium}
              </span>
            </div>
          </div>

          {/* Applications list */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>📋</span> Applications Received ({applications.length})
            </h2>

            {applications.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center text-slate-500 dark:text-slate-400 shadow-sm">
                No applications received for this post yet.
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    {/* Header: Tutor info */}
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          {app.tutorProfile?.user?.avatarUrl ? (
                            <img
                              src={app.tutorProfile.user.avatarUrl}
                              alt={app.tutorProfile.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center font-bold text-slate-500 uppercase text-lg">
                              {app.tutorProfile?.user?.name?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {app.tutorProfile?.user?.name}
                          </h4>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {app.tutorProfile?.qualification} • {app.tutorProfile?.institution}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-400">Expected Salary</div>
                        <span className="font-bold text-slate-900 dark:text-white">{app.expectedSalary} BDT</span>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      <div className="font-semibold text-xs text-slate-400 mb-1">Cover Letter:</div>
                      <p className="whitespace-pre-line">{app.coverLetter}</p>
                    </div>

                    {/* Actions / Status */}
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                      <div className="text-xs text-slate-500">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </div>

                      {app.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(app.id, "REJECTED")}
                            className="px-4 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950 dark:text-red-400 rounded-lg text-xs font-semibold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, "ACCEPTED")}
                            className="btn-primary py-1.5 px-4 text-xs font-semibold"
                          >
                            Accept Application
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            app.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          }`}
                        >
                          Status: {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
