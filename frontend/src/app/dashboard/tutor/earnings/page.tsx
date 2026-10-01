"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import api from "@/lib/api";
import { HiOutlineCurrencyDollar, HiPlus } from "react-icons/hi";

export default function TutorEarningsPage() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BKASH");
  const [accountDetails, setAccountDetails] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [earningsRes, withdrawalsRes] = await Promise.all([
        api.get("/payments/tutor"),
        api.get("/withdrawals/tutor"),
      ]);

      if (earningsRes.data.success) {
        setEarnings(earningsRes.data.data || []);
      }
      if (withdrawalsRes.data.success) {
        setWithdrawals(withdrawalsRes.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load earnings:", err);
      setError("Failed to load earnings records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalEarnings = earnings
    .filter((e) => e.status === "COMPLETED")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalWithdrawn = withdrawals
    .filter((w) => ["PENDING", "APPROVED"].includes(w.status))
    .reduce((sum, w) => sum + w.amount, 0);

  const availableBalance = Math.max(0, totalEarnings - totalWithdrawn);

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !accountDetails) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await api.post("/withdrawals", {
        amount: Number(amount),
        method,
        accountDetails,
      });

      if (data.success) {
        setSuccess("Withdrawal request submitted successfully!");
        setShowModal(false);
        setAmount("");
        setAccountDetails("");
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar role="TUTOR" />
        <div className="flex-1 p-6 lg:p-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone border-t-primary-800 mx-auto"></div>
            <p className="text-ink-muted mt-4">Loading earnings data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="TUTOR" />
      <div className="flex-1 p-6 lg:p-12">
        <div className="max-w-5xl space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                আর্নিংস
              </span>
              <h1 className="font-display text-4xl font-semibold text-ink mb-3">Earnings</h1>
              <p className="text-ink-muted">Track your income, balance, and withdrawals</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-xs"
            >
              <HiPlus className="w-4 h-4" /> Request Payout
            </button>
          </div>

          {error && (
            <div className="p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta-800 rounded-card">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-sage/15 border border-sage/40 text-sage-800 rounded-card">
              {success}
            </div>
          )}

          {/* Balance Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Earnings Card */}
            <div className="card bg-primary-800 border-primary-800 text-white hover:translate-y-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-image bg-white/10 flex items-center justify-center">
                  <HiOutlineCurrencyDollar className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Earnings</p>
                  <p className="font-display text-4xl font-semibold">৳{totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Available Balance Card */}
            <div className="card flex items-center justify-between hover:translate-y-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-image bg-clay/40 border border-stone text-primary-800 flex items-center justify-center font-display text-xl font-semibold">
                  ৳
                </div>
                <div>
                  <p className="text-ink-muted text-xs">Available to Withdraw</p>
                  <p className="font-display text-4xl font-semibold text-ink">৳{availableBalance.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-medium text-ink-muted">Reserved / Pending</p>
                <p className="text-xs font-medium text-ink-muted mt-1">৳{totalWithdrawn.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Earnings & Payouts Tables tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Received Payments History */}
            <div className="lg:col-span-7 card p-6 space-y-5 hover:translate-y-0">
              <h2 className="font-display text-lg font-semibold text-ink">Received Payments</h2>
              {earnings.length === 0 ? (
                <p className="text-ink-muted text-xs py-8 text-center">No payment history found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-stone">
                        <th className="py-2.5 px-3 text-ink-muted font-medium">Student</th>
                        <th className="py-2.5 px-3 text-ink-muted font-medium">Amount</th>
                        <th className="py-2.5 px-3 text-ink-muted font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.map((earning) => (
                        <tr key={earning.id} className="border-b border-stone">
                          <td className="py-3 px-3 font-medium text-ink">
                            {earning.booking?.student?.name || "Student"}
                          </td>
                          <td className="py-3 px-3 font-medium text-primary-800">৳{earning.amount.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <span className={
                              earning.status === "COMPLETED"
                                ? "badge-success"
                                : "badge-warning"
                            }>
                              {earning.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Withdrawal Requests Log */}
            <div className="lg:col-span-5 card p-6 space-y-5 hover:translate-y-0">
              <h2 className="font-display text-lg font-semibold text-ink">Payout Status</h2>
              {withdrawals.length === 0 ? (
                <p className="text-ink-muted text-xs py-8 text-center">No withdrawal requests placed yet.</p>
              ) : (
                <div className="space-y-3">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="p-4 bg-clay-light border border-stone rounded-card flex justify-between items-center text-xs">
                      <div>
                        <p className="font-medium text-ink">৳{w.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-ink-muted mt-1">{w.method} - {w.accountDetails}</p>
                        {w.transactionId && <p className="text-[8px] font-mono text-ink-muted mt-1">Txn: {w.transactionId}</p>}
                      </div>
                      <span className={
                        w.status === "APPROVED"
                          ? "badge-success"
                          : w.status === "PENDING"
                          ? "badge-warning"
                          : "badge-danger"
                      }>
                        {w.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-stone rounded-card p-8 max-w-sm w-full shadow-soft-xl animate-fade-up">
            <form onSubmit={handleWithdrawalRequest} className="space-y-4">
              <h3 className="font-display text-xl font-semibold text-ink">Request Payout</h3>
              <p className="text-xs text-ink-muted">Submit a withdrawal request. Maximum withdrawable amount is ৳{availableBalance.toLocaleString()}</p>

              <div>
                <label className="label text-xs">Withdrawal Amount (BDT)</label>
                <input
                  type="number"
                  max={availableBalance}
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  required
                  className="input-field py-1.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="label text-xs">Payout Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="input-field py-1.5 text-xs font-semibold"
                >
                  <option value="BKASH">bKash</option>
                  <option value="NAGAD">Nagad</option>
                  <option value="BANK">Bank Account</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">Account / Wallet Details</label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX or Account No"
                  required
                  className="input-field py-1.5 text-xs"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || Number(amount) > availableBalance}
                  className="btn-primary text-[11px]"
                >
                  {submitting ? "Submitting..." : "Confirm Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
