"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiOutlineCreditCard, HiOutlineDeviceMobile, HiOutlineShieldCheck } from "react-icons/hi";

const paymentMethods = [
  { id: "bkash", name: "bKash", icon: "💳", color: "bg-pink-500", number: "01XXXXXXXXX" },
  { id: "nagad", name: "Nagad", icon: "💰", color: "bg-red-500", number: "01XXXXXXXXX" },
  { id: "rocket", name: "Rocket", icon: "🚀", color: "bg-purple-600", number: "01XXXXXXXXX" },
  { id: "visa", name: "Visa", icon: "💳", color: "bg-blue-600", number: "" },
  { id: "mastercard", name: "Mastercard", icon: "💳", color: "bg-orange-600", number: "" },
];

const paymentHistory = [
  { id: "1", tutor: "Md. Rahman", amount: 16000, date: "2024-01-15", status: "COMPLETED", method: "BKASH" },
  { id: "2", tutor: "Fatema Akter", amount: 19200, date: "2024-01-01", status: "COMPLETED", method: "NAGAD" },
];

export default function PaymentsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10">Manage your payments and billing methods</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="card mb-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <HiOutlineCreditCard className="w-5 h-5 text-primary-600" /> Payment Methods
                </h2>

                {/* Mobile Banking */}
                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-4">
                    <HiOutlineDeviceMobile className="w-4 h-4" /> Mobile Banking
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {paymentMethods.slice(0, 3).map((method) => (
                      <button
                        key={method.id}
                        className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-400 transition-all text-left group"
                      >
                        <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform`}>
                          {method.icon}
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white">{method.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{method.number}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-4">
                    <HiOutlineCreditCard className="w-4 h-4" /> Credit / Debit Card
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.slice(3).map((method) => (
                      <button
                        key={method.id}
                        className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-400 transition-all text-left group"
                      >
                        <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform`}>
                          {method.icon}
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white">{method.name}</p>
                        <p className="text-xs text-slate-400 mt-1">Ending in ••••</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="card">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Payment History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Tutor</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{payment.tutor}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">৳{payment.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{payment.date}</td>
                          <td className="py-3 px-4">
                            <span className="badge-success text-xs">{payment.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <div className="card sticky top-24">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Due Payment</h3>
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Tuition (Md. Rahman)</span>
                    <span className="font-medium">৳16,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Fee</span>
                    <span className="font-medium">৳50</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                    <span className="font-semibold">Total Due</span>
                    <span className="font-bold text-primary-600 text-lg">৳16,050</span>
                  </div>
                </div>
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <HiOutlineShieldCheck className="w-5 h-5" />
                  Pay Now
                </button>
                <p className="text-xs text-slate-400 text-center mt-3">Secured by SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
