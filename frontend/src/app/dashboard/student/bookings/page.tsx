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

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="STUDENT" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-5xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">View and manage your tuition bookings</p>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 font-bold">
                    <HiOutlineBookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{booking.subject}</p>
                    <p className="text-sm text-slate-500">{booking.tutor} | {booking.date} at {booking.time} | {booking.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs ${
                    booking.status === "ACCEPTED" ? "badge-success" :
                    booking.status === "PENDING" ? "badge-warning" : "badge-primary"
                  }`}>{booking.status}</span>
                  <Link href={`/tutors/${booking.id}`} className="text-sm text-primary-600 font-medium hover:underline">
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
