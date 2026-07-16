"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuthStore } from "@/store/auth.store";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { HiOutlineCreditCard, HiOutlineDeviceMobile, HiOutlineShieldCheck, HiCheckCircle, HiXCircle } from "react-icons/hi";

function PaymentsContent() {
  const { user, isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("status");

  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, bookingsRes] = await Promise.all([
        api.get("/payments"),
        api.get("/bookings/student"),
      ]);

      if (paymentsRes.data.success) {
        setPayments(paymentsRes.data.data || []);
      }
      if (bookingsRes.data.success) {
        // Find bookings that do not have COMPLETED payments
        const completedPaymentBookingIds = (paymentsRes.data.data || [])
          .filter((p: any) => p.status === "COMPLETED")
          .map((p: any) => p.bookingId);

        const unpaid = bookingsRes.data.data.filter(
          (b: any) =>
            b.status !== "REJECTED" &&
            b.status !== "CANCELLED" &&
            !completedPaymentBookingIds.includes(b.id)
        );
        setBookings(unpaid);
        if (unpaid.length > 0) {
          setSelectedBookingId(unpaid[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load payments details:", err);
      setError("Failed to load payment records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Find currently selected booking details
  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);
  const totalAmount = selectedBooking ? selectedBooking.amount || 650 : 0;
  const serviceFee = selectedBooking ? 50 : 0;
  const tuitionAmount = selectedBooking ? Math.max(0, totalAmount - serviceFee) : 0;

  const handlePaymentInitiate = async () => {
    if (!selectedBookingId || totalAmount <= 0) return;
    setInitiating(true);
    setError("");
    try {
      const { data } = await api.post("/payments/initiate", {
        bookingId: selectedBookingId,
        amount: totalAmount,
      });

      if (data.success && data.gatewayUrl) {
        // Redirect browser to SSLCommerz Checkout Gateway
        window.location.href = data.gatewayUrl;
      } else {
        setError("Failed to generate payment link. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to contact payment gateway.");
    } finally {
      setInitiating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-slate-500 mt-2">Loading payments data...</p>
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
            <p className="text-slate-500 dark:text-slate-400 mb-6">Please log in to manage your payments.</p>
            <a href="/login" className="btn-primary inline-block">Go to Login</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const mainContent = (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Payments</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your payments and billing history via SSLCommerz</p>

      {/* Payment Callback Status Messages */}
      {paymentStatus === "success" && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 rounded-xl flex items-center gap-2 mb-8 border border-green-200 dark:border-green-900">
          <HiCheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-bold text-sm">Payment Completed Successfully!</p>
            <p className="text-xs">Your tuition fee has been received and booking is active.</p>
          </div>
        </div>
      )}
      {paymentStatus === "fail" && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-300 rounded-xl flex items-center gap-2 mb-8 border border-red-200 dark:border-red-900">
          <HiXCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="font-bold text-sm">Payment Failed</p>
            <p className="text-xs">The transaction could not be completed. Please try again.</p>
          </div>
        </div>
      )}
      {paymentStatus === "cancel" && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-750 dark:text-yellow-300 rounded-xl flex items-center gap-2 mb-8 border border-yellow-200 dark:border-yellow-900">
          <HiXCircle className="w-6 h-6 text-yellow-500" />
          <div>
            <p className="font-bold text-sm">Payment Cancelled</p>
            <p className="text-xs">You have cancelled the payment checkout session.</p>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-50 text-red-650 rounded-lg text-center mb-8">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Payment History</h2>
            {payments.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center">No payment history records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="py-3 px-4 text-slate-500 font-medium">Txn ID / Method</th>
                      <th className="py-3 px-4 text-slate-500 font-medium">Amount</th>
                      <th className="py-3 px-4 text-slate-500 font-medium">Date</th>
                      <th className="py-3 px-4 text-slate-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-900 dark:text-white">{payment.transactionId || "N/A"}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{payment.method}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-650 dark:text-slate-400 font-semibold">৳{payment.amount.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{new Date(payment.createdAt).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            payment.status === "COMPLETED" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300" :
                            payment.status === "PENDING" ? "bg-yellow-100 text-yellow-750 dark:bg-yellow-950/40 dark:text-yellow-300" :
                            "bg-red-100 text-red-750 dark:bg-red-950/40 dark:text-red-300"
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Due / Initiating Payment Widget */}
        <div>
          <div className="card sticky top-24 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <HiOutlineShieldCheck className="w-5 h-5 text-primary-600" />
              Pay Tuition Fees
            </h3>
            
            {bookings.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No pending tuition fees or due payments at this moment.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Select Tuition Booking</label>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.tutor?.user?.name} ({b.tutor?.subjects?.[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5 text-xs border-t border-slate-200 dark:border-slate-800 pt-3">
                  <div className="flex justify-between text-slate-500">
                    <span>Monthly Tuition Fee</span>
                    <span className="font-semibold">৳{tuitionAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>SSL Gateway Service Fee</span>
                    <span className="font-semibold">৳{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Total Payable</span>
                    <span className="font-extrabold text-primary-600 text-base">৳{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePaymentInitiate}
                  disabled={initiating}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
                >
                  <HiOutlineCreditCard className="w-4 h-4" />
                  {initiating ? "Redirecting..." : "Pay with SSLCommerz"}
                </button>
                <p className="text-[10px] text-slate-400 text-center">Secured & encrypted via SSLCommerz Sandbox</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role={user?.role || "STUDENT"} />
      <div className="flex-1 p-6 lg:p-10">{mainContent}</div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    }>
      <PaymentsContent />
    </Suspense>
  );
}
