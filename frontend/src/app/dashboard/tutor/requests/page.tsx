"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { HiOutlineClipboardList } from "react-icons/hi";

export default function TutorRequestsPage() {
  const requests = [
    { id: "1", student: "Rafiq Hasan", subject: "Mathematics", classSlot: "Class 10", time: "Sat 10:00 AM", date: "2024-01-18", status: "PENDING" },
    { id: "2", student: "Ayesha Begum", subject: "Physics", classSlot: "Class 9", time: "Sun 2:00 PM", date: "2024-01-17", status: "PENDING" },
    { id: "3", student: "Karim Uddin", subject: "English", classSlot: "Class 11", time: "Mon 11:00 AM", date: "2024-01-15", status: "ACCEPTED" },
    { id: "4", student: "Maliha Rahman", subject: "Chemistry", classSlot: "Class 8", time: "Thu 4:00 PM", date: "2024-01-12", status: "REJECTED" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="TUTOR" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-5xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Tuition Requests</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Manage incoming booking requests from students</p>

          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                    {req.student.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{req.student}</p>
                    <p className="text-sm text-slate-500">{req.subject} - {req.classSlot} | {req.time}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Requested on {req.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {req.status === "PENDING" ? (
                    <>
                      <button className="btn-primary text-sm py-1.5 px-4">Accept</button>
                      <button className="btn-secondary text-sm py-1.5 px-4">Reject</button>
                    </>
                  ) : (
                    <span className={`badge text-xs ${
                      req.status === "ACCEPTED" ? "badge-success" :
                      req.status === "REJECTED" ? "badge-danger" : "badge-warning"
                    }`}>{req.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
