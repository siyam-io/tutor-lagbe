import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tutor Lagbe | টিউটর লাগবে - Find The Best Tutors in Bangladesh",
  description:
    "Bangladesh's premier tutor matching platform. Connect with qualified tutors for home tuition, online classes, and group studies. Verified tutors, fast booking, safe payments.",
  keywords: [
    "tutor",
    "bangladesh",
    "home tuition",
    "online class",
    "tutor lagbe",
    "টিউটর",
    "শিক্ষক",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 antialiased">
        {children}
      </body>
    </html>
  );
}
