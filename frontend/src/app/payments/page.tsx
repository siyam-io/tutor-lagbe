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
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sage-700 mx-auto"></div>
          <p className="text-ink-muted mt-3 text-sm">Loading payments data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-canvas py-8 flex items-center justify-center">
          <div className="card max-w-md text-center p-8">
            <h2 className="font-display text-2xl font-semibold text-ink mb-2">Login Required</h2>
            <p className="text-ink-muted mb-6">Please log in to manage your payments.</p>
            <a href="/login" className="btn-primary inline-block">Go to Login</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const mainContent = (
    <div className="max-w-5xl mx-auto">
      <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">Billing</span>
      <h1 className="font-display text-4xl font-semibold text-ink mb-2">Payments</h1>
      <p className="text-ink-muted mb-8">Manage your payments and billing history via SSLCommerz</p>

      {/* Payment Callback Status Messages */}
      {paymentStatus === "success" && (
        <div className="p-4 bg-sage/15 text-sage-800 rounded-2xl flex items-center gap-3 mb-8 border border-sage/40">
          <HiCheckCircle className="w-6 h-6 text-sage-700 shrink-0" />
          <div>
            <p className="font-bold text-sm">Payment Completed Successfully!</p>
            <p className="text-xs">Your tuition fee has been received and booking is active.</p>
          </div>
        </div>
      )}
      {paymentStatus === "fail" && (
        <div className="p-4 bg-terracotta/10 text-terracotta-800 rounded-2xl flex items-center gap-3 mb-8 border border-terracotta/30">
          <HiXCircle className="w-6 h-6 text-terracotta-700 shrink-0" />
          <div>
            <p className="font-bold text-sm">Payment Failed</p>
            <p className="text-xs">The transaction could not be completed. Please try again.</p>
          </div>
        </div>
      )}
      {paymentStatus === "cancel" && (
        <div className="p-4 bg-ochre/10 text-ochre-800 rounded-2xl flex items-center gap-3 mb-8 border border-ochre/30">
          <HiXCircle className="w-6 h-6 text-ochre-800 shrink-0" />
          <div>
            <p className="font-bold text-sm">Payment Cancelled</p>
            <p className="text-xs">You have cancelled the payment checkout session.</p>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-terracotta/10 text-terracotta-800 rounded-2xl text-center mb-8 border border-terracotta/30">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink mb-6">Payment History</h2>
            {payments.length === 0 ? (
              <p className="text-ink-muted text-sm py-8 text-center">No payment history records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Txn ID / Method</th>
                      <th className="py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Amount</th>
                      <th className="py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Date</th>
                      <th className="py-3 px-4 text-ink-muted font-medium uppercase text-[11px] tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-stone/70">
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-ink">{payment.transactionId || "N/A"}</p>
                          <p className="text-[10px] text-ink-muted font-semibold uppercase tracking-wide mt-0.5">{payment.method}</p>
                        </td>
                        <td className="py-3.5 px-4 text-ink font-semibold">৳{payment.amount.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-ink-muted">{new Date(payment.createdAt).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                            payment.status === "COMPLETED" ? "badge-success" :
                            payment.status === "PENDING" ? "badge-warning" :
                            "badge-danger"
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
            <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
              <HiOutlineShieldCheck className="w-5 h-5 text-sage-700" />
              Pay Tuition Fees
            </h3>
            
            {bookings.length === 0 ? (
              <p className="text-xs text-ink-muted py-4">No pending tuition fees or due payments at this moment.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="label">Select Tuition Booking</label>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="input-field text-xs font-semibold"
                  >
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.tutor?.user?.name} ({b.tutor?.subjects?.[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5 text-xs border-t border-stone pt-3">
                  <div className="flex justify-between text-ink-muted">
                    <span>Monthly Tuition Fee</span>
                    <span className="font-semibold text-ink">৳{tuitionAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span>SSL Gateway Service Fee</span>
                    <span className="font-semibold text-ink">৳{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-stone flex justify-between">
                    <span className="font-bold text-ink">Total Payable</span>
                    <span className="font-extrabold text-primary-800 text-base">৳{totalAmount.toLocaleString()}</span>
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
                <p className="text-[10px] text-ink-muted text-center">Secured & encrypted via SSLCommerz Sandbox</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-canvas">
      <DashboardSidebar role={user?.role || "STUDENT"} />
      <div className="flex-1 p-6 lg:p-10">{mainContent}</div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sage-700 mx-auto"></div>
      </div>
    }>
      <PaymentsContent />
    </Suspense>
  );
}
