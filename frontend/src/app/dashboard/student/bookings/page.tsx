"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { HiOutlineBookOpen } from "react-icons/hi";

export default function StudentBookingsPage() {
  const bookings = [
    { id: "1", tutor: "Md. Rahman", subject: "Mathematics", date: "2024-01-20", time: "10:00 AM", status: "ACCEPTED", type: "Offline" },
    { id: "2", tutor: "Fatema Akter", subject: "Physics", date: "2024-01-21", time: "2:00 PM", status: "PENDING", type: "Online" },
    { id: "3", tutor: "Tanvir Hasan", subject: "English", date: "2024-01-15", time: "11:00 AM", status: "COMPLETED", type: "Offline" },
  ];

  const statusClass = (status: string) =>
    status === "ACCEPTED"
      ? "badge-success"
      : status === "PENDING"
      ? "badge-warning"
      : "badge-primary";

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="STUDENT" />
      <div className="flex-1 p-6 lg:p-12">
        <div className="max-w-5xl">
          <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
            আপনার বুকিং
          </span>
          <h1 className="font-display text-4xl font-semibold text-ink mb-3">
            My Bookings
          </h1>
          <p className="text-ink-muted mb-12">
            View and manage your tuition bookings
          </p>

          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="card flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4">
                  <span className="stat-icon">
                    <HiOutlineBookOpen className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-display font-semibold text-ink">
                      {booking.subject}
                    </p>
                    <p className="text-sm text-ink-muted mt-0.5">
                      {booking.tutor} | {booking.date} at {booking.time} |{" "}
                      {booking.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={statusClass(booking.status)}>
                    {booking.status}
                  </span>
                  <Link
                    href={`/tutors/${booking.id}`}
                    className="text-sm text-primary-700 font-medium hover:text-primary-800 transition-colors duration-300"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
