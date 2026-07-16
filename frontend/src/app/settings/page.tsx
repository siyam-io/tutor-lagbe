"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineBell, HiOutlineGlobe, HiOutlineMoon } from "react-icons/hi";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notifications" | "preferences">("profile");

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: HiOutlineUser },
    { id: "password" as const, label: "Password", icon: HiOutlineLockClosed },
    { id: "notifications" as const, label: "Notifications", icon: HiOutlineBell },
    { id: "preferences" as const, label: "Preferences", icon: HiOutlineMoon },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>

          <div className="card p-0 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === "profile" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      U
                    </div>
                    <div>
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Change Photo</button>
                      <p className="text-xs text-slate-400 mt-1">JPG, GIF or PNG. Max 2MB.</p>
                    </div>
                  </div>
                  <div>
                    <label className="label">Full Name</label>
                    <input type="text" defaultValue="Md. Rahman" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input type="email" defaultValue="rahman@email.com" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input type="tel" defaultValue="+880 1700-000000" className="input-field" />
                  </div>
                  <button className="btn-primary">Save Changes</button>
                </div>
              )}

              {activeTab === "password" && (
                <div className="space-y-5">
                  <div>
                    <label className="label">Current Password</label>
                    <input type="password" placeholder="Enter current password" className="input-field" />
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <input type="password" placeholder="Enter new password" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="input-field" />
                  </div>
                  <button className="btn-primary">Update Password</button>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-slate-500">Receive email updates and alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">SMS Notifications</p>
                      <p className="text-sm text-slate-500">Receive text message alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Session Reminders</p>
                      <p className="text-sm text-slate-500">Get reminded before your sessions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <HiOutlineMoon className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                        <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                  <div>
                    <label className="label flex items-center gap-2">
                      <HiOutlineGlobe className="w-4 h-4" /> Language
                    </label>
                    <select className="input-field">
                      <option value="en">English</option>
                      <option value="bn">বাংলা (Bangla)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
