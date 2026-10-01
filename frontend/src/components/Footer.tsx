import Link from "next/link";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const footerLinks = {
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/find-tutor", label: "Find Tutor" },
    { href: "/register", label: "Become a Tutor" },
  ],
  Support: [
    { href: "/faq", label: "FAQ" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/refund", label: "Refund Policy" },
  ],
  Subjects: [
    { href: "/find-tutor?subject=Mathematics", label: "Mathematics" },
    { href: "/find-tutor?subject=Physics", label: "Physics" },
    { href: "/find-tutor?subject=English", label: "English" },
    { href: "/find-tutor?subject=Chemistry", label: "Chemistry" },
  ],
};

const socialLinks = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
];

const trustBadges = [
  {
    icon: "🛡️",
    title: "১০০% ভেরিফাইড শিক্ষক",
    sub: "NID ও সার্টিফিকেট যাচাইকৃত",
  },
  { icon: "🎓", title: "ফ্রি ট্রায়াল ক্লাস", sub: "পছন্দ হলে তবেই কনফার্ম করুন" },
  {
    icon: "🔒",
    title: "নিরাপদ পেমেন্ট গেটওয়ে",
    sub: "বিকাশ, নগদ ও ব্যাংক ট্রান্সফার",
  },
  { icon: "📞", title: "২৪/৭ কাস্টমার সাপোর্ট", sub: "যেকোনো তথ্যে পাশে আছি" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <span className="text-2xl">🎓</span>
              <span className="font-display font-semibold text-xl text-white">
                Tutor Lagbe
              </span>
            </Link>
            <p className="text-white/60 mb-8 max-w-sm leading-relaxed">
              Bangladesh&apos;s premier platform connecting students with
              qualified tutors. Verified profiles, easy booking, and secure
              payments.
            </p>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-white/60">
                <HiOutlineMail className="w-5 h-5 text-sage-300" />
                <span>support@tutorlagbe.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <HiOutlinePhone className="w-5 h-5 text-sage-300" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <HiOutlineLocationMarker className="w-5 h-5 text-sage-300" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-white text-lg mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-sage-300 transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Badges & Guarantee Strip */}
        <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {trustBadges.map((badge) => (
            <div
              key={badge.title}
              className="p-5 rounded-card bg-white/5 border border-white/10"
            >
              <span className="text-2xl mb-2 block">{badge.icon}</span>
              <p className="font-medium text-white text-sm">{badge.title}</p>
              <p className="text-xs text-white/50 mt-1.5">{badge.sub}</p>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Tutor Lagbe. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-sage transition-colors duration-300 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-300 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                <social.icon className="w-4 h-4 text-white/70 hover:text-primary-900 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
