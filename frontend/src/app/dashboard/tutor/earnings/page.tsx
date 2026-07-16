"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { HiOutlineCurrencyDollar } from "react-icons/hi";

export default function TutorEarningsPage() {
  const earnings = [
    { id: "1", student: "Rafiq Hasan", amount: 16000, date: "2024-01-15", method: "BKASH", status: "COMPLETED" },
    { id: "2", student: "Ayesha Begum", amount: 19200, date: "2024-01-01", method: "NAGAD", status: "COMPLETED" },
    { id: "3", student: "Karim Uddin", amount: 14000, date: "2023-12-15", method: "ROCKET", status: "COMPLETED" },
  ];

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="TUTOR" />
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-5xl">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Earnings</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Track your income and payment history</p>

          {/* Total Earnings Card */}
          <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <HiOutlineCurrencyDollar className="w-8 h-8" />
              </div>
              <div>
                <p className="text-primary-100 text-sm">Total Earnings</p>
                <p className="text-4xl font-bold">৳{totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Earnings Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Student</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Method</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((earning) => (
                    <tr key={earning.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{earning.student}</td>
                      <td className="py-3 px-4 text-primary-600 font-semibold">৳{earning.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{earning.date}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{earning.method}</td>
                      <td className="py-3 px-4"><span className="badge-success text-xs">{earning.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
