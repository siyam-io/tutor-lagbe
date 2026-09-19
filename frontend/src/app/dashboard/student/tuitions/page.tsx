"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { HiOutlinePlus, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineUsers } from "react-icons/hi";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function StudentTuitionsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tuitions/my-posts");
      if (data.success) {
        setPosts(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch my posts:", err);
      toast.error("Failed to load your tuition posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this tuition post? This action cannot be undone.")) return;
    try {
      const { data } = await api.delete(`/tuitions/${postId}`);
      if (data.success) {
        toast.success("Post deleted successfully");
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error("Failed to delete the tuition post");
    }
  };

  const toggleStatus = async (post: any) => {
    const newStatus = post.status === "OPEN" ? "CLOSED" : "OPEN";
    try {
      const { data } = await api.put(`/tuitions/${post.id}`, { status: newStatus });
      if (data.success) {
        toast.success(`Post status updated to ${newStatus}`);
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update post status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <div className="flex">
        <DashboardSidebar role="STUDENT" />

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Tuition Posts</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage your tuition jobs and review applications from tutors.
              </p>
            </div>
            <Link
              href="/dashboard/student/tuitions/new"
              className="btn-primary py-2.5 px-4 font-semibold text-sm flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <HiOutlinePlus className="w-5 h-5" />
              <span>Create Tuition Post</span>
            </Link>
          </div>

          {/* Table / List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-slate-900 h-32 border border-slate-200 dark:border-slate-800 rounded-2xl"
                ></div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-4xl">📝</span>
              <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">No Tuition Posts</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                You haven't created any tuition posts yet. Click the button above to create one.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors">
                        <Link href={`/dashboard/student/tuitions/${post.id}`}>{post.title}</Link>
                      </h3>
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-lg ${
                          post.status === "OPEN"
                            ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                        <span>
                          {post.locationArea}, {post.locationDistrict}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HiOutlineCurrencyDollar className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold">{post.salary} BDT/month</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold">
                        <HiOutlineUsers className="w-4 h-4" />
                        <span>{post._count?.applications || 0} Tutors Applied</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                    <Link
                      href={`/dashboard/student/tuitions/${post.id}`}
                      className="btn-outline text-xs py-2 px-3 flex-1 md:flex-initial text-center"
                    >
                      View Applications
                    </Link>

                    <button
                      onClick={() => toggleStatus(post)}
                      className={`text-xs py-2 px-3 rounded-lg border font-semibold flex-1 md:flex-initial text-center transition-colors ${
                        post.status === "OPEN"
                          ? "border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-950 dark:text-amber-400 dark:hover:bg-amber-950/30"
                          : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-950 dark:text-green-400 dark:hover:bg-green-950/30"
                      }`}
                    >
                      {post.status === "OPEN" ? "Close Post" : "Open Post"}
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/30 text-xs py-2 px-3 rounded-lg font-semibold flex-1 md:flex-initial text-center transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
