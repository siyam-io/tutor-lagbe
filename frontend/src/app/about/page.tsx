import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  LuShieldCheck,
  LuGraduationCap,
  LuSparkles,
  LuCompass,
  LuArrowRight,
} from "react-icons/lu";
import { FiHelpCircle, FiCheckCircle } from "react-icons/fi";

const stats = [
  { label: "অভিজ্ঞ ও ভেরিফাইড শিক্ষক", value: "১০,০০০+", sub: "Verified Tutors" },
  { label: "সফল টিউশন ম্যাচ", value: "২৫,০০০+", sub: "Tuitions Matched" },
  { label: "সারাদেশে কভারেজ", value: "৬৪ জেলা", sub: "All 64 Districts" },
  { label: "সন্তুষ্টির হার", value: "৯৮.৫%", sub: "Satisfaction Rate" },
];

const values = [
  {
    icon: LuShieldCheck,
    title: "১০০% নিরাপদ ও যাচাইকৃত",
    enTitle: "Vetted & Verified",
    desc: "প্রতিটি টিউটরের জাতীয় পরিচয়পত্র (NID) এবং বিশ্ববিদ্যালয় সার্টিফিকেট কঠোরভাবে ভেরিফাই করে ব্লু ব্যাজ দেওয়া হয়।",
  },
  {
    icon: LuGraduationCap,
    title: "শীর্ষ বিশ্ববিদ্যালয়ের শিক্ষক",
    enTitle: "Top University Mentors",
    desc: "বুয়েট, ঢাকা বিশ্ববিদ্যালয়, ডিএমসি, আইবিএ, ব্র্যাক ও নর্থ সাউথের সেরা মেধাবীদের কাছ থেকে সরাসরি পড়ার সুযোগ।",
  },
  {
    icon: LuCompass,
    title: "ফ্রি ট্রায়াল ডেমো ক্লাস",
    enTitle: "Free Demo Trial",
    desc: "চূড়ান্ত সিদ্ধান্তের আগে ১টি ট্রায়াল ক্লাস নিন। শিক্ষক ও শিক্ষার্থীর বোঝাপড়া শতভাগ সন্তোষজনক হলেই কনফার্ম করুন।",
  },
  {
    icon: LuSparkles,
    title: "জিরো হিডেন ফি ও স্বচ্ছতা",
    enTitle: "Fair & Transparent",
    desc: "কোনো মধ্যস্বত্বভোগী বা দালাল ছাড়া সরাসরি টিউটরের সাথে কথা বলুন ও অভিভাবকবান্ধব সম্মানীতে টিউশন নিশ্চিত করুন।",
  },
];

const steps = [
  {
    step: "০১",
    title: "টিউশন পোস্ট বা টিউটর সার্চ করুন",
    desc: "আপনার সন্তানের শ্রেণী, মাধ্যম (বাংলা/ইংরেজি), এলাকা ও বাজেট অনুযায়ী সার্চ করুন অথবা ফ্রি পোস্ট করুন।",
  },
  {
    step: "০২",
    title: "প্রোফাইল যাচাই ও আবেদন পর্যালোচনা",
    desc: "শিক্ষকদের শিক্ষাগত যোগ্যতা, অতীতের রিভিউ, অভিজ্ঞতা ও এলাকা দেখে সেরা শিক্ষককে বাছাই করুন।",
  },
  {
    step: "০৩",
    title: "ডেমো ক্লাসের পর নিশ্চিন্তে শুরু করুন",
    desc: "ট্রায়াল ক্লাস নিয়ে সন্তুষ্ট হলে শিডিউল ফাইনাল করুন এবং নিরাপদ প্ল্যাটফর্ম গ্যারান্টির মাধ্যমে পড়ালেখা শুরু করুন।",
  },
];

const team = [
  {
    name: "তানভীর আহমেদ",
    enName: "Tanvir Ahmed",
    role: "Founder & CEO",
    bg: "Ex-BUET CSE, EdTech Strategist",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
  },
  {
    name: "ফাহমিদা তাসনিম",
    enName: "Fahmida Tasnim",
    role: "Head of Academic Operations",
    bg: "University of Dhaka (English), 7+ yrs Educationist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
  },
  {
    name: "আরিফুল ইসলাম",
    enName: "Ariful Islam",
    role: "Chief Technology Officer",
    bg: "System Architect, Cloud & Security Specialist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
  },
  {
    name: "মায়িশা ফারজানা",
    enName: "Mayisha Farzana",
    role: "Community & Trust Lead",
    bg: "IBA (DU), Student-Tutor Welfare Coordinator",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
  },
];

const faqs = [
  {
    q: "টিউশন বা শিক্ষক খোঁজার জন্য কি অভিভাবককে কোনো চার্জ দিতে হবে?",
    a: "না, অভিভাবকদের জন্য প্ল্যাটফর্মে শিক্ষক খোঁজা এবং টিউশন বিজ্ঞাপন পোস্ট করা সম্পূর্ণ ফ্রি।",
  },
  {
    q: "শিক্ষকদের শিক্ষাগত যোগ্যতা কীভাবে যাচাই করা হয়?",
    a: "প্রত্যেক টিউটরকে রেজিস্ট্রেশনের পর তাদের NID কার্ড, বর্তমান বিশ্ববিদ্যালয়ের স্টুডেন্ট আইডি এবং শিক্ষাগত সনদপত্র আপলোড করতে হয়। আমাদের অ্যাডমিন টিম এগুলো ম্যানুয়ালি রিভিউ করে তবেই 'Verified' ব্যাজ অনুমোদন করে।",
  },
  {
    q: "ডেমো ক্লাসের সুবিধা কীভাবে কাজ করে?",
    a: "একজন শিক্ষকের সাথে যোগাযোগের পর আপনি ১ দিনের একটি ট্রায়াল ক্লাস অনুরোধ করতে পারবেন। এতে করে শিক্ষার্থীর সাথে শিক্ষকের পড়ানোর ধরণ সামঞ্জস্যপূর্ণ কি না তা যাচাই করা যায়।",
  },
  {
    q: "অনলাইন এবং অফলাইন উভয় ধরণের টিউশন কি পাওয়া যায়?",
    a: "হ্যাঁ, আপনার পছন্দ অনুযায়ী হোম টিউশন (বাসায় এসে পড়ানো) অথবা অনলাইন টিউশন (গুগল মিট/জুমের মাধ্যমে) উভয় মাধ্যমেই শিক্ষক নির্বাচন করতে পারবেন।",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-canvas min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-20 lg:pt-28 lg:pb-28 border-b border-stone/50">
          <div className="absolute inset-0 bg-radial-gradient from-sage/10 to-transparent pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-800 text-xs font-semibold uppercase tracking-wider mb-6 border border-primary-100 shadow-xs">
              <LuSparkles className="w-3.5 h-3.5 text-primary-700" />
              <span>আমাদের পরিচয় ও লক্ষ্য • Trusted Since 2024</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-ink leading-tight">
              সঠিক শিক্ষকের সাথে প্রতিটি শিক্ষার্থীর{" "}
              <span className="text-primary-800 italic underline decoration-sage/40 decoration-wavy">
                উজ্জ্বল ভবিষ্যৎ
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-muted mt-6 max-w-3xl mx-auto leading-relaxed font-bangla">
              “টিউটর লাগবে” বাংলাদেশের প্রথম আধুনিক ও বিশ্বাসযোগ্য টিউটরিং প্ল্যাটফর্ম, 
              যা মেধা ও প্রয়োজনকে এক সুতোয় বেঁধে ঘরে ঘরে মানসম্মত শিক্ষা পৌঁছে দেয়।
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/find-tutor"
                className="btn-primary py-3 px-7 text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <span>টিউটর খুঁজুন</span>
                <LuArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="btn-outline py-3 px-7 text-sm font-semibold hover:bg-clay-light"
              >
                শিক্ষক হিসেবে যোগ দিন
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Counter Bar */}
        <section className="py-12 bg-white/70 border-b border-stone/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
              {stats.map((item) => (
                <div key={item.sub} className="p-4 rounded-2xl bg-canvas/60 border border-stone/60">
                  <p className="font-display text-3xl sm:text-4xl font-extrabold text-primary-800">
                    {item.value}
                  </p>
                  <p className="text-sm font-semibold text-ink mt-1 font-bangla">
                    {item.label}
                  </p>
                  <p className="text-xs text-ink-muted/80 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary-800 uppercase tracking-widest block mb-2 font-bangla">
              কেন আমরা আলাদা?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
              শিক্ষার বিশ্বাসযোগ্যতায় আমাদের অঙ্গীকার
            </h2>
            <p className="text-ink-muted text-sm sm:text-base mt-3 leading-relaxed">
              টিউশন পাওয়ার জটিলতা এবং অনিরাপদ লেনদেন দূর করে আমরা তৈরি করেছি স্বচ্ছ একটি প্ল্যাটফর্ম।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.enTitle}
                  className="p-8 rounded-2xl bg-white border border-stone/80 hover:border-primary-700/50 hover:shadow-sm transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-800 group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink mb-1">
                    {val.title}
                  </h3>
                  <p className="text-xs font-medium text-primary-700 uppercase tracking-wider mb-3">
                    {val.enTitle}
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed font-bangla">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3 Steps How It Works */}
        <section className="py-20 bg-primary-900 text-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-cream uppercase tracking-widest block mb-2">
                সহজ ৩টি ধাপ
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                কীভাবে কাজ করে “টিউটর লাগবে”?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((st) => (
                <div
                  key={st.step}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 relative"
                >
                  <span className="font-display text-4xl font-black text-white/20 block mb-4">
                    {st.step}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white mb-3">
                    {st.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed font-bangla">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary-800 uppercase tracking-widest block mb-2">
              আমাদের টিম
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
              শিক্ষাকে ভালোবাসেন এমন একদল স্বপ্নবাজ
            </h2>
            <p className="text-ink-muted text-sm sm:text-base mt-3">
              অভিজ্ঞ শিক্ষক ও প্রযুক্তিবিদদের সমন্বয়ে পরিচালিত আমাদের দল সবসময় আপনার পাশে।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.enName}
                className="rounded-2xl bg-white border border-stone/80 overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                <div className="aspect-square relative overflow-hidden bg-clay">
                  <img
                    src={member.image}
                    alt={member.enName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display font-bold text-lg text-ink">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary-700 mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                    {member.bg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-clay-light/40 border-t border-stone/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-primary-800 uppercase tracking-widest block mb-2">
                সাধারণ জিজ্ঞাসা
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
                প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-white rounded-2xl border border-stone/80 p-6 [&_summary::-webkit-details-marker]:none cursor-pointer transition-all duration-200 hover:border-primary-700/60"
                >
                  <summary className="flex items-center justify-between text-base font-bold text-ink gap-4">
                    <span className="flex items-center gap-3">
                      <FiHelpCircle className="w-5 h-5 text-primary-700 flex-shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <span className="text-xl text-primary-800 transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 pt-4 border-t border-stone/40 text-sm text-ink-muted leading-relaxed font-bangla pl-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
