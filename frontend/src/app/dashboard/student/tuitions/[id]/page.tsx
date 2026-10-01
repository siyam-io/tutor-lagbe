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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone border-t-primary-800"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-3xl mx-auto p-8 text-center space-y-5">
          <span className="text-4xl">⚠️</span>
          <h2 className="font-display text-2xl font-semibold text-ink">Tuition Post Not Found</h2>
          <button onClick={() => router.push("/dashboard/student/tuitions")} className="btn-primary text-xs">
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex">
        <DashboardSidebar role="STUDENT" />

        <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto space-y-10">
          {/* Back button */}
          <button
            onClick={() => router.push("/dashboard/student/tuitions")}
            className="flex items-center gap-2 text-ink-muted hover:text-primary-800 transition-colors duration-300 text-sm font-medium"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to My Posts</span>
          </button>

          {/* Job Details Card */}
          <div className="card p-8 space-y-6 hover:translate-y-0">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="badge-primary mb-4">
                  {post.tuitionType}
                </span>
                <h1 className="font-display text-3xl font-semibold text-ink">{post.title}</h1>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border ${
                  post.status === "OPEN"
                    ? "bg-sage/15 border-sage/40 text-sage-800"
                    : "bg-clay-light border-stone text-ink-muted"
                }`}
              >
                Status: {post.status}
              </span>
            </div>

            <p className="text-ink-muted whitespace-pre-line text-sm leading-relaxed">
              {post.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 border-t border-b border-stone py-6 text-sm">
              <div className="flex items-center gap-2 text-ink-muted">
                <HiOutlineLocationMarker className="w-5 h-5 text-sage-700" />
                <div>
                  <div className="text-xs text-ink-muted">Location</div>
                  <span className="font-medium text-ink">{post.locationArea}, {post.locationDistrict}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-ink-muted">
                <HiOutlineCurrencyDollar className="w-5 h-5 text-sage-700" />
                <div>
                  <div className="text-xs text-ink-muted">Budget / Salary</div>
                  <span className="font-medium text-primary-800">{post.salary} BDT/m</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-ink-muted">
                <HiOutlineCalendar className="w-5 h-5 text-sage-700" />
                <div>
                  <div className="text-xs text-ink-muted">Schedule</div>
                  <span className="font-medium text-ink">{post.daysPerWeek} days/week</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-ink-muted">
                <HiOutlineUser className="w-5 h-5 text-sage-700" />
                <div>
                  <div className="text-xs text-ink-muted">Gender Preference</div>
                  <span className="font-medium text-ink">{post.genderPreference}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="badge">
                Class: {post.class}
              </span>
              <span className="badge">
                Subject: {post.subject}
              </span>
              <span className="badge">
                Medium: {post.medium}
              </span>
            </div>
          </div>

          {/* Applications list */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
              <span>📋</span> Applications Received ({applications.length})
            </h2>

            {applications.length === 0 ? (
              <div className="card p-8 text-center text-ink-muted hover:translate-y-0">
                No applications received for this post yet.
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="card p-6 space-y-5 hover:translate-y-0"
                  >
                    {/* Header: Tutor info */}
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-image bg-clay/40 border border-stone overflow-hidden">
                          {app.tutorProfile?.user?.avatarUrl ? (
                            <img
                              src={app.tutorProfile.user.avatarUrl}
                              alt={app.tutorProfile.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center font-display font-semibold text-primary-800 uppercase text-lg">
                              {app.tutorProfile?.user?.name?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-ink">
                            {app.tutorProfile?.user?.name}
                          </h4>
                          <div className="text-xs text-ink-muted">
                            {app.tutorProfile?.qualification} • {app.tutorProfile?.institution}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-ink-muted">Expected Salary</div>
                        <span className="font-display font-semibold text-ink">{app.expectedSalary} BDT</span>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="bg-clay-light border border-stone p-5 rounded-card text-sm leading-relaxed text-ink-muted">
                      <div className="font-medium text-xs text-sage-700 mb-2">Cover Letter:</div>
                      <p className="whitespace-pre-line">{app.coverLetter}</p>
                    </div>

                    {/* Actions / Status */}
                    <div className="flex items-center justify-between border-t border-stone pt-5">
                      <div className="text-xs text-ink-muted">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </div>

                      {app.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(app.id, "REJECTED")}
                            className="px-5 py-2 border border-terracotta/40 text-terracotta-800 hover:bg-terracotta/10 rounded-full text-xs font-medium transition-colors duration-300"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, "ACCEPTED")}
                            className="btn-primary text-[11px]"
                          >
                            Accept Application
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full border ${
                            app.status === "ACCEPTED"
                              ? "bg-sage/15 border-sage/40 text-sage-800"
                              : "bg-terracotta/10 border-terracotta/40 text-terracotta-800"
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
