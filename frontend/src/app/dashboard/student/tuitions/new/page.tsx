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
    <div className="min-h-screen">
      <Navbar />

      <div className="flex">
        <DashboardSidebar role="STUDENT" />

        <main className="flex-1 p-6 md:p-12 max-w-3xl mx-auto">
          {/* Back btn */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-ink-muted hover:text-primary-800 transition-colors duration-300 mb-8 text-sm font-medium"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
              নতুন টিউশন পোস্ট
            </span>
            <h1 className="font-display text-4xl font-semibold text-ink">Create Tuition Post</h1>
            <p className="text-sm text-ink-muted mt-3">
              Provide details about your tuition needs. Tutors will apply based on this information.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="card p-8 space-y-7 hover:translate-y-0"
          >
            {/* Title */}
            <div>
              <label className="label">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Need experienced Tutor for Class 9 Student (Science Group)"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">
                Detailed Description *
              </label>
              <textarea
                name="description"
                rows={5}
                placeholder="Describe your student's needs, special requests, preferred teaching slots, class timings..."
                value={formData.description}
                onChange={handleChange}
                className="input-field text-sm leading-relaxed"
                required
              ></textarea>
            </div>

            {/* Subject & Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
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
                <label className="label">
                  Class / Grade *
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="input-field"
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
                <label className="label">
                  Medium *
                </label>
                <select
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                  className="input-field"
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
                <label className="label">
                  Tuition Type *
                </label>
                <select
                  name="tuitionType"
                  value={formData.tuitionType}
                  onChange={handleChange}
                  className="input-field"
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
                <label className="label">
                  District *
                </label>
                <select
                  name="locationDistrict"
                  value={formData.locationDistrict}
                  onChange={handleChange}
                  className="input-field"
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
                <label className="label">
                  Specific Area *
                </label>
                <input
                  type="text"
                  name="locationArea"
                  placeholder="e.g. Dhanmondi, Road 12"
                  value={formData.locationArea}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Salary, Days, Gender Preference */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">
                  Salary (BDT/month) *
                </label>
                <input
                  type="number"
                  name="salary"
                  placeholder="e.g. 6000"
                  value={formData.salary}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">
                  Days Per Week *
                </label>
                <select
                  name="daysPerWeek"
                  value={formData.daysPerWeek}
                  onChange={handleChange}
                  className="input-field"
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
                <label className="label">
                  Tutor Gender Preference
                </label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="ANY">Any Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-7 border-t border-stone">
              <button
                type="button"
                onClick={() => router.push("/dashboard/student/tuitions")}
                className="btn-outline text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs"
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
