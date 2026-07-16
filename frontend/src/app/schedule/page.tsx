"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePlus, HiTrash } from "react-icons/hi";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const availableDaysOfWeek = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export default function SchedulePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tutor slots form state
  const [selectedDay, setSelectedDay] = useState("Sat");
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [updatingSlots, setUpdatingSlots] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      if (!user) return;

      if (user.role === "STUDENT") {
        const { data } = await api.get("/bookings/student");
        if (data.success) {
          setBookings(data.data);
        }
      } else if (user.role === "TUTOR") {
        const [bookingsRes, profileRes] = await Promise.all([
          api.get("/bookings/tutor"),
          api.get("/tutors/profile"),
        ]);

        if (bookingsRes.data.success) {
          setBookings(bookingsRes.data.data);
        }
        if (profileRes.data.success) {
          setTutorProfile(profileRes.data.data);
        }
      }
    } catch (err: any) {
      setError("Failed to load schedule data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchScheduleData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  // Helper to check if a calendar day has bookings
  const getBookingsForDay = (day: number) => {
    return bookings.filter((b) => {
      const bDate = new Date(b.date);
      return (
        bDate.getDate() === day &&
        bDate.getMonth() === currentMonth &&
        bDate.getFullYear() === currentYear &&
        b.status !== "REJECTED" &&
        b.status !== "CANCELLED"
      );
    });
  };

  // Add available slot
  const handleAddSlot = async () => {
    if (!tutorProfile || updatingSlots) return;
    const newSlot = `${selectedDay}-${selectedTime}`;
    const currentSlots = tutorProfile.availableSlots || [];
    if (currentSlots.includes(newSlot)) {
      alert("This slot already exists!");
      return;
    }

    const updatedSlots = [...currentSlots, newSlot];
    setUpdatingSlots(true);
    try {
      const { data } = await api.put("/tutors/profile", {
        availableSlots: updatedSlots,
      });
      if (data.success) {
        setTutorProfile({ ...tutorProfile, availableSlots: updatedSlots });
      }
    } catch (err) {
      console.error("Failed to add slot:", err);
      alert("Failed to add slot");
    } finally {
      setUpdatingSlots(false);
    }
  };

  // Remove available slot
  const handleRemoveSlot = async (slotToRemove: string) => {
    if (!tutorProfile || updatingSlots) return;
    const updatedSlots = (tutorProfile.availableSlots || []).filter(
      (s: string) => s !== slotToRemove
    );
    setUpdatingSlots(true);
    try {
      const { data } = await api.put("/tutors/profile", {
        availableSlots: updatedSlots,
      });
      if (data.success) {
        setTutorProfile({ ...tutorProfile, availableSlots: updatedSlots });
      }
    } catch (err) {
      console.error("Failed to remove slot:", err);
      alert("Failed to remove slot");
    } finally {
      setUpdatingSlots(false);
    }
  };

  const selectedDateBookings = selectedDate ? getBookingsForDay(selectedDate) : [];

  const mainContent = (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Schedule</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Manage your slots and view your scheduled classes.
      </p>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center mb-8">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            {/* Month Navigator */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <HiOutlineChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {months[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
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

            {/* Calendar grid cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayBookings = getBookingsForDay(day);
                const hasClass = dayBookings.length > 0;
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
                      <span
                        className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${
                          selectedDate === day ? "bg-white" : "bg-primary-600"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="card">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Classes on {months[currentMonth]} {selectedDate}, {currentYear}
              </h3>
              <div className="space-y-3">
                {selectedDateBookings.length === 0 ? (
                  <p className="text-slate-500 text-sm py-4">No classes scheduled for this day.</p>
                ) : (
                  selectedDateBookings.map((cls) => {
                    const isTutor = user?.role === "TUTOR";
                    const counterpartName = isTutor
                      ? cls.student?.name || "Student"
                      : cls.tutor?.user?.name || "Tutor";
                    const subject = cls.tutor?.subjects?.[0] || "Tuition";

                    return (
                      <div
                        key={cls.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border ${
                          cls.status === "ACCEPTED"
                            ? "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-950/20"
                            : cls.status === "COMPLETED"
                            ? "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-950/20"
                            : "border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-950/20"
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            cls.status === "ACCEPTED"
                              ? "bg-green-500"
                              : cls.status === "COMPLETED"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {subject} - {counterpartName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Slot: {cls.timeSlot} ({cls.tuitionType})
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            cls.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : cls.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                          }`}
                        >
                          {cls.status}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Quick Actions */}
        <div className="space-y-6">
          {/* Tutor Available Slots Manager */}
          {user?.role === "TUTOR" && tutorProfile && (
            <div className="card">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">My Available Slots</h3>
              
              {/* List of current available slots */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(tutorProfile.availableSlots || []).length === 0 ? (
                  <p className="text-slate-500 text-sm py-2">No available slots configured yet.</p>
                ) : (
                  (tutorProfile.availableSlots || []).map((slot: string) => (
                    <span
                      key={slot}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300 border border-primary-200 dark:border-primary-900"
                    >
                      {slot}
                      <button
                        onClick={() => handleRemoveSlot(slot)}
                        disabled={updatingSlots}
                        className="text-primary-700 hover:text-red-600 dark:text-primary-300 dark:hover:text-red-400 transition-colors ml-1"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add New Slot Form */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">Add Available Slot</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Day</label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300"
                    >
                      {availableDaysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day === "Sat" ? "Saturday" :
                           day === "Sun" ? "Sunday" :
                           day === "Mon" ? "Monday" :
                           day === "Tue" ? "Tuesday" :
                           day === "Wed" ? "Wednesday" :
                           day === "Thu" ? "Thursday" : "Friday"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Time</label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <button
                    onClick={handleAddSlot}
                    disabled={updatingSlots}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm mt-2"
                  >
                    <HiOutlinePlus className="w-4 h-4" />
                    Add Slot
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info Card */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Schedule Guide</h3>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
              <li>Indicator dots on the calendar show days with confirmed or pending classes.</li>
              <li>Click on any date to see the details of classes scheduled for that day.</li>
              {user?.role === "TUTOR" ? (
                <li>Tutors can manage their available slots so students can book them at those times.</li>
              ) : (
                <li>Students can request classes only during tutor available time slots.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-slate-500 mt-2">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 flex items-center justify-center">
          <div className="card max-w-md text-center p-8">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Login Required</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Please log in to view and manage your schedule.</p>
            <a href="/login" className="btn-primary inline-block">Go to Login</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role={user?.role || "STUDENT"} />
      <div className="flex-1 p-6 lg:p-10">{mainContent}</div>
    </div>
  );
}

