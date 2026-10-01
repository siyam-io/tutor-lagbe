import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import FloatingCommunicationWidget from "@/components/FloatingCommunicationWidget";

// Body face (Latin). Bengali glyphs fall back via the font stack.
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
  variable: "--font-bangla",
  display: "swap",
});

// Editorial serif display face. Latin-only; Bengali falls back to Hind Siliguri.
const playfair = Playfair_Display({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F8F4",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tutorlagbe.com"),
  title: {
    default: "Tutor Lagbe | টিউটর লাগবে - Find Verified Tutors in Bangladesh",
    template: "%s | Tutor Lagbe",
  },
  description:
    "Bangladesh's most trusted tutor matching platform. Find verified home and online tutors for Bangla Medium, English Medium, and College across Dhaka, Chattogram and all 64 districts.",
  keywords: [
    "tutor lagbe",
    "টিউটর লাগবে",
    "home tutor bangladesh",
    "dhaka tuition",
    "verified tutors",
    "online tuition bangladesh",
    "math tutor dhaka",
    "buet tutor",
    "dhaka university tutor",
    "private teacher",
  ],
  authors: [{ name: "Tutor Lagbe" }],
  creator: "Tutor Lagbe",
  publisher: "Tutor Lagbe",
  openGraph: {
    title: "Tutor Lagbe | টিউটর লাগবে - Find The Best Tutors in Bangladesh",
    description:
      "Connect with qualified, verified tutors for home & online tuition. 100% Free trial class, background checked educators.",
    url: "https://tutorlagbe.com",
    siteName: "Tutor Lagbe",
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tutor Lagbe | টিউটর লাগবে",
    description: "Bangladesh's leading platform for finding verified home and online tutors.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${sourceSans.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="min-h-screen font-sans bg-canvas text-ink antialiased">
        {children}
        <FloatingCommunicationWidget />
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}


