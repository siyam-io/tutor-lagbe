"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { HiOutlineCurrencyDollar, HiOutlineTrendingUp, HiOutlineArrowUp } from "react-icons/hi";

export default function TutorAnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="TUTOR" />
      <div className="flex-1 p-6 lg:p-12">
        <div className="max-w-6xl">
          <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
            পারফরম্যান্স
          </span>
          <h1 className="font-display text-4xl font-semibold text-ink mb-3">Analytics</h1>
          <p className="text-ink-muted mb-12">Track your performance and growth</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            {/* Monthly Income Chart */}
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-ink mb-8 flex items-center gap-2">
                <HiOutlineCurrencyDollar className="w-5 h-5 text-sage-700" /> Monthly Income
              </h2>
              <div className="h-72 flex items-end justify-between gap-2 px-4">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
                  const heights = [35, 55, 40, 75, 60, 85];
                  const amounts = ["28K", "44K", "32K", "60K", "48K", "68K"];
                  return (
                    <div key={month} className="flex flex-col items-center flex-1">
                      <span className="text-xs font-medium text-ink-muted mb-2">{amounts[i]}</span>
                      <div
                        className="w-full max-w-[45px] bg-primary-800 rounded-t-full hover:bg-primary-700 transition-colors duration-300 cursor-pointer"
                        style={{ height: `${heights[i]}%` }}
                      />
                      <span className="text-xs text-ink-muted mt-2">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Growth */}
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-ink mb-8 flex items-center gap-2">
                <HiOutlineTrendingUp className="w-5 h-5 text-sage-700" /> Student Growth
              </h2>
              <div className="h-72 flex items-end justify-between gap-2 px-4">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
                  const heights = [20, 30, 45, 35, 55, 65];
                  const counts = ["4", "6", "9", "7", "11", "13"];
                  return (
                    <div key={month} className="flex flex-col items-center flex-1">
                      <span className="text-xs font-medium text-ink-muted mb-2">{counts[i]}</span>
                      <div
                        className="w-full max-w-[45px] bg-sage rounded-t-full hover:bg-sage-600 transition-colors duration-300 cursor-pointer"
                        style={{ height: `${heights[i]}%` }}
                      />
                      <span className="text-xs text-ink-muted mt-2">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: "Completion Rate", value: "94%", change: "+5%", color: "text-sage-700" },
              { label: "Avg Session Rating", value: "4.8/5", change: "+0.2", color: "text-sage-700" },
              { label: "Retention Rate", value: "87%", change: "+3%", color: "text-sage-700" },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <p className="font-display text-3xl font-semibold text-ink mb-2">{stat.value}</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-sm text-ink-muted">{stat.label}</p>
                  <span className={`text-xs font-medium flex items-center ${stat.color}`}>
                    <HiOutlineArrowUp className="w-3 h-3" /> {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
