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

  const dashboardHref =
    user?.role === "TUTOR"
      ? "/dashboard/tutor"
      : user?.role === "ADMIN"
      ? "/admin"
      : "/dashboard/student";

  const dashboardLabel =
    user?.role === "TUTOR"
      ? "Tutor Dashboard"
      : user?.role === "ADMIN"
      ? "Admin Dashboard"
      : "Student Dashboard";

  return (
    <nav className="sticky top-0 z-50 bg-canvas/85 backdrop-blur-lg border-b border-stone">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl">🎓</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-semibold text-xl text-ink group-hover:text-primary-800 transition-colors duration-300">
                Tutor Lagbe
              </span>
              <span className="hidden sm:inline text-xs text-ink-muted font-bangla">
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
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  pathname === link.href
                    ? "bg-sage/15 text-primary-800"
                    : "text-ink-muted hover:text-primary-800 hover:bg-clay-light"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-sage/15 text-sage-800 hover:bg-sage/25 transition-colors duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-bangla-green" />
              <span className="font-bangla">টিউশন জবসমূহ</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium text-ink-muted hover:text-primary-800 hover:bg-clay-light transition-colors duration-300"
                >
                  <HiOutlineUser className="w-4 h-4" />
                  {dashboardLabel}
                </Link>
                <button
                  onClick={logout}
                  className="btn-outline text-xs py-2.5 px-5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline text-xs py-2.5 px-5">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-xs py-2.5 px-5">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            className="md:hidden p-2.5 rounded-full text-ink hover:bg-clay-light transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone animate-slide-up">
          <div className="px-4 py-5 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300",
                  pathname === link.href
                    ? "bg-sage/15 text-primary-800"
                    : "text-ink-muted hover:text-primary-800 hover:bg-clay-light"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-stone">
              {isAuthenticated ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-ink-muted hover:text-primary-800 hover:bg-clay-light transition-colors duration-300"
                  >
                    <HiOutlineUser className="w-5 h-5" />
                    {dashboardLabel}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full mt-3 btn-outline text-xs py-3"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 btn-outline text-xs"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 btn-primary text-xs"
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
