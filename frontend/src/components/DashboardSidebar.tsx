"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineChat,
  HiOutlineCreditCard,
  HiOutlineStar,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineHeart,
} from "react-icons/hi";

interface SidebarProps {
  role: "STUDENT" | "TUTOR" | "ADMIN";
}

const studentLinks = [
  { href: "/dashboard/student", label: "Dashboard", icon: HiOutlineHome },
  { href: "/dashboard/student/bookings", label: "My Bookings", icon: HiOutlineBookOpen },
  { href: "/dashboard/student/tuitions", label: "My Tuition Posts", icon: HiOutlineClipboardList },
  { href: "/wishlist", label: "My Wishlist", icon: HiOutlineHeart },
  { href: "/schedule", label: "Schedule", icon: HiOutlineCalendar },
  { href: "/messages", label: "Messages", icon: HiOutlineChat },
  { href: "/payments", label: "Payments", icon: HiOutlineCreditCard },
  { href: "/reviews", label: "Reviews", icon: HiOutlineStar },
  { href: "/settings", label: "Settings", icon: HiOutlineCog },
];

const tutorLinks = [
  { href: "/dashboard/tutor", label: "Dashboard", icon: HiOutlineHome },
  { href: "/dashboard/tutor/analytics", label: "Analytics", icon: HiOutlineChartBar },
  { href: "/dashboard/tutor/earnings", label: "Earnings", icon: HiOutlineCurrencyDollar },
  { href: "/dashboard/tutor/requests", label: "Requests", icon: HiOutlineClipboardList },
  { href: "/dashboard/tutor/applications", label: "Applied Jobs", icon: HiOutlineClipboardList },
  { href: "/schedule", label: "Schedule", icon: HiOutlineCalendar },
  { href: "/messages", label: "Messages", icon: HiOutlineChat },
  { href: "/settings", label: "Settings", icon: HiOutlineCog },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: HiOutlineHome },
  { href: "/admin/users", label: "Users", icon: HiOutlineUserGroup },
  { href: "/admin/tutors", label: "Tutors", icon: HiOutlineShieldCheck },
  { href: "/admin/students", label: "Students", icon: HiOutlineUserGroup },
  { href: "/admin/bookings", label: "Bookings", icon: HiOutlineClipboardList },
  { href: "/admin/payments", label: "Payments", icon: HiOutlineCreditCard },
  { href: "/admin/reports", label: "Reports", icon: HiOutlineChartBar },
  { href: "/settings", label: "Settings", icon: HiOutlineCog },
];

const linksByRole = {
  STUDENT: studentLinks,
  TUTOR: tutorLinks,
  ADMIN: adminLinks,
};

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = linksByRole[role];

  return (
    <aside className="w-64 min-h-screen bg-white/60 border-r border-stone hidden lg:block">
      <div className="p-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 mb-10 hover:opacity-80 transition-opacity duration-300"
        >
          <span className="text-2xl">🎓</span>
          <span className="font-display font-semibold text-lg text-ink">
            Tutor Lagbe
          </span>
        </Link>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn("sidebar-link", isActive && "active")}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 pt-6 border-t border-stone">
          <Link href="/notifications" className="sidebar-link">
            <HiOutlineBell className="w-5 h-5 flex-shrink-0" />
            <span>Notifications</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
