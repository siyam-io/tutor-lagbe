"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePlus } from "react-icons/hi";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Mock upcoming classes
const upcomingClasses = [
  { id: "1", student: "Rafiq Hasan", subject: "Mathematics", date: "2024-01-20", time: "10:00 AM", type: "Offline", status: "confirmed" },
  { id: "2", student: "Ayesha Begum", subject: "Physics", date: "2024-01-21", time: "2:00 PM", type: "Online", status: "confirmed" },
  { id: "3", student: "Karim Uddin", subject: "Mathematics", date: "2024-01-22", time: "11:00 AM", type: "Offline", status: "pending" },
];

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Schedule</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="card">
                {/* Month navigator */}
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <HiOutlineChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {months[currentMonth]} {currentYear}
                  </h2>
                  <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <HiOutlineChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {days.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const hasClass = [5, 10, 15, 20].includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                          selectedDate === day
                            ? "bg-primary-600 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {day}
                        {hasClass && (
                          <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${
                            selectedDate === day ? "bg-white" : "bg-primary-600"
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected date details */}
              {selectedDate && (
                <div className="card mt-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Schedule for {months[currentMonth]} {selectedDate}, {currentYear}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">Mathematics - Rafiq Hasan</p>
                        <p className="text-xs text-slate-500">10:00 AM - 11:30 AM (Offline)</p>
                      </div>
                      <span className="badge-success text-xs">Confirmed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Upcoming Classes */}
              <div className="card">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Upcoming Classes</h3>
                <div className="space-y-3">
                  {upcomingClasses.map((cls) => (
                    <div key={cls.id} className={`p-3 rounded-lg border ${
                      cls.status === "confirmed"
                        ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                        : "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10"
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm text-slate-900 dark:text-white">{cls.subject}</p>
                        <span className={`badge text-xs ${cls.status === "confirmed" ? "badge-success" : "badge-warning"}`}>
                          {cls.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{cls.student}</p>
                      <p className="text-xs text-slate-400 mt-1">{cls.date} | {cls.time} | {cls.type}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Slot */}
              <div className="card">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                <button className="btn-outline w-full flex items-center justify-center gap-2">
                  <HiOutlinePlus className="w-4 h-4" />
                  Add Available Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
