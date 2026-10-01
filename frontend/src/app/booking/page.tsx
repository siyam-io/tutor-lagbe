"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker, HiCheck, HiOutlineQuestionMarkCircle } from "react-icons/hi";
import api from "@/lib/api";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tutorId = searchParams.get("tutorId") || "";

  const [tutor, setTutor] = useState<any>(null);
  const [loadingTutor, setLoadingTutor] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states matching the layout
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]); // default mock date
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("02:00 PM");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [sessionType, setSessionType] = useState("One-on-One");
  const [duration, setDuration] = useState("1 Hour");
  const [mode, setMode] = useState("Online (Google Meet)");
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!tutorId) {
      setError("No tutor selected for booking.");
      setLoadingTutor(false);
      return;
    }

    const fetchTutor = async () => {
      try {
        const { data } = await api.get(`/tutors/${tutorId}`);
        if (data.success && data.data) {
          setTutor(data.data);
          // Set first subject as default
          if (data.data.subjects && data.data.subjects.length > 0) {
            setSubject(data.data.subjects[0]);
          }
        } else {
          setError("Failed to fetch tutor details.");
        }
      } catch (err) {
        setError("Error loading tutor for booking.");
      } finally {
        setLoadingTutor(false);
      }
    };
    fetchTutor();
  }, [tutorId]);

  const handleBookSession = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const totalAmount = tutorRate + 50;
      const { data } = await api.post("/bookings", {
        tutorProfileId: tutorId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        tuitionType: mode.includes("Online") ? "ONLINE" : "OFFLINE",
        address: mode.includes("Online") ? "Online (Google Meet)" : address || "Student Home Address",
        notes: `${topic ? `Topic: ${topic}. ` : ""}${notes}`,
        amount: totalAmount,
      });

      if (data.success && data.data) {
        const bookingId = data.data.id;
        // Instantly initiate payment and redirect to SSLCommerz checkout
        try {
          const payRes = await api.post("/payments/initiate", {
            bookingId,
            amount: totalAmount,
          });
          if (payRes.data.success && payRes.data.gatewayUrl) {
            window.location.href = payRes.data.gatewayUrl;
            return;
          }
        } catch (payErr) {
          console.error("Payment initiation failed:", payErr);
          router.push("/payments?status=fail");
          return;
        }
        router.push("/dashboard/student");
      } else {
        setError(data.error || "Failed to book session");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong while booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tutorRate = tutor?.hourlyRate || Math.round((tutor?.expectedSalary || 16000) / 32) || 800;

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysCount = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);
  const leadingEmptyDays = Array.from({ length: firstDay }, () => null);
  const calendarCells = [...leadingEmptyDays, ...daysInMonth];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const getFormattedDate = (dateStr: string) => {
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return dateStr;
      return dateObj.toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loadingTutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-stone border-t-primary-800"></div>
      </div>
    );
  }

  if (error && !tutor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-display text-3xl font-semibold text-ink mb-3">Booking Error</h2>
        <p className="text-ink-muted mb-8">{error}</p>
        <Link href="/find-tutor" className="btn-primary">Find a Tutor</Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex text-xs text-ink-muted gap-2 mb-8">
            <Link href="/" className="hover:text-primary-800 transition-colors duration-300">Home</Link>
            <span className="text-stone">&gt;</span>
            <Link href="/find-tutor" className="hover:text-primary-800 transition-colors duration-300">Find Tutors</Link>
            <span className="text-stone">&gt;</span>
            <span className="truncate max-w-[150px]">{tutor?.user?.name || "Tutor Details"}</span>
            <span className="text-stone">&gt;</span>
            <span className="text-primary-800 font-medium">Book a Session</span>
          </nav>

          {/* Heading with Stepper */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-stone pb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-2">Book a Session</h1>
              <p className="text-sm text-ink-muted">Choose your preferred time and book your session.</p>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="flex items-center gap-4 text-xs font-medium text-ink-muted">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-800 text-white flex items-center justify-center text-[10px]">1</span>
                <span className="text-primary-800">Select Time</span>
              </div>
              <div className="h-px w-6 bg-stone"></div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-clay border border-stone text-ink-muted flex items-center justify-center text-[10px]">2</span>
                <span>Session Details</span>
              </div>
              <div className="h-px w-6 bg-stone"></div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-clay border border-stone text-ink-muted flex items-center justify-center text-[10px]">3</span>
                <span>Payment</span>
              </div>
              <div className="h-px w-6 bg-stone"></div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-clay border border-stone text-ink-muted flex items-center justify-center text-[10px]">4</span>
                <span>Confirmation</span>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Panel - Forms */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Section 1: Date & Time */}
              <div className="card p-6 md:p-8 space-y-6">
                <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                  <span className="text-sage-700">📅</span> 1. Select Date & Time
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Calendar Widget */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="flex justify-between items-center bg-clay-light p-3 rounded-full border border-stone">
                      <button type="button" onClick={handlePrevMonth} className="text-ink-muted hover:text-primary-800 text-sm transition-colors duration-300">&lt;</button>
                      <span className="font-medium text-ink text-xs">{monthNames[currentMonth]} {currentYear}</span>
                      <button type="button" onClick={handleNextMonth} className="text-ink-muted hover:text-primary-800 text-sm transition-colors duration-300">&gt;</button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-ink-muted uppercase tracking-wider">
                      <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink">
                      {calendarCells.map((day, idx) => {
                        if (day === null) return <div key={`empty-${idx}`} className="py-2"></div>;
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = selectedDate === dateStr;
                        return (
                          <button
                            key={`day-${day}`}
                            type="button"
                            onClick={() => setSelectedDate(dateStr)}
                            className={`py-2 rounded-full font-medium transition-colors duration-300 ${
                              isSelected
                                ? "bg-primary-800 text-white"
                                : "hover:bg-clay-light text-ink-muted"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-ink-muted">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-800"></span>
                      <span>Available Dates</span>
                    </div>
                  </div>

                  {/* Time Slots Widget */}
                  <div className="md:col-span-6 space-y-4">
                    <div>
                      <p className="font-medium text-ink text-sm">{getFormattedDate(selectedDate)}</p>
                      <p className="text-xs text-ink-muted">☀️ Dhaka Time (GMT+6)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      {timeSlots.map((slot) => {
                        const isSelected = slot === selectedTimeSlot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-3.5 px-4 rounded-full border text-xs font-medium text-center transition-colors duration-300 ${
                              isSelected
                                ? "border-primary-800 bg-primary-800 text-white"
                                : "border-stone hover:border-sage text-ink bg-white"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>

                    <button type="button" className="w-full py-2.5 bg-clay-light hover:bg-clay/50 border border-stone rounded-full text-xs text-ink-muted font-medium transition-colors duration-300">
                      View More ∨
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Session Details */}
              <div className="card p-6 md:p-8 space-y-6">
                <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                  <span className="text-sage-700">📄</span> 2. Session Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="input-field"
                    >
                      {tutor?.subjects?.map((sub: string) => (
                        <option key={sub} value={sub}>{sub}</option>
                      )) || <option value="">Select subject</option>}
                    </select>
                  </div>

                  <div>
                    <label className="label">Topic / What do you want to learn?</label>
                    <input
                      type="text"
                      placeholder="e.g., Algebra, Calculus, Trigonometry..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value.slice(0, 200))}
                      className="input-field"
                    />
                    <p className="text-right text-[10px] text-ink-muted mt-1">{topic.length}/200</p>
                  </div>

                  <div>
                    <label className="label">Session Type</label>
                    <select
                      value={sessionType}
                      onChange={(e) => setSessionType(e.target.value)}
                      className="input-field"
                    >
                      <option value="One-on-One">One-on-One</option>
                      <option value="Group Class">Group Class</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="input-field"
                    >
                      <option value="1 Hour">1 Hour</option>
                      <option value="1.5 Hours">1.5 Hours</option>
                      <option value="2 Hours">2 Hours</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">Mode</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="input-field"
                    >
                      <option value="Online (Google Meet)">Online (Google Meet)</option>
                      <option value="Online (Zoom)">Online (Zoom)</option>
                      <option value="Offline (Home Tuition)">Offline (Home Tuition)</option>
                    </select>
                  </div>

                  {mode.includes("Offline") && (
                    <div className="md:col-span-2">
                      <label className="label">Class Delivery Address</label>
                      <textarea
                        rows={2}
                        placeholder="House No, Road No, Area, District..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Notes */}
              <div className="card p-6 md:p-8 space-y-6">
                <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                  <span className="text-sage-700">✍️</span> 3. Add Extra Notes (Optional)
                </h2>
                <div>
                  <textarea
                    rows={3}
                    placeholder="Any specific requirements or notes for the tutor..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value.slice(0, 300))}
                    className="input-field"
                  />
                  <p className="text-right text-[10px] text-ink-muted mt-1">{notes.length}/300</p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-terracotta/10 text-terracotta-800 rounded-card text-sm text-center border border-terracotta/30">
                  {error}
                </div>
              )}

              {/* Actions Button */}
              <div className="space-y-4">
                <button
                  onClick={handleBookSession}
                  disabled={isSubmitting || (mode.includes("Offline") && !address)}
                  className="w-full btn-primary text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white"></div>
                      Booking your session...
                    </>
                  ) : (
                    "Continue to Payment →"
                  )}
                </button>
                <p className="text-center text-xs text-ink-muted flex items-center justify-center gap-1.5">
                  🛡️ Your payment information is secure and encrypted.
                </p>
              </div>

            </div>

            {/* Right Panel - Summary */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Tutor Profile Header */}
              <div className="card p-5 space-y-4">
                <h3 className="font-display font-semibold text-sage-700 text-xs tracking-wider uppercase">Tutor Information</h3>
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-image bg-clay/40 border border-stone flex items-center justify-center font-display font-semibold text-primary-800 overflow-hidden">
                    {tutor?.photoUrl ? (
                      <img src={tutor.photoUrl} alt={tutor.user?.name} className="w-full h-full object-cover" />
                    ) : (
                      tutor?.user?.name ? tutor.user.name.split(" ").map((n: string) => n[0]).join("") : "T"
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-ink text-base flex items-center gap-1.5">
                      {tutor?.user?.name}
                      <span className="text-sage-700 text-xs" title="Verified Tutor">✓</span>
                    </h4>
                    <p className="text-xs text-ink-muted mt-0.5">{tutor?.qualification || "Mathematics Specialist"}</p>
                    
                    <div className="flex items-center gap-1.5 mt-1.5 text-terracotta-700 text-xs">
                      <span>★</span>
                      <span className="font-medium text-ink">{tutor?.averageRating ? tutor.averageRating.toFixed(1) : "4.9"}</span>
                      <span className="text-ink-muted text-[10px]">({tutor?.totalReviews || 120} Reviews)</span>
                    </div>

                    <div className="flex gap-1.5 flex-wrap mt-2">
                      <span className="badge">
                        ৳{tutor?.hourlyRate || 500}/hr
                      </span>
                      <span className="badge-primary">
                        ৳{tutor?.expectedSalary?.toLocaleString() || "6,000"}/mo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary details */}
              <div className="card p-5 space-y-4">
                <h3 className="font-display font-semibold text-sage-700 text-xs tracking-wider uppercase">Booking Summary</h3>
                <div className="space-y-3.5 text-xs text-ink-muted">
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span className="font-medium text-ink">{getFormattedDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="font-medium text-ink">{selectedTimeSlot} - {(() => {
                      try {
                        const [time, modifier] = selectedTimeSlot.split(" ");
                        let [hours, minutes] = time.split(":").map(Number);
                        hours = hours + 1;
                        if (hours > 12) hours = hours - 12;
                        let nextModifier = modifier;
                        if (hours === 12) {
                          nextModifier = modifier === "AM" ? "PM" : "AM";
                        }
                        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${nextModifier}`;
                      } catch {
                        return selectedTimeSlot;
                      }
                    })()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium text-ink">{duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Session Type</span>
                    <span className="font-medium text-ink">{sessionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode</span>
                    <span className="font-medium text-ink">{mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subject</span>
                    <span className="font-medium text-ink">{subject || "Mathematics"}</span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="card p-5 space-y-4">
                <h3 className="font-display font-semibold text-sage-700 text-xs tracking-wider uppercase">Price Details</h3>
                <div className="space-y-3 text-xs border-b border-stone pb-5">
                  <div className="flex justify-between">
                    <span>Rate ({duration})</span>
                    <span className="font-medium text-ink">৳ {tutorRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      Platform Fee
                      <HiOutlineQuestionMarkCircle className="w-3.5 h-3.5 text-sage-700" />
                    </span>
                    <span className="font-medium text-ink">৳ 50</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium text-ink text-sm">Total Amount</span>
                  <span className="font-display font-semibold text-primary-800 text-xl">৳ {tutorRate + 50}</span>
                </div>
              </div>

              {/* Guarantee badges */}
              <div className="space-y-4">
                {/* 100% Secure badge */}
                <div className="flex gap-3 bg-sage/10 border border-sage/30 p-4 rounded-card">
                  <div className="w-5 h-5 rounded-full bg-sage-700 text-white flex items-center justify-center flex-shrink-0 text-xs">✓</div>
                  <div>
                    <h5 className="font-medium text-ink text-xs">100% Secure Booking</h5>
                    <p className="text-[10px] text-ink-muted mt-1">Your session is confirmed only after successful payment.</p>
                  </div>
                </div>

                {/* Additional Info links list */}
                <div className="card p-6 space-y-5 text-xs">
                  <div className="flex gap-3.5 items-start">
                    <span className="text-lg">📅</span>
                    <div>
                      <p className="font-medium text-ink">Flexible Reschedule</p>
                      <p className="text-[10px] text-ink-muted mt-1">Reschedule your session up to 2 hours before the scheduled time.</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <span className="text-lg">🎧</span>
                    <div>
                      <p className="font-medium text-ink">24/7 Support</p>
                      <p className="text-[10px] text-ink-muted mt-1">We are here to help you anytime you need.</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <span className="text-lg">🛡️</span>
                    <div>
                      <p className="font-medium text-ink">Satisfaction Guarantee</p>
                      <p className="text-[10px] text-ink-muted mt-1">Not satisfied? Get a full refund within 24 hours of the session.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-stone border-t-primary-800"></div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
