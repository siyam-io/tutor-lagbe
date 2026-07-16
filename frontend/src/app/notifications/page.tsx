"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiOutlineBell, HiOutlineCalendar, HiOutlineChat, HiOutlineCreditCard, HiOutlineCheck } from "react-icons/hi";

const notifications = [
  { id: "1", type: "BOOKING_ACCEPTED", title: "Booking Accepted", message: "Md. Rahman accepted your tuition request for Mathematics.", time: "2 hours ago", read: false },
  { id: "2", type: "SESSION_REMINDER", title: "Session Reminder", message: "You have a Physics class with Fatema Akter tomorrow at 2:00 PM.", time: "5 hours ago", read: false },
  { id: "3", type: "PAYMENT_SUCCESS", title: "Payment Successful", message: "Your payment of ৳16,050 to Md. Rahman was successful.", time: "1 day ago", read: true },
  { id: "4", type: "NEW_MESSAGE", title: "New Message", message: "You have a new message from Tanvir Hasan.", time: "2 days ago", read: true },
];

const iconMap = {
  BOOKING_ACCEPTED: { icon: HiOutlineCheck, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" },
  SESSION_REMINDER: { icon: HiOutlineCalendar, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
  PAYMENT_SUCCESS: { icon: HiOutlineCreditCard, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" },
  NEW_MESSAGE: { icon: HiOutlineChat, color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300" },
};

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length;

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
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="card text-center py-12">
                <HiOutlineBell className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-lg font-medium text-slate-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const { icon: Icon, color } = iconMap[notification.type as keyof typeof iconMap];
                return (
                  <div
                    key={notification.id}
                    className={`card flex gap-4 items-start ${!notification.read ? "border-l-4 border-l-primary-600" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{notification.title}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary-600 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
