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
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <DashboardSidebar role="TUTOR" />
        <div className="flex-1 p-6 lg:p-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-slate-500 mt-2">Loading earnings data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="TUTOR" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-5xl space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Earnings</h1>
              <p className="text-slate-500 dark:text-slate-400">Track your income, balance, and withdrawals</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-1 text-xs py-2 px-5 font-bold"
            >
              <HiPlus className="w-4 h-4" /> Request Payout
            </button>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-650 rounded-lg">{error}</div>}
          {success && <div className="p-4 bg-green-50 text-green-700 rounded-lg">{success}</div>}

          {/* Balance Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Earnings Card */}
            <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <HiOutlineCurrencyDollar className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-primary-100 text-sm">Total Earnings</p>
                  <p className="text-3xl font-bold">৳{totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Available Balance Card */}
            <div className="card bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 flex items-center justify-center text-lg font-bold">
                  ৳
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Available to Withdraw</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">৳{availableBalance.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Reserved / Pending</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">৳{totalWithdrawn.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Earnings & Payouts Tables tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Received Payments History */}
            <div className="lg:col-span-7 card space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Received Payments</h2>
              {earnings.length === 0 ? (
                <p className="text-slate-500 text-xs py-8 text-center">No payment history found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="py-2.5 px-3 text-slate-500 font-medium">Student</th>
                        <th className="py-2.5 px-3 text-slate-500 font-medium">Amount</th>
                        <th className="py-2.5 px-3 text-slate-500 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.map((earning) => (
                        <tr key={earning.id} className="border-b border-slate-100 dark:border-slate-800/60">
                          <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                            {earning.booking?.student?.name || "Student"}
                          </td>
                          <td className="py-3 px-3 font-bold text-primary-600">৳{earning.amount.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              earning.status === "COMPLETED" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300" :
                              "bg-yellow-100 text-yellow-750 dark:bg-yellow-950/40 dark:text-yellow-300"
                            }`}>
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
            <div className="lg:col-span-5 card space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Payout Status</h2>
              {withdrawals.length === 0 ? (
                <p className="text-slate-500 text-xs py-8 text-center">No withdrawal requests placed yet.</p>
              ) : (
                <div className="space-y-3">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/80 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">৳{w.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{w.method} - {w.accountDetails}</p>
                        {w.transactionId && <p className="text-[8px] font-mono text-slate-400 mt-1">Txn: {w.transactionId}</p>}
                      </div>
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                        w.status === "APPROVED" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300" :
                        w.status === "PENDING" ? "bg-yellow-100 text-yellow-750 dark:bg-yellow-950/40 dark:text-yellow-300" :
                        "bg-red-100 text-red-750 dark:bg-red-950/40 dark:text-red-300"
                      }`}>
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
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-250 dark:border-slate-800 p-6 max-w-sm w-full">
            <form onSubmit={handleWithdrawalRequest} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Payout</h3>
              <p className="text-xs text-slate-500">Submit a withdrawal request. Maximum withdrawable amount is ৳{availableBalance.toLocaleString()}</p>

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
                  className="btn-secondary py-1.5 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || Number(amount) > availableBalance}
                  className="btn-primary py-1.5 px-4 text-xs font-semibold"
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
