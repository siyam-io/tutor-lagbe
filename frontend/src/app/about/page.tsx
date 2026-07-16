import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiOutlineAcademicCap, HiOutlineGlobe, HiOutlineHeart } from "react-icons/hi";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About Tutor Lagbe</h1>
            <p className="text-xl text-primary-200 font-bangla">টিউটর লাগবে</p>
            <p className="text-lg text-primary-100 mt-6 max-w-2xl mx-auto">
              Bangladesh&apos;s trusted platform connecting students with qualified tutors since 2024.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="card">
              <HiOutlineHeart className="w-10 h-10 text-primary-600 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Our Mission</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To make quality education accessible to every student in Bangladesh by connecting them with the best tutors in their area. We believe every child deserves the opportunity to excel academically.
              </p>
            </div>
            <div className="card">
              <HiOutlineGlobe className="w-10 h-10 text-primary-600 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Our Vision</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To become the go-to platform for education in Bangladesh, bridging the gap between talented educators and eager learners across the country, from cities to villages.
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Ahsan Kabir", role: "CEO & Founder", initials: "AK" },
                { name: "Nusrat Jahan", role: "CTO", initials: "NJ" },
                { name: "Tanvir Hasan", role: "Head of Operations", initials: "TH" },
                { name: "Sadia Islam", role: "Head of Marketing", initials: "SI" },
              ].map((member) => (
                <div key={member.name} className="card text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                    {member.initials}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                { q: "How do I find a tutor?", a: "Simply search by subject, location, or class on our Find Tutor page. You can filter by budget, experience, and more to find the perfect match." },
                { q: "How are tutors verified?", a: "All tutors submit academic credentials and NID for verification. Our team reviews each application before approval. Look for the verified badge on tutor profiles." },
                { q: "What subjects are covered?", a: "We cover all major subjects from Class 1 to University level, including Mathematics, Physics, Chemistry, English, Bengali, ICT, and more." },
                { q: "How does payment work?", a: "Payments are processed securely through bKash, Nagad, Rocket, Visa, or Mastercard. You only pay after confirming your booking." },
              ].map((faq) => (
                <details key={faq.q} className="card group cursor-pointer">
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
