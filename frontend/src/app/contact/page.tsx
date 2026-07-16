"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlinePaperAirplane, HiOutlineUser } from "react-icons/hi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

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
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">Contact Us</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-12">
            Have questions? We&apos;d love to hear from you.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Your Name</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className="input-field pl-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="input-field pl-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <HiOutlinePaperAirplane className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <HiOutlineMail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">Email</p>
                      <p className="text-slate-500 text-sm">support@tutorlagbe.com</p>
                      <p className="text-slate-500 text-sm">info@tutorlagbe.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <HiOutlinePhone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">Phone</p>
                      <p className="text-slate-500 text-sm">+880 1700-000000</p>
                      <p className="text-slate-500 text-sm">+880 1800-000000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <HiOutlineLocationMarker className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">Office</p>
                      <p className="text-slate-500 text-sm">House 42, Road 15, Block D</p>
                      <p className="text-slate-500 text-sm">Banani, Dhaka 1213, Bangladesh</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="card p-0 overflow-hidden">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <div className="text-center text-slate-500 dark:text-slate-400">
                    <HiOutlineLocationMarker className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Google Maps</p>
                    <p className="text-sm">Banani, Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="card">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { icon: FaFacebook, label: "Facebook", color: "hover:bg-blue-600" },
                    { icon: FaTwitter, label: "Twitter", color: "hover:bg-sky-500" },
                    { icon: FaInstagram, label: "Instagram", color: "hover:bg-pink-600" },
                    { icon: FaLinkedin, label: "LinkedIn", color: "hover:bg-blue-700" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href="#"
                      aria-label={social.label}
                      className={`w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white transition-all ${social.color}`}
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


