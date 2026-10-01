"use client";

import Link from "next/link";
import { HiOutlineMail } from "react-icons/hi";
import { LuKeyRound, LuGraduationCap } from "react-icons/lu";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary-800 items-center justify-center relative overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full border border-sage/20" />
        <div className="absolute -bottom-40 -right-20 w-[28rem] h-[28rem] rounded-full border border-white/10" />

        <div className="relative text-center text-white px-12">
          <div className="w-16 h-16 rounded-2xl bg-white/10 text-cream flex items-center justify-center mx-auto mb-6 shadow-sm">
            <LuKeyRound className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl font-semibold mb-4">
            Forgot Password?
          </h1>
          <p className="text-lg text-white/60 max-w-md leading-relaxed">
            Don&apos;t worry! Enter your email and we&apos;ll send you a reset
            link.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
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
            Reset Password
          </h2>
          <p className="text-ink-muted mb-8">
            Enter your registered email address
          </p>

          <form className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="input-field pl-12"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Reset Link
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-muted">
            <Link
              href="/login"
              className="text-primary-700 hover:text-primary-800 font-medium transition-colors duration-300"
            >
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
