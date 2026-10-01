"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { LuGraduationCap } from "react-icons/lu";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

export default function RegisterPage() {
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { ...form, role });
      if (data.success && data.data) {
        setAuth(data.data.user, data.data.token);
        if (role === "TUTOR") {
          window.location.href = "/dashboard/tutor";
        } else {
          window.location.href = "/dashboard/student";
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-800 items-center justify-center relative overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full border border-sage/20" />
        <div className="absolute -bottom-40 -right-20 w-[28rem] h-[28rem] rounded-full border border-white/10" />

        <div className="relative text-center text-white px-12">
          <div className="w-16 h-16 rounded-2xl bg-white/10 text-cream flex items-center justify-center mx-auto mb-6 shadow-sm">
            <LuGraduationCap className="w-9 h-9" />
          </div>
          <h1 className="font-display text-5xl font-semibold mb-4">
            Tutor Lagbe
          </h1>
          <p className="text-xl font-bangla text-sage-300 mb-3">টিউটর লাগবে</p>
          <p className="text-lg text-white/60 mt-6 max-w-md leading-relaxed">
            Create your account and start your learning journey today!
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <div className="w-12 h-12 rounded-xl bg-primary-800 text-cream flex items-center justify-center mx-auto mb-3 shadow-xs">
              <LuGraduationCap className="w-7 h-7" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink mt-3">
              Tutor Lagbe
            </h1>
          </div>

          <h2 className="font-display text-3xl font-semibold text-ink mb-2">
            Create Account
          </h2>
          <p className="text-ink-muted mb-8">
            Join our community of learners and tutors
          </p>

          {/* Role Switch */}
          <div className="flex bg-clay-light border border-stone rounded-full p-1 mb-8">
            {(["STUDENT", "TUTOR"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  role === r
                    ? "bg-primary-800 text-white"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {r === "STUDENT" ? "🎓 Student" : "👨‍🏫 Tutor"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-terracotta/10 border border-terracotta/30 text-terracotta-800 text-sm px-4 py-3 rounded-card mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Enter your full name"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="label">Phone Number (Optional)</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="+880 1XXX-XXXXXX"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Min. 6 characters"
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Re-enter your password"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-4"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-700 hover:text-primary-800 font-medium transition-colors duration-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
