"use client";

import Link from "next/link";
import { HiOutlineMail } from "react-icons/hi";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-900 items-center justify-center relative overflow-hidden">
        <div className="relative text-center text-white px-12">
          <span className="text-6xl mb-6 block">🔑</span>
          <h1 className="text-4xl font-extrabold mb-4">Forgot Password?</h1>
          <p className="text-lg text-primary-200 max-w-md">Don't worry! Enter your email and we'll send you a reset link.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <span className="text-4xl">🎓</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Tutor Lagbe</h1>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your registered email address</p>
          <form className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" required placeholder="you@example.com" className="input-field pl-11" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-3">Send Reset Link</button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-500">
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
