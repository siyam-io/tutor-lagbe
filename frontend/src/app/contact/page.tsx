"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlinePaperAirplane,
  HiOutlineUser,
} from "react-icons/hi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const socialLinks = [
  { icon: FaFacebook, label: "Facebook" },
  { icon: FaTwitter, label: "Twitter" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaLinkedin, label: "LinkedIn" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
              যোগাযোগ
            </span>
            <h1 className="section-title mb-3">
              Contact <em>Us</em>
            </h1>
            <p className="text-ink-muted">
              Have questions? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="card p-8 hover:translate-y-0">
              <h2 className="font-display text-2xl font-semibold text-ink mb-7">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Your Name</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className="input-field pl-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="input-field pl-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="How can we help you?"
                    className="input-field"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <HiOutlinePaperAirplane className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Instant Help Card */}
              <div className="p-8 rounded-card bg-primary-800 text-white relative overflow-hidden">
                <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full border border-sage/20 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] uppercase font-medium tracking-widest px-3 py-1 bg-white/10 rounded-full">
                      তাৎক্ষণিক সহায়তা
                    </span>
                    <span className="text-xs text-sage-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sage animate-ping" />
                      ১৫ মিনিটে রিপ্লাই
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    অভিভাবক ও শিক্ষক হেল্পলাইন
                  </h3>
                  <p className="text-xs text-white/60 mb-6 leading-relaxed">
                    জরুরি শিক্ষক প্রয়োজন বা যে কোনো তথ্যে সরাসরি আমাদের টিম
                    মেম্বারের সাথে WhatsApp এ কথা বলুন।
                  </p>
                  <a
                    href="https://wa.me/8801700000000?text=Hello%20Tutor%20Lagbe,%20I%20have%20an%20inquiry."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-full bg-white text-primary-800 hover:bg-clay-light font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    <span>WhatsApp এ সরাসরি যোগাযোগ</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>

              <div className="card p-8 hover:translate-y-0">
                <h2 className="font-display text-2xl font-semibold text-ink mb-7">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="stat-icon">
                      <HiOutlineMail className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="font-medium text-ink text-sm">Email</p>
                      <p className="text-ink-muted text-sm">
                        support@tutorlagbe.com
                      </p>
                      <p className="text-ink-muted text-sm">
                        info@tutorlagbe.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="stat-icon">
                      <HiOutlinePhone className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="font-medium text-ink text-sm">
                        Phone Hotline
                      </p>
                      <p className="text-ink-muted text-sm">
                        +880 1700-000000 (সকাল ৯টা - রাত ১০টা)
                      </p>
                      <p className="text-ink-muted text-sm">
                        +880 1800-000000
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="stat-icon">
                      <HiOutlineLocationMarker className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="font-medium text-ink text-sm">Office</p>
                      <p className="text-ink-muted text-sm">
                        House 42, Road 15, Block D
                      </p>
                      <p className="text-ink-muted text-sm">
                        Banani, Dhaka 1213, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="card p-0 overflow-hidden hover:translate-y-0">
                <div className="h-64 bg-clay-light border-b border-stone flex items-center justify-center">
                  <div className="text-center text-ink-muted">
                    <HiOutlineLocationMarker className="w-12 h-12 mx-auto mb-3 text-sage-700" />
                    <p className="font-medium text-ink">Google Maps</p>
                    <p className="text-sm">Banani, Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="card p-8 hover:translate-y-0">
                <h3 className="font-display font-semibold text-ink mb-5">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href="#"
                      aria-label={social.label}
                      className="w-11 h-11 rounded-full bg-clay-light border border-stone flex items-center justify-center text-ink-muted hover:text-white hover:bg-primary-800 hover:border-primary-800 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
