"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineSearch,
  HiOutlineArrowRight,
  HiShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineQuestionMarkCircle,
  HiChevronDown,
  HiStar,
} from "react-icons/hi";
import {
  FaBook,
  FaFlask,
  FaCalculator,
  FaAtom,
  FaGlobe,
  FaLaptopCode,
} from "react-icons/fa";
import api from "@/lib/api";
import TrustHeroBadge from "@/components/TrustHeroBadge";
import TutorCardSkeleton from "@/components/TutorCardSkeleton";
import JsonLd from "@/components/JsonLd";

const subjects = [
  { name: "Mathematics", icon: FaCalculator, bn: "গণিত" },
  { name: "Physics", icon: FaAtom, bn: "পদার্থবিজ্ঞান" },
  { name: "Chemistry", icon: FaFlask, bn: "রসায়ন" },
  { name: "English", icon: FaGlobe, bn: "ইংরেজি" },
  { name: "ICT", icon: FaLaptopCode, bn: "তথ্য ও প্রযুক্তি" },
  { name: "Biology", icon: FaBook, bn: "জীববিজ্ঞান" },
];

const stats = [
  { value: "৫,০০০+", label: "ভেরিফাইড গৃহশিক্ষক", sub: "শীর্ষ বিশ্ববিদ্যালয়ের মেধাবী" },
  { value: "৫০,০০০+", label: "সন্তুষ্ট শিক্ষার্থী ও অভিভাবক", sub: "নিয়মিত পাঠদানরত" },
  { value: "৬৪", label: "জেলায় সার্ভিস", sub: "হোম ও অনলাইন টিউশন" },
  { value: "৯৮%", label: "ইতিবাচক রেটিং", sub: "অভিভাবকদের আস্থায়" },
];

const steps = [
  {
    number: "০১",
    title: "রিকুয়েস্ট পোস্ট বা সার্চ করুন",
    desc: "আপনার সন্তানের শ্রেণি, বিষয় এবং এলাকা নির্বাচন করে উপযুক্ত শিক্ষক খুঁজুন অথবা ফ্রি টিউশন পোস্ট দিন।",
    badge: "সময় লাগে ১ মিনিট",
  },
  {
    number: "০২",
    title: "ফ্রি ডেমো ক্লাস নিশ্চিত করুন",
    desc: "নির্বাচিত শিক্ষকের প্রোফাইল, একাডেমিক ব্যাকগ্রাউন্ড দেখে ফ্রি ডেমো ক্লাস নিন এবং পড়ানোর মান যাচাই করুন।",
    badge: "১০০% ঝুঁকিমুক্ত",
  },
  {
    number: "০৩",
    title: "নিরাপদে ক্লাস শুরু করুন",
    desc: "ডেমো ক্লাস পছন্দ হলে নিয়মিত ক্লাস শুরু করুন। সহজ ও নিরাপদ পেমেন্ট ব্যবস্থাপনায় নিশ্চিন্ত থাকুন।",
    badge: "সুরক্ষিত পেমেন্ট",
  },
];

const testimonials = [
  {
    quote:
      "আমার ছেলের জন্য ধানমন্ডিতে বুয়েটের একজন অভিজ্ঞ ম্যাথ টিউটর মাত্র ২ দিনের মধ্যে পেয়েছি। ডেমো ক্লাসটা খুব ভালো হয়েছিল।",
    name: "সুলতানা জাহান",
    location: "ধানমন্ডি, ঢাকা",
    tag: "অভিভাবক (দশম শ্রেণি)",
    rating: 5,
  },
  {
    quote:
      "টিউশন খোঁজার সবচেয়ে নির্ভরযোগ্য প্ল্যাটফর্ম। কোনো ভোগান্তি ছাড়াই আমার বাসার কাছেই পছন্দের টিউশন পেয়েছি।",
    name: "তানভীর হাসান",
    location: "মিরপুর, ঢাকা",
    tag: "শিক্ষক (ঢাকা বিশ্ববিদ্যালয়)",
    rating: 5,
  },
  {
    quote:
      "ইংলিশ ভার্সনের জন্য ভালো শিক্ষক পাওয়া কষ্টকর ছিল। টিউটর লাগবে-র মাধ্যমে খুব সহজে সঠিক শিক্ষক পেয়েছি।",
    name: "মুহাম্মদ রফিকুল ইসলাম",
    location: "নাসিরাবাদ, চট্টগ্রাম",
    tag: "অভিভাবক (সপ্তম শ্রেণি)",
    rating: 5,
  },
];

const faqs = [
  {
    q: "টিউটররা কীভাবে ভেরিফাইড হন?",
    a: "আমাদের প্ল্যাটফর্মের প্রত্যেক শিক্ষকের জাতীয় পরিচয়পত্র (NID), বিশ্ববিদ্যালয় আইডি কার্ড এবং একাডেমিক সার্টিফিকেটের সত্যতা আমাদের বিশেষ টিম ম্যানুয়ালি যাচাই করে তবেই ভেরিফাইড ব্যাজ প্রদান করে।",
  },
  {
    q: "অভিভাবক হিসেবে টিউটর খুঁজতে কোনো চার্জ দিতে হবে?",
    a: "না, অভিভাবকদের জন্য টিউটর খোঁজা এবং পোস্ট করা সম্পূর্ণ ফ্রি। আপনার জন্য কোনো গোপন চার্জ বা রেজিস্ট্রেশন ফি নেই।",
  },
  {
    q: "ডেমো ক্লাস কি সত্যিই ফ্রি?",
    a: "হ্যাঁ, আপনি শিক্ষকের সাথে আলোচনা করে ১ দিনের ডেমো/ট্রায়াল ক্লাসের ব্যবস্থা করতে পারেন। শিক্ষক আপনার সন্তানের পছন্দ হলে তবেই চূড়ান্ত চুক্তি করুন।",
  },
  {
    q: "পেমেন্ট ব্যবস্থাপনা কীভাবে কাজ করে?",
    a: "আপনি বিকাশ, নগদ বা ব্যাংক কার্ডের মাধ্যমে নিরাপদে ফি পরিশোধ করতে পারেন। টিউটর লাগবে সম্পূর্ণ সুরক্ষিত পেমেন্ট এসক্রো নিশ্চিত করে।",
  },
];

// Every second feature card drops down to break the grid organically.
const stagger = (index: number) =>
  index % 2 === 1 ? "md:translate-y-12" : "";

const initialsOf = (name?: string) =>
  name
    ? name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
    : "TL";

export default function HomePage() {
  const router = useRouter();
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSubject, setSearchSubject] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const fetchFeaturedTutors = async () => {
      try {
        const { data } = await api.get("/tutors?limit=4");
        if (data.success && data.data) {
          setTutors(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured tutors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedTutors();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchSubject) params.set("subject", searchSubject);
    if (searchLocation) params.set("location", searchLocation);
    router.push(`/find-tutor?${params.toString()}`);
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Tutor Lagbe",
    url: "https://tutorlagbe.com",
    logo: "https://tutorlagbe.com/logo.png",
    description:
      "Bangladesh's leading verified tutor matching platform connecting students with expert educators.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BD",
      addressLocality: "Dhaka",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://tutorlagbe.com/find-tutor?subject={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <Navbar />

      <main>
        {/* ---------- Hero ------------------------------------------------ */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              {/* Copy */}
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone bg-white text-[11px] font-medium uppercase tracking-widest text-ink-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-700" />
                  বাংলাদেশের বিশ্বস্ত টিউটর ম্যাচিং
                </span>

                <h1 className="mt-7 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-ink text-balance">
                  সন্তানের পড়াশোনায়{" "}
                  <em className="italic text-primary-700">সেরা শিক্ষক</em>,
                  নিশ্চিন্ত অভিভাবক
                </h1>

                <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-xl">
                  বুয়েট, ঢাবি, মেডিকেল সহ দেশের শীর্ষ প্রতিষ্ঠানের ভেরিফাইড
                  শিক্ষকদের সাথে সরাসরি সংযোগ। ফ্রি ট্রায়াল ক্লাস এবং সম্পূর্ণ
                  নিরাপদ পেমেন্ট।
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/find-tutor" className="btn-primary">
                    <HiOutlineSearch className="w-4 h-4" />
                    টিউটর খুঁজুন
                  </Link>
                  <Link href="/tuitions" className="btn-secondary">
                    টিউশন পোস্ট করুন
                  </Link>
                </div>

                <div className="mt-10">
                  <TrustHeroBadge />
                </div>

                {/* Instant Tutor Matcher */}
                <div className="mt-10 rounded-card border border-stone bg-white p-6 shadow-soft-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="hero-subject" className="label">
                        পছন্দের বিষয় / Subject
                      </label>
                      <select
                        id="hero-subject"
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value)}
                        className="input-field"
                      >
                        <option value="">সকল বিষয় (All Subjects)</option>
                        {subjects.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name} ({s.bn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="hero-location" className="label">
                        আপনার জেলা / Location
                      </label>
                      <select
                        id="hero-location"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="input-field"
                      >
                        <option value="">সকল এলাকা (All Locations)</option>
                        <option value="Dhaka">ঢাকা (Dhaka)</option>
                        <option value="Chattogram">চট্টগ্রাম (Chattogram)</option>
                        <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                        <option value="Khulna">খুলনা (Khulna)</option>
                        <option value="Sylhet">সিলেট (Sylhet)</option>
                        <option value="Barishal">বরিশাল (Barishal)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="btn-primary w-full mt-5"
                  >
                    <HiOutlineSearch className="w-5 h-5" />
                    টিউটর খুঁজুন
                  </button>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-stone text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <HiShieldCheck className="w-4 h-4 text-sage-700" />
                      ১০০% বিনা খরচে খুঁজুন • অভিভাবকের কোনো ফি নেই
                    </span>
                    <Link
                      href="/tuitions"
                      className="font-medium text-primary-700 hover:text-primary-800 transition-colors duration-300"
                    >
                      টিউটর রিকুয়েস্ট পোস্ট করতে চান? &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Arch visual — the iconic architectural moment */}
              <div className="relative animate-fade-in">
                <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
                  <div className="relative aspect-[3/4] rounded-arch border border-stone bg-gradient-to-b from-clay via-clay-light to-canvas shadow-soft-lg overflow-hidden">
                    {/* Concentric botanical rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4/5 aspect-square rounded-full border border-stone/80" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/5 aspect-square rounded-full border border-sage/30" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2/5 aspect-square rounded-full bg-white/70 backdrop-blur-sm border border-stone flex items-center justify-center shadow-soft animate-sway">
                        <HiOutlineAcademicCap className="w-14 h-14 text-sage-700" />
                      </div>
                    </div>
                  </div>

                  {/* Floating glass stat card */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 w-[88%] sm:w-auto">
                    <div className="flex items-center gap-4 rounded-card border border-stone bg-white/80 backdrop-blur-md px-5 py-4 shadow-soft-lg">
                      <span className="stat-icon">🛡️</span>
                      <div>
                        <p className="font-display text-xl font-semibold text-ink leading-none">
                          ৪.৯/৫
                        </p>
                        <p className="text-xs text-ink-muted mt-1">
                          ১২,০০০+ অভিভাবকের আস্থা
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Metrics -------------------------------------------- */}
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="card text-center">
                  <p className="font-display text-3xl sm:text-4xl font-semibold text-primary-800 mb-2">
                    {stat.value}
                  </p>
                  <p className="font-medium text-ink text-sm">{stat.label}</p>
                  <p className="text-xs text-ink-muted mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 3-Step Process ------------------------------------- */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                সহজ ৩ ধাপ
              </span>
              <h2 className="section-title text-balance">
                কীভাবে <em>টিউটর লাগবে</em> কাজ করে?
              </h2>
              <p className="section-subtitle mb-0">
                সন্তানের জন্য পারফেক্ট শিক্ষক পেতে আপনাকে দীর্ঘ সময় অপেক্ষা করতে
                হবে না
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 items-start">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`card p-8 ${stagger(index)}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display text-4xl font-semibold text-sage/50">
                      {step.number}
                    </span>
                    <span className="badge-guarantee">{step.badge}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Popular Subjects ----------------------------------- */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
              <div>
                <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                  বিষয়ভিত্তিক শিক্ষক
                </span>
                <h2 className="section-title mb-0">জনপ্রিয় বিষয়সমূহ</h2>
              </div>
              <Link
                href="/find-tutor"
                className="mt-4 sm:mt-0 text-sm font-medium text-primary-700 hover:text-primary-800 inline-flex items-center gap-1.5 transition-colors duration-300"
              >
                <span>সব বিষয় দেখুন</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                return (
                  <Link
                    key={subject.name}
                    href={`/find-tutor?subject=${encodeURIComponent(subject.name)}`}
                    className="group text-center"
                  >
                    {/* Icons float in soft pale circles — never heavy boxes */}
                    <div className="w-16 h-16 mx-auto rounded-full bg-clay/40 text-sage-700 flex items-center justify-center mb-4 transition-transform duration-500 ease-out group-hover:scale-105">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-sm text-ink">
                      {subject.name}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {subject.bn}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Featured Tutors ------------------------------------ */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-16">
              <div>
                <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                  অভিজ্ঞ শিক্ষকমণ্ডলী
                </span>
                <h2 className="section-title mb-2">শীর্ষ ভেরিফাইড শিক্ষক</h2>
                <p className="text-ink-muted text-sm">
                  অভিভাবকদের সেরা রিভিউ প্রাপ্ত অভিজ্ঞ শিক্ষকগণ
                </p>
              </div>
              <Link
                href="/find-tutor"
                className="hidden sm:inline-flex items-center gap-2 btn-outline text-xs py-2.5 px-6"
              >
                <span>সব শিক্ষক দেখুন</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              {loading ? (
                <TutorCardSkeleton count={4} />
              ) : tutors.length === 0 ? (
                <div className="col-span-full text-center py-16 card border-dashed">
                  <p className="text-ink-muted font-medium">
                    বর্তমানে কোনো শিক্ষক পাওয়া যায়নি।
                  </p>
                  <Link href="/find-tutor" className="btn-primary mt-6">
                    ফিল্টার করে খুঁজুন
                  </Link>
                </div>
              ) : (
                tutors.map((tutor, index) => (
                  <div
                    key={tutor.id}
                    className={`card p-5 flex flex-col justify-between ${stagger(index)}`}
                  >
                    <div>
                      {/* Photo in a soft-radius frame (falls back to initials) */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="relative shrink-0">
                          {tutor.photoUrl ? (
                            <img
                              src={tutor.photoUrl}
                              alt={tutor.user?.name || "Tutor"}
                              className="w-16 h-16 rounded-image object-cover border border-stone"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-image bg-clay/50 border border-stone flex items-center justify-center font-display text-lg font-semibold text-primary-800">
                              {initialsOf(tutor.user?.name)}
                            </div>
                          )}
                          <span
                            className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full"
                            title="NID & Academic Verified"
                          >
                            <HiShieldCheck className="w-4 h-4 text-sage-700" />
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-semibold text-ink truncate text-base">
                            {tutor.user?.name}
                          </h3>
                          <p className="text-xs text-ink-muted truncate flex items-center gap-1 mt-0.5">
                            <HiOutlineAcademicCap className="w-3.5 h-3.5 text-sage-700 flex-shrink-0" />
                            <span>
                              {tutor.institution || "বিশ্ববিদ্যালয় শিক্ষার্থী"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 text-xs">
                        <span className="badge-verified">
                          <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                          ভেরিফাইড
                        </span>
                        <span className="text-ink-muted font-medium">
                          ⚡ ৩০ মিনিটে রিপ্লাই
                        </span>
                      </div>

                      <div className="space-y-2.5 py-4 border-t border-stone text-xs text-ink-muted">
                        <div className="flex justify-between items-center gap-2">
                          <span>বিষয়সমূহ:</span>
                          <span
                            className="font-medium text-ink truncate max-w-[140px]"
                            title={tutor.subjects?.join(", ")}
                          >
                            {tutor.subjects?.slice(0, 2).join(", ") ||
                              "সকল বিষয়"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>রেটিং ও রিভিউ:</span>
                          <span className="font-semibold text-terracotta-700 flex items-center gap-1">
                            <HiStar className="w-3.5 h-3.5" />
                            {tutor.averageRating
                              ? tutor.averageRating.toFixed(1)
                              : "৫.০"}
                            <span className="text-ink-muted text-[11px] font-normal">
                              ({tutor.totalReviews || 12})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>প্রত্যাশিত পারিশ্রমিক:</span>
                          <span className="font-semibold text-primary-800 text-sm">
                            ৳{tutor.expectedSalary || "আলোচনা সাপেক্ষে"}/মাস
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/tutors/${tutor.id}`}
                      className="btn-primary w-full mt-5 text-xs"
                    >
                      প্রোফাইল ও ডেমো ক্লাস
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className="mt-12 text-center sm:hidden">
              <Link
                href="/find-tutor"
                className="btn-outline inline-flex items-center gap-2 text-xs"
              >
                সব শিক্ষক দেখুন <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Testimonials --------------------------------------- */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                অভিভাবকের মতামত
              </span>
              <h2 className="section-title mb-0">
                হাজারো অভিভাবকের <em>আস্থার প্রতীক</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
              {testimonials.map((t, index) => (
                <div
                  key={index}
                  className={`card p-8 flex flex-col justify-between ${stagger(index)}`}
                >
                  <div>
                    <div className="flex gap-0.5 text-terracotta-700 mb-5">
                      {[...Array(t.rating)].map((_, i) => (
                        <HiStar key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    <p className="font-display italic text-lg text-ink leading-relaxed mb-8">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-5 border-t border-stone flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink text-sm">{t.name}</p>
                      <p className="text-xs text-ink-muted">{t.location}</p>
                    </div>
                    <span className="text-[11px] bg-clay-light border border-stone text-ink-muted px-3 py-1 rounded-full font-medium">
                      {t.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FAQ ------------------------------------------------ */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-medium text-sage-700 uppercase tracking-widest mb-3 block">
                সাধারণ জিজ্ঞাসা
              </span>
              <h2 className="section-title mb-0">
                অভিভাবক ও শিক্ষকদের প্রশ্নাবলী
              </h2>
            </div>

            <div className="space-y-5">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="card p-0 overflow-hidden hover:translate-y-0"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 p-6 text-left font-medium text-ink hover:bg-clay-light transition-colors duration-300 rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-700"
                    >
                      <span className="flex items-center gap-3 text-sm sm:text-base">
                        <HiOutlineQuestionMarkCircle className="w-5 h-5 text-sage-700 flex-shrink-0" />
                        {faq.q}
                      </span>
                      <HiChevronDown
                        className={`w-5 h-5 text-ink-muted flex-shrink-0 transition-transform duration-500 ease-out ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm text-ink-muted leading-relaxed border-t border-stone">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Closing CTA ---------------------------------------- */}
        <section className="py-20 lg:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-image bg-primary-800 px-8 py-20 lg:px-20 text-center">
              {/* Ambient botanical rings */}
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-sage/20 pointer-events-none" />
              <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />

              <div className="relative">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight text-balance">
                  আপনার সন্তানের শিক্ষার দায়িত্ব দিন একজন{" "}
                  <em className="italic text-sage-300">দক্ষ শিক্ষকের</em> হাতে
                </h2>
                <p className="text-base sm:text-lg text-white/70 mt-6 mb-10 max-w-2xl mx-auto leading-relaxed">
                  আজই ফ্রি রেজিস্ট্রেশন করুন অথবা ফ্রি টিউশন রিকুয়েস্ট পোস্ট করে
                  সেরা শিক্ষকদের আবেদন পান।
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/find-tutor"
                    className="btn-primary bg-white text-primary-800 hover:bg-clay-light hover:text-primary-800"
                  >
                    এখনই টিউটর খুঁজুন
                  </Link>
                  <Link
                    href="/register"
                    className="btn-secondary border-white/50 text-white hover:border-white hover:text-white hover:bg-white/10"
                  >
                    টিউটর হিসেবে যুক্ত হন
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
