import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HiOutlineAcademicCap,
  HiOutlineGlobe,
  HiOutlineHeart,
} from "react-icons/hi";

const missionVision = [
  {
    icon: HiOutlineHeart,
    title: "Our Mission",
    body: "To make quality education accessible to every student in Bangladesh by connecting them with the best tutors in their area. We believe every child deserves the opportunity to excel academically.",
  },
  {
    icon: HiOutlineGlobe,
    title: "Our Vision",
    body: "To become the go-to platform for education in Bangladesh, bridging the gap between talented educators and eager learners across the country, from cities to villages.",
  },
];

const team = [
  { name: "Ahsan Kabir", role: "CEO & Founder", initials: "AK" },
  { name: "Nusrat Jahan", role: "CTO", initials: "NJ" },
  { name: "Tanvir Hasan", role: "Head of Operations", initials: "TH" },
  { name: "Sadia Islam", role: "Head of Marketing", initials: "SI" },
];

const faqs = [
  {
    q: "How do I find a tutor?",
    a: "Simply search by subject, location, or class on our Find Tutor page. You can filter by budget, experience, and more to find the perfect match.",
  },
  {
    q: "How are tutors verified?",
    a: "All tutors submit academic credentials and NID for verification. Our team reviews each application before approval. Look for the verified badge on tutor profiles.",
  },
  {
    q: "What subjects are covered?",
    a: "We cover all major subjects from Class 1 to University level, including Mathematics, Physics, Chemistry, English, Bengali, ICT, and more.",
  },
  {
    q: "How does payment work?",
    a: "Payments are processed securely through bKash, Nagad, Rocket, Visa, or Mastercard. You only pay after confirming your booking.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
          {/* Arch outline — the recurring architectural motif */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-arch border border-stone pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-4 block">
              আমাদের সম্পর্কে
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight text-ink leading-tight text-balance">
              About <em className="italic text-primary-700">Tutor Lagbe</em>
            </h1>
            <p className="text-xl font-bangla text-ink-muted mt-5">
              টিউটর লাগবে
            </p>
            <p className="text-lg text-ink-muted mt-6 max-w-2xl mx-auto leading-relaxed">
              Bangladesh&apos;s trusted platform connecting students with
              qualified tutors since 2024.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-24">
            {missionVision.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card p-8 hover:translate-y-0">
                  <span className="stat-icon mb-6">
                    <Icon className="w-6 h-6" />
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-ink mb-4">
                    {item.title}
                  </h2>
                  <p className="text-ink-muted leading-relaxed">{item.body}</p>
                </div>
              );
            })}
          </div>

          {/* Team */}
          <div className="mb-24">
            <div className="text-center mb-14">
              <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                আমাদের দল
              </span>
              <h2 className="section-title mb-0">Our Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={member.name}
                  className={`card text-center p-8 ${
                    index % 2 === 1 ? "md:translate-y-8" : ""
                  }`}
                >
                  <div className="w-20 h-20 rounded-image bg-clay/50 border border-stone flex items-center justify-center font-display text-2xl font-semibold text-primary-800 mx-auto mb-5">
                    {member.initials}
                  </div>
                  <h3 className="font-display font-semibold text-ink">
                    {member.name}
                  </h3>
                  <p className="text-sm text-ink-muted mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <div className="text-center mb-14">
              <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                সাধারণ জিজ্ঞাসা
              </span>
              <h2 className="section-title mb-0">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="card group cursor-pointer p-6 hover:translate-y-0 hover:shadow-soft-lg"
                >
                  <summary className="font-display font-semibold text-ink list-none flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="text-sage-700 group-open:rotate-180 transition-transform duration-500 ease-out">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-ink-muted text-sm leading-relaxed">
                    {faq.a}
                  </p>
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
