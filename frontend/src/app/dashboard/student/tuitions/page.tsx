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
    <div className="min-h-screen">
      <Navbar />

      <div className="flex">
        <DashboardSidebar role="STUDENT" />

        <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                আপনার টিউশন পোস্ট
              </span>
              <h1 className="font-display text-4xl font-semibold text-ink">My Tuition Posts</h1>
              <p className="text-sm text-ink-muted mt-3">
                Manage your tuition jobs and review applications from tutors.
              </p>
            </div>
            <Link
              href="/dashboard/student/tuitions/new"
              className="btn-primary text-xs self-start sm:self-auto"
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
                  className="animate-pulse card h-32 hover:translate-y-0"
                ></div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="card text-center py-20 hover:translate-y-0">
              <span className="text-4xl">📝</span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">No Tuition Posts</h3>
              <p className="mt-3 text-ink-muted">
                You haven't created any tuition posts yet. Click the button above to create one.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg font-semibold text-ink hover:text-primary-800 transition-colors duration-300">
                        <Link href={`/dashboard/student/tuitions/${post.id}`}>{post.title}</Link>
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
                          post.status === "OPEN"
                            ? "bg-sage/15 border-sage/40 text-sage-800"
                            : "bg-clay-light border-stone text-ink-muted"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted">
                      <div className="flex items-center gap-1">
                        <HiOutlineLocationMarker className="w-4 h-4 text-sage-700" />
                        <span>
                          {post.locationArea}, {post.locationDistrict}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HiOutlineCurrencyDollar className="w-4 h-4 text-sage-700" />
                        <span className="font-semibold">{post.salary} BDT/month</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary-800 font-medium">
                        <HiOutlineUsers className="w-4 h-4" />
                        <span>{post._count?.applications || 0} Tutors Applied</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto border-t border-stone md:border-t-0 pt-5 md:pt-0 mt-2 md:mt-0">
                    <Link
                      href={`/dashboard/student/tuitions/${post.id}`}
                      className="btn-outline text-[11px] flex-1 md:flex-initial"
                    >
                      View Applications
                    </Link>

                    <button
                      onClick={() => toggleStatus(post)}
                      className={`text-[11px] py-2.5 px-5 rounded-full border font-medium flex-1 md:flex-initial text-center transition-colors duration-300 ${
                        post.status === "OPEN"
                          ? "border-ochre text-ochre-800 hover:bg-ochre/10"
                          : "border-sage text-sage-800 hover:bg-sage/10"
                      }`}
                    >
                      {post.status === "OPEN" ? "Close Post" : "Open Post"}
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="border border-terracotta/40 text-terracotta-800 hover:bg-terracotta/10 text-[11px] py-2.5 px-5 rounded-full font-medium flex-1 md:flex-initial text-center transition-colors duration-300"
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
