"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { SUBJECTS, CLASSES, MEDIUMS, DISTRICTS } from "@shared/types";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function NewTuitionPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    class: "",
    medium: "",
    locationDistrict: "",
    locationArea: "",
    salary: "",
    daysPerWeek: "3",
    genderPreference: "ANY",
    tuitionType: "OFFLINE",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.subject || !formData.class || !formData.medium || !formData.locationDistrict || !formData.locationArea || !formData.salary) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/tuitions", {
        ...formData,
        salary: Number(formData.salary),
        daysPerWeek: Number(formData.daysPerWeek),
      });

      if (data.success) {
        toast.success("Tuition post created successfully!");
        router.push("/dashboard/student/tuitions");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create tuition post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <div className="flex">
        <DashboardSidebar role="STUDENT" />

        <main className="flex-1 p-6 md:p-8 max-w-3xl mx-auto">
          {/* Back btn */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 text-sm font-semibold"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Create Tuition Post</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Provide details about your tuition needs. Tutors will apply based on this information.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Need experienced Tutor for Class 9 Student (Science Group)"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Detailed Description *
              </label>
              <textarea
                name="description"
                rows={5}
                placeholder="Describe your student's needs, special requests, preferred teaching slots, class timings..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 text-sm leading-relaxed"
                required
              ></textarea>
            </div>

            {/* Subject & Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Class / Grade *
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Class</option>
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medium & Tuition Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Medium *
                </label>
                <select
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Medium</option>
                  {MEDIUMS.map((med) => (
                    <option key={med} value={med}>
                      {med}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Tuition Type *
                </label>
                <select
                  name="tuitionType"
                  value={formData.tuitionType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="OFFLINE">Offline (Home Tuition)</option>
                  <option value="ONLINE">Online</option>
                </select>
              </div>
            </div>

            {/* District & Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  District *
                </label>
                <select
                  name="locationDistrict"
                  value={formData.locationDistrict}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select District</option>
                  {DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Specific Area *
                </label>
                <input
                  type="text"
                  name="locationArea"
                  placeholder="e.g. Dhanmondi, Road 12"
                  value={formData.locationArea}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            {/* Salary, Days, Gender Preference */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Salary (BDT/month) *
                </label>
                <input
                  type="number"
                  name="salary"
                  placeholder="e.g. 6000"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Days Per Week *
                </label>
                <select
                  name="daysPerWeek"
                  value={formData.daysPerWeek}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <option key={num} value={num}>
                      {num} days/week
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Tutor Gender Preference
                </label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ANY">Any Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => router.push("/dashboard/student/tuitions")}
                className="px-6 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8 py-2.5 rounded-xl text-sm font-semibold"
              >
                {submitting ? "Creating..." : "Post Tuition"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
