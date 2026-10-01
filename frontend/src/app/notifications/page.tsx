"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import {
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineChat,
  HiOutlineCreditCard,
  HiOutlineCheck,
} from "react-icons/hi";

const iconMap = {
  BOOKING_ACCEPTED: {
    icon: HiOutlineCheck,
    tone: "bg-sage/15 text-sage-800",
  },
  BOOKING_REJECTED: {
    icon: HiOutlineCheck,
    tone: "bg-terracotta/10 text-terracotta-800",
  },
  BOOKING_REQUESTED: {
    icon: HiOutlineCalendar,
    tone: "bg-clay/40 text-primary-800",
  },
  SESSION_REMINDER: {
    icon: HiOutlineCalendar,
    tone: "bg-clay/40 text-primary-800",
  },
  PAYMENT_SUCCESS: {
    icon: HiOutlineCreditCard,
    tone: "bg-primary-50 text-primary-800",
  },
  NEW_MESSAGE: { icon: HiOutlineChat, tone: "bg-sage/10 text-sage-700" },
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
      <main className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                আপনার অ্যাক্টিভিটি
              </span>
              <h1 className="font-display text-4xl font-semibold text-ink">
                Notifications
              </h1>
              <p className="text-ink-muted mt-2">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-700 hover:text-primary-800 font-medium transition-colors duration-300 whitespace-nowrap"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone border-t-primary-800 mx-auto" />
              <p className="text-ink-muted mt-4 text-sm">
                Loading notifications...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta-800 rounded-card text-center">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="card text-center py-16 hover:translate-y-0">
                  <HiOutlineBell className="w-16 h-16 mx-auto text-stone mb-5" />
                  <p className="font-display text-lg font-medium text-ink-muted">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const typeInfo = iconMap[
                    notification.type as keyof typeof iconMap
                  ] || {
                    icon: HiOutlineBell,
                    tone: "bg-clay-light text-ink-muted",
                  };
                  const Icon = typeInfo.icon;
                  const unread = !notification.isRead;
                  return (
                    <div
                      key={notification.id}
                      onClick={() =>
                        unread && handleMarkAsRead(notification.id)
                      }
                      className={`card flex gap-4 items-start cursor-pointer p-5 hover:translate-y-0 ${
                        unread
                          ? "border-l-2 border-l-primary-700"
                          : "opacity-80"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${typeInfo.tone}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3
                              className={`font-medium text-sm ${
                                unread ? "text-ink" : "text-ink-muted"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <p className="text-sm text-ink-muted mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {unread && (
                            <span className="w-2.5 h-2.5 rounded-full bg-primary-700 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-ink-muted/70 mt-3">
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
