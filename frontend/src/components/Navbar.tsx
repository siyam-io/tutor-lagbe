"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LuGraduationCap,
  LuSearch,
  LuBriefcase,
  LuInfo,
  LuPhone,
  LuMessageSquare,
  LuUser,
  LuLogOut,
  LuMenu,
  LuX,
  LuLayoutDashboard,
} from "react-icons/lu";
import { useAuthStore } from "@/store/auth.store";

const publicNavLinks = [
  { href: "/find-tutor", label: "Find Tutors", icon: LuSearch },
  { href: "/tuitions", label: "Tuition Jobs", icon: LuBriefcase },
  { href: "/about", label: "About", icon: LuInfo },
  { href: "/contact", label: "Contact", icon: LuPhone },
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

  const roleLabel =
    user?.role === "TUTOR"
      ? "Tutor"
      : user?.role === "ADMIN"
      ? "Admin"
      : "Student";

  return (
    <nav className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-stone/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-primary-800 text-cream flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-primary-900 transition-all duration-300">
              <LuGraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-ink group-hover:text-primary-800 transition-colors duration-300">
                Tutor Lagbe
              </span>
              <span className="text-[11px] text-ink-muted font-bangla -mt-0.5 tracking-wide">
                টিউটর লাগবে
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {publicNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-800 font-semibold"
                      : "text-ink-muted hover:text-primary-800 hover:bg-clay-light/60"
                  )}
                >
                  <Icon className="w-4 h-4 text-ink-muted/80" />
                  {link.label}
                </Link>
              );
            })}

            {/* When logged in: direct link to Messages */}
            {isAuthenticated && (
              <Link
                href="/messages"
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  pathname === "/messages"
                    ? "bg-primary-50 text-primary-800 font-semibold"
                    : "text-ink-muted hover:text-primary-800 hover:bg-clay-light/60"
                )}
              >
                <LuMessageSquare className="w-4 h-4 text-ink-muted/80" />
                Messages
              </Link>
            )}
          </div>

          {/* Desktop Right Side / Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* User Dashboard Pill */}
                <Link
                  href={dashboardHref}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium border border-stone/80 hover:border-primary-700 bg-white/60 hover:bg-white shadow-xs transition-all duration-200",
                    pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
                      ? "ring-2 ring-primary-700/20 border-primary-700 text-primary-800"
                      : "text-ink"
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <LuUser className="w-3.5 h-3.5" />}
                  </div>
                  <span className="max-w-[120px] truncate font-medium">{user?.name || "My Account"}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold bg-primary-50 text-primary-700">
                    {roleLabel}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2.5 rounded-full text-ink-muted hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200"
                >
                  <LuLogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-ink hover:text-primary-800 hover:bg-clay-light/60 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-xs py-2.5 px-5 font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              className="p-2.5 rounded-xl text-ink hover:bg-clay-light focus:outline-none transition-colors duration-200"
            >
              {mobileOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone/60 bg-canvas/98 px-4 py-5 space-y-2 animate-slide-up shadow-lg">
          {publicNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-50 text-primary-800 font-semibold"
                    : "text-ink hover:bg-clay-light/60"
                )}
              >
                <Icon className="w-5 h-5 text-ink-muted" />
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated && (
            <Link
              href="/messages"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                pathname === "/messages"
                  ? "bg-primary-50 text-primary-800 font-semibold"
                  : "text-ink hover:bg-clay-light/60"
              )}
            >
              <LuMessageSquare className="w-5 h-5 text-ink-muted" />
              Messages
            </Link>
          )}

          {/* Mobile Auth Actions */}
          <div className="pt-4 border-t border-stone/60 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary-50 text-primary-800 text-sm font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <LuLayoutDashboard className="w-5 h-5 text-primary-700" />
                    <span>{user?.name || "Dashboard"}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white text-primary-700">
                    {roleLabel}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                >
                  <LuLogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 px-4 rounded-xl border border-stone text-sm font-medium text-ink hover:bg-clay-light transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 px-4 rounded-xl bg-primary-800 text-white text-sm font-semibold hover:bg-primary-900 transition-colors shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
