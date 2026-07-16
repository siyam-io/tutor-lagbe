"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { HiOutlineBell, HiOutlineCalendar, HiOutlineChat, HiOutlineCreditCard, HiOutlineCheck } from "react-icons/hi";

const iconMap = {
  BOOKING_ACCEPTED: { icon: HiOutlineCheck, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" },
  BOOKING_REJECTED: { icon: HiOutlineCheck, color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" },
  BOOKING_REQUESTED: { icon: HiOutlineCalendar, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
  SESSION_REMINDER: { icon: HiOutlineCalendar, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
  PAYMENT_SUCCESS: { icon: HiOutlineCreditCard, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" },
  NEW_MESSAGE: { icon: HiOutlineChat, color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      if (data.success) {
        setNotifications(data.data || []);
      }
    } catch (err: any) {
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const { data } = await api.patch(`/notifications/${id}/read`);
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { data } = await api.patch("/notifications/read-all");
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-slate-500 mt-2 text-sm">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-650 rounded-lg text-center">{error}</div>
          ) : (
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="card text-center py-12">
                  <HiOutlineBell className="w-16 h-16 mx-auto text-slate-355 dark:text-slate-600 mb-4" />
                  <p className="text-lg font-medium text-slate-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const typeInfo = iconMap[notification.type as keyof typeof iconMap] || {
                    icon: HiOutlineBell,
                    color: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
                  };
                  const Icon = typeInfo.icon;
                  return (
                    <div
                      key={notification.id}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                      className={`card flex gap-4 items-start cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all ${
                        !notification.isRead ? "border-l-4 border-l-primary-600 bg-primary-50/10 dark:bg-primary-950/5" : ""
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{notification.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{notification.message}</p>
                          </div>
                          {!notification.isRead && (
                            <span className="w-2.5 h-2.5 rounded-full bg-primary-600 flex-shrink-0 mt-1.5 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
