"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { LuGraduationCap } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.success && data.data) {
        setAuth(data.data.user, data.data.token);
        const role = data.data.user.role;
        if (role === "ADMIN") {
          window.location.href = "/admin";
        } else if (role === "TUTOR") {
          window.location.href = "/dashboard/tutor";
        } else {
          window.location.href = "/dashboard/student";
        }
      } else {
        setError(data.error || "Login failed");
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
        {/* Botanical arch rings */}
        <div className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full border border-sage/20" />
        <div className="absolute -bottom-40 -right-20 w-[28rem] h-[28rem] rounded-full border border-white/10" />

        <div className="relative text-center text-white px-12">
          <img
            src="/logo.png"
            alt="Tutor Lagbe Logo"
            className="w-20 h-20 rounded-2xl mx-auto mb-6 shadow-md object-cover"
          />
          <h1 className="font-display text-5xl font-semibold mb-4">
            Tutor Lagbe
          </h1>
          <p className="text-xl font-bangla text-sage-300 mb-3">টিউটর লাগবে</p>
          <p className="text-lg text-white/60 mt-6 max-w-md leading-relaxed">
            Your trusted platform to find verified tutors across Bangladesh.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <img
              src="/logo.png"
              alt="Tutor Lagbe"
              className="w-14 h-14 rounded-2xl mx-auto mb-2 shadow-xs object-cover"
            />
            <h1 className="font-display text-2xl font-semibold text-ink mt-3">
              Tutor Lagbe
            </h1>
          </div>

          <h2 className="font-display text-3xl font-semibold text-ink mb-2">
            Welcome Back
          </h2>
          <p className="text-ink-muted mb-8">
            Sign in to your account to continue
          </p>

          {/* Tab */}
          <div className="flex bg-clay-light border border-stone rounded-full p-1 mb-8">
            {(["STUDENT", "TUTOR"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-primary-800 text-white"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {tab === "STUDENT" ? "Student Login" : "Tutor Login"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-terracotta/10 border border-terracotta/30 text-terracotta-800 text-sm px-4 py-3 rounded-card mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded-full accent-primary-800 w-4 h-4"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary-700 hover:text-primary-800 font-medium transition-colors duration-300"
              >
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-canvas text-ink-muted">
                or continue with
              </span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-stone rounded-full text-ink hover:bg-clay-light transition-colors duration-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </button>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary-700 hover:text-primary-800 font-medium transition-colors duration-300"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
