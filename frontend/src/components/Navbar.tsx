"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineChat,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuthStore } from "@/store/auth.store";

const navLinks = [
  { href: "/", label: "Home", icon: HiOutlineHome },
  { href: "/find-tutor", label: "Find Tutor", icon: HiOutlineSearch },
  { href: "/tuitions", label: "Tuition Jobs", icon: HiOutlineClipboardList },
  { href: "/schedule", label: "Schedule", icon: HiOutlineCalendar },
  { href: "/messages", label: "Messages", icon: HiOutlineChat },
  { href: "/notifications", label: "Notifications", icon: HiOutlineBell },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🎓</span>
            <div>
              <span className="font-bold text-xl text-primary-600 group-hover:text-primary-700 transition-colors">
                Tutor Lagbe
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-1 font-bangla">
                টিউটর লাগবে
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
                    : "text-slate-600 hover:text-primary-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={
                    user?.role === "TUTOR"
                      ? "/dashboard/tutor"
                      : user?.role === "ADMIN"
                      ? "/admin"
                      : "/dashboard/student"
                  }
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                >
                  <HiOutlineUser className="w-4 h-4" />
                  {user?.role === "TUTOR"
                    ? "Tutor Dashboard"
                    : user?.role === "ADMIN"
                    ? "Admin Dashboard"
                    : "Student Dashboard"}
                </Link>
                <button
                  onClick={logout}
                  className="btn-outline text-sm py-2 px-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline text-sm py-2 px-4">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950"
                    : "text-slate-600 dark:text-slate-400"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              {isAuthenticated ? (
                <>
                  <Link
                    href={
                      user?.role === "TUTOR"
                        ? "/dashboard/tutor"
                        : user?.role === "ADMIN"
                        ? "/admin"
                        : "/dashboard/student"
                    }
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    <HiOutlineUser className="w-5 h-5" />
                    {user?.role === "TUTOR"
                      ? "Tutor Dashboard"
                      : user?.role === "ADMIN"
                      ? "Admin Dashboard"
                      : "Student Dashboard"}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full mt-2 btn-outline text-sm py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 btn-outline text-sm text-center py-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 btn-primary text-sm text-center py-2"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
