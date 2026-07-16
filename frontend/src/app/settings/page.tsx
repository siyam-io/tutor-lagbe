"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineBell, HiOutlineGlobe, HiOutlineMoon, HiOutlineAcademicCap, HiPlus, HiTrash, HiCheck } from "react-icons/hi";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import { SUBJECTS, CLASSES, MEDIUMS } from "@shared/types";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "tutor" | "notifications" | "preferences">("profile");

  const [form, setForm] = useState({ name: "", email: "", phone: "", avatarUrl: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  // Tutor wizard steps
  const [tutorStep, setTutorStep] = useState(1);
  const [tutorProfile, setTutorProfile] = useState({
    bio: "",
    photoUrl: "",
    gender: "",
    locationDistrict: "",
    locationArea: "",
    expectedSalary: 0,
    hourlyRate: 0,
    experienceYears: 0,
    qualification: "",
    institution: "",
    nidNumber: "",
    documentUrl: "",
    subjects: [] as string[],
    classes: [] as string[],
    mediums: [] as string[],
    availableSlots: [] as string[],
    faqs: [] as { question: string; answer: string }[],
  });

  // Local selectors for Step 2 Tag Editors
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedCls, setSelectedCls] = useState("");
  const [selectedMed, setSelectedMed] = useState("");
  const [selectedSlotDay, setSelectedSlotDay] = useState("Sat");
  const [selectedSlotTime, setSelectedSlotTime] = useState("10:00");

  const addSubject = () => {
    if (!selectedSub) return;
    if (tutorProfile.subjects.includes(selectedSub)) return;
    setTutorProfile((prev) => ({ ...prev, subjects: [...prev.subjects, selectedSub] }));
    setSelectedSub("");
  };

  const removeSubject = (sub: string) => {
    setTutorProfile((prev) => ({ ...prev, subjects: prev.subjects.filter((s) => s !== sub) }));
  };

  const addClass = () => {
    if (!selectedCls) return;
    if (tutorProfile.classes.includes(selectedCls)) return;
    setTutorProfile((prev) => ({ ...prev, classes: [...prev.classes, selectedCls] }));
    setSelectedCls("");
  };

  const removeClass = (cls: string) => {
    setTutorProfile((prev) => ({ ...prev, classes: prev.classes.filter((c) => c !== cls) }));
  };

  const addMedium = () => {
    if (!selectedMed) return;
    if (tutorProfile.mediums.includes(selectedMed)) return;
    setTutorProfile((prev) => ({ ...prev, mediums: [...prev.mediums, selectedMed] }));
    setSelectedMed("");
  };

  const removeMedium = (med: string) => {
    setTutorProfile((prev) => ({ ...prev, mediums: prev.mediums.filter((m) => m !== med) }));
  };

  const addSlot = () => {
    const slot = `${selectedSlotDay}-${selectedSlotTime}`;
    if (tutorProfile.availableSlots.includes(slot)) {
      alert("This slot already exists!");
      return;
    }
    setTutorProfile((prev) => ({ ...prev, availableSlots: [...prev.availableSlots, slot] }));
  };

  const removeSlot = (slotToRemove: string) => {
    setTutorProfile((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((s) => s !== slotToRemove),
    }));
  };

  const [loadingTutor, setLoadingTutor] = useState(false);
  const [tutorSuccessMsg, setTutorSuccessMsg] = useState("");
  const [tutorError, setTutorError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const fetchTutorProfile = async () => {
    if (user?.role !== "TUTOR") return;
    setLoadingTutor(true);
    try {
      const { data } = await api.get("/tutors/profile");
      if (data.success && data.data) {
        const p = data.data;
        setTutorProfile({
          bio: p.bio || "",
          photoUrl: p.photoUrl || "",
          gender: p.gender || "",
          locationDistrict: p.locationDistrict || "",
          locationArea: p.locationArea || "",
          expectedSalary: p.expectedSalary || 0,
          hourlyRate: p.hourlyRate || 0,
          experienceYears: p.experienceYears || 0,
          qualification: p.qualification || "",
          institution: p.institution || "",
          nidNumber: p.nidNumber || "",
          documentUrl: p.documentUrl || "",
          subjects: p.subjects || [],
          classes: p.classes || [],
          mediums: p.mediums || [],
          availableSlots: p.availableSlots || [],
          faqs: p.faqs || [],
        });
      }
    } catch (err) {
      console.error("Failed to fetch tutor profile details:", err);
    } finally {
      setLoadingTutor(false);
    }
  };

  useEffect(() => {
    if (user?.role === "TUTOR" && activeTab === "tutor") {
      fetchTutorProfile();
    }
  }, [user, activeTab]);

  const compressImage = (file: File): Promise<Blob | File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          let quality = 0.75;
          const getCompressedBlob = (q: number) => {
            canvas.toBlob(
              (blob) => {
                if (blob && blob.size > 500 * 1024 && q > 0.1) {
                  getCompressedBlob(q - 0.15);
                } else {
                  resolve(blob || file);
                }
              },
              "image/jpeg",
              q
            );
          };
          getCompressedBlob(quality);
        };
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: "photoUrl" | "documentUrl" | "avatarUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const compressedBlob = await compressImage(file);
      const formData = new FormData();
      formData.append("image", compressedBlob, "image.jpg");
      
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (data.success && data.fileUrl) {
        if (targetField === "avatarUrl") {
          setForm((prev) => ({ ...prev, avatarUrl: data.fileUrl }));
          setTutorProfile((prev) => ({ ...prev, photoUrl: data.fileUrl }));
        } else if (targetField === "photoUrl") {
          setTutorProfile((prev) => ({ ...prev, photoUrl: data.fileUrl }));
          setForm((prev) => ({ ...prev, avatarUrl: data.fileUrl }));
        } else {
          setTutorProfile((prev) => ({ ...prev, [targetField]: data.fileUrl }));
        }
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    setProfileError("");
    try {
      const { data } = await api.put("/auth/profile", {
        name: form.name,
        phone: form.phone,
        avatarUrl: form.avatarUrl,
      });
      if (data.success && data.data) {
        setUser(data.data);
        setProfileSuccessMsg("Basic profile settings updated successfully.");
      }
    } catch (err: any) {
      setProfileError(err.response?.data?.error || "Failed to update profile settings.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    setProfileError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setProfileError("New passwords do not match.");
      return;
    }
    try {
      await api.post("/auth/change-password", passwordForm);
      setProfileSuccessMsg("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setProfileError(err.response?.data?.error || "Failed to change password.");
    }
  };

  const handleSaveTutorProfile = async () => {
    setTutorSuccessMsg("");
    setTutorError("");
    setLoadingTutor(true);
    try {
      const { data } = await api.put("/tutors/profile", {
        ...tutorProfile,
        photoUrl: form.avatarUrl, // Sync photoUrl with avatarUrl on save
        expectedSalary: Number(tutorProfile.expectedSalary),
        hourlyRate: Number(tutorProfile.hourlyRate),
        experienceYears: Number(tutorProfile.experienceYears),
      });
      if (data.success) {
        setTutorSuccessMsg("Tutor profile updated successfully! It will show up on Search once Approved by Admin.");
      }
    } catch (err: any) {
      setTutorError(err.response?.data?.error || "Failed to update tutor profile details.");
    } finally {
      setLoadingTutor(false);
    }
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: HiOutlineUser },
    { id: "password" as const, label: "Password", icon: HiOutlineLockClosed },
    ...(user?.role === "TUTOR" ? [{ id: "tutor" as const, label: "Tutor Profile", icon: HiOutlineAcademicCap }] : []),
    { id: "notifications" as const, label: "Notifications", icon: HiOutlineBell },
    { id: "preferences" as const, label: "Preferences", icon: HiOutlineMoon },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Settings</h1>

          <div className="card p-0 overflow-hidden shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3.5 text-xs md:text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {activeTab === "profile" && (
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  {profileSuccessMsg && <div className="p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200">{profileSuccessMsg}</div>}
                  {profileError && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">{profileError}</div>}
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 text-3xl font-bold shadow-sm overflow-hidden relative">
                      {form.avatarUrl ? <img src={form.avatarUrl} alt={form.name} className="w-full h-full object-cover" /> : form.name[0]}
                    </div>
                    <div>
                      <label className="text-xs bg-primary-600 hover:bg-primary-700 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                        {uploadingImage ? "Compressing & Uploading..." : "Change Photo"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "avatarUrl")} disabled={uploadingImage} />
                      </label>
                      <p className="text-xs text-slate-400 mt-2">Images will be auto-compressed to under 500KB.</p>
                    </div>
                  </div>
                  <div>
                    <label className="label">Full Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input type="email" value={form.email} readOnly className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                  </div>
                  <button type="submit" className="btn-primary py-2 px-6">Save Changes</button>
                </form>
              )}

              {activeTab === "password" && (
                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  {profileSuccessMsg && <div className="p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200">{profileSuccessMsg}</div>}
                  {profileError && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">{profileError}</div>}

                  <div>
                    <label className="label">Current Password</label>
                    <input type="password" placeholder="Enter current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <input type="password" placeholder="Enter new password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="input-field" />
                  </div>
                  <button type="submit" className="btn-primary py-2 px-6">Update Password</button>
                </form>
              )}

              {activeTab === "tutor" && (
                <div className="space-y-8">
                  {/* Step Level Indicators */}
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                    {[
                      { step: 1, label: "About & General" },
                      { step: 2, label: "Teaching & Schedule" },
                      { step: 3, label: "Verification & FAQs" }
                    ].map((s) => (
                      <div key={s.step} className="flex items-center gap-2">
                        <button
                          onClick={() => setTutorStep(s.step)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            tutorStep >= s.step
                              ? "bg-primary-600 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {s.step}
                        </button>
                        <span className={`text-[10px] md:text-xs font-bold ${tutorStep === s.step ? "text-primary-600" : "text-slate-400"}`}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {tutorSuccessMsg && <div className="p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200">{tutorSuccessMsg}</div>}
                  {tutorError && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">{tutorError}</div>}

                  {/* Step 1: Bio & General */}
                  {tutorStep === 1 && (
                    <div className="space-y-6 animate-slide-up">
                      <h3 className="font-bold text-slate-800 dark:text-white text-base">Step 1: Personal Details & Biography</h3>

                      {/* Synced Profile Photo Status */}
                      <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-850 flex items-center justify-center text-slate-500 font-bold overflow-hidden shadow-sm">
                          {form.avatarUrl ? <img src={form.avatarUrl} alt="Portrait" className="w-full h-full object-cover" /> : "Portrait"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Profile Photo</p>
                          <p className="text-[10px] text-slate-400 mt-1">Synced with your account profile picture (Tab 1).</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Hourly Rate (৳/hr)</label>
                          <input type="number" value={tutorProfile.hourlyRate} onChange={(e) => setTutorProfile({ ...tutorProfile, hourlyRate: Number(e.target.value) })} className="input-field" />
                        </div>
                        <div>
                          <label className="label">Expected Salary (Monthly / BDT)</label>
                          <input type="number" value={tutorProfile.expectedSalary} onChange={(e) => setTutorProfile({ ...tutorProfile, expectedSalary: Number(e.target.value) })} className="input-field" />
                        </div>
                      </div>

                      <div>
                        <label className="label">Brief Biography (Bio)</label>
                        <textarea rows={3} value={tutorProfile.bio} onChange={(e) => setTutorProfile({ ...tutorProfile, bio: e.target.value })} placeholder="Tell students about your qualifications and teaching approach..." className="input-field" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Gender</label>
                          <select value={tutorProfile.gender} onChange={(e) => setTutorProfile({ ...tutorProfile, gender: e.target.value })} className="input-field">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="label">Experience Years</label>
                          <input type="number" value={tutorProfile.experienceYears} onChange={(e) => setTutorProfile({ ...tutorProfile, experienceYears: Number(e.target.value) })} className="input-field" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Qualification (Degree)</label>
                          <input type="text" placeholder="e.g. BSc in Mathematics" value={tutorProfile.qualification} onChange={(e) => setTutorProfile({ ...tutorProfile, qualification: e.target.value })} className="input-field" />
                        </div>
                        <div>
                          <label className="label">Institution (University / College)</label>
                          <input type="text" placeholder="e.g. BUET" value={tutorProfile.institution} onChange={(e) => setTutorProfile({ ...tutorProfile, institution: e.target.value })} className="input-field" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Location District</label>
                          <input type="text" placeholder="e.g. Dhaka" value={tutorProfile.locationDistrict} onChange={(e) => setTutorProfile({ ...tutorProfile, locationDistrict: e.target.value })} className="input-field" />
                        </div>
                        <div>
                          <label className="label">Location Area</label>
                          <input type="text" placeholder="e.g. Dhanmondi" value={tutorProfile.locationArea} onChange={(e) => setTutorProfile({ ...tutorProfile, locationArea: e.target.value })} className="input-field" />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={() => setTutorStep(2)} className="btn-primary px-8">Continue to Step 2 →</button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Teaching & Schedule */}
                  {tutorStep === 2 && (
                    <div className="space-y-6 animate-slide-up">
                      <h3 className="font-bold text-slate-800 dark:text-white text-base">Step 2: Subjects, Classes, and Availability</h3>

                      {/* Subjects Tag Editor */}
                      <div className="space-y-2">
                        <label className="label">Subjects I Teach</label>
                        <div className="flex gap-2">
                          <select
                            value={selectedSub}
                            onChange={(e) => setSelectedSub(e.target.value)}
                            className="input-field text-sm flex-1"
                          >
                            <option value="">-- Choose Subject --</option>
                            {SUBJECTS.map((sub) => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={addSubject}
                            className="btn-primary px-4 flex items-center justify-center"
                          >
                            <HiPlus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1.5">
                          {tutorProfile.subjects.length === 0 ? (
                            <span className="text-xs text-slate-400">No subjects added yet.</span>
                          ) : (
                            tutorProfile.subjects.map((sub) => (
                              <span
                                key={sub}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                              >
                                {sub}
                                <button
                                  type="button"
                                  onClick={() => removeSubject(sub)}
                                  className="text-slate-500 hover:text-red-500 font-bold ml-1 text-sm"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Classes Tag Editor */}
                      <div className="space-y-2">
                        <label className="label">Classes I Teach</label>
                        <div className="flex gap-2">
                          <select
                            value={selectedCls}
                            onChange={(e) => setSelectedCls(e.target.value)}
                            className="input-field text-sm flex-1"
                          >
                            <option value="">-- Choose Class --</option>
                            {CLASSES.map((cls) => (
                              <option key={cls} value={cls}>
                                {cls}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={addClass}
                            className="btn-primary px-4 flex items-center justify-center"
                          >
                            <HiPlus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1.5">
                          {tutorProfile.classes.length === 0 ? (
                            <span className="text-xs text-slate-400">No classes added yet.</span>
                          ) : (
                            tutorProfile.classes.map((cls) => (
                              <span
                                key={cls}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                              >
                                {cls}
                                <button
                                  type="button"
                                  onClick={() => removeClass(cls)}
                                  className="text-slate-500 hover:text-red-500 font-bold ml-1 text-sm"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Mediums Tag Editor */}
                      <div className="space-y-2">
                        <label className="label">Mediums I Teach</label>
                        <div className="flex gap-2">
                          <select
                            value={selectedMed}
                            onChange={(e) => setSelectedMed(e.target.value)}
                            className="input-field text-sm flex-1"
                          >
                            <option value="">-- Choose Medium --</option>
                            {MEDIUMS.map((med) => (
                              <option key={med} value={med}>
                                {med}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={addMedium}
                            className="btn-primary px-4 flex items-center justify-center"
                          >
                            <HiPlus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1.5">
                          {tutorProfile.mediums.length === 0 ? (
                            <span className="text-xs text-slate-400">No mediums added yet.</span>
                          ) : (
                            tutorProfile.mediums.map((med) => (
                              <span
                                key={med}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                              >
                                {med}
                                <button
                                  type="button"
                                  onClick={() => removeMedium(med)}
                                  className="text-slate-500 hover:text-red-500 font-bold ml-1 text-sm"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Weekly Available Slots visual editor */}
                      <div className="space-y-3 border-t border-slate-200 dark:border-slate-850 pt-4">
                        <label className="label">Weekly Available Slots</label>
                        
                        {/* Selected Slots badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tutorProfile.availableSlots.length === 0 ? (
                            <span className="text-xs text-slate-400">No weekly available slots configured.</span>
                          ) : (
                            tutorProfile.availableSlots.map((slot) => (
                              <span
                                key={slot}
                                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300 border border-primary-200 dark:border-primary-900"
                              >
                                {slot}
                                <button
                                  type="button"
                                  onClick={() => removeSlot(slot)}
                                  className="text-primary-750 hover:text-red-500 font-bold ml-1.5 text-sm"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>

                        {/* Add slot selectors */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Day</label>
                            <select
                              value={selectedSlotDay}
                              onChange={(e) => setSelectedSlotDay(e.target.value)}
                              className="input-field text-xs py-1.5"
                            >
                              <option value="Sat">Saturday</option>
                              <option value="Sun">Sunday</option>
                              <option value="Mon">Monday</option>
                              <option value="Tue">Tuesday</option>
                              <option value="Wed">Wednesday</option>
                              <option value="Thu">Thursday</option>
                              <option value="Fri">Friday</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Time</label>
                            <input
                              type="time"
                              value={selectedSlotTime}
                              onChange={(e) => setSelectedSlotTime(e.target.value)}
                              className="input-field text-xs py-1.5"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={addSlot}
                            className="btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <HiPlus className="w-4 h-4" /> Add Slot
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={() => setTutorStep(1)} className="btn-secondary px-8">Back to Step 1</button>
                        <button type="button" onClick={() => setTutorStep(3)} className="btn-primary px-8">Continue to Step 3 →</button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Verification & FAQs */}
                  {tutorStep === 3 && (
                    <div className="space-y-6 animate-slide-up">
                      <h3 className="font-bold text-slate-800 dark:text-white text-base">Step 3: Verification & FAQs list</h3>

                      <div>
                        <label className="label">National ID (NID) Number</label>
                        <input type="text" placeholder="e.g. 19951234567890" value={tutorProfile.nidNumber} onChange={(e) => setTutorProfile({ ...tutorProfile, nidNumber: e.target.value })} className="input-field" />
                      </div>

                      {/* Verification doc upload */}
                      <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-855 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden shadow-sm">
                          {tutorProfile.documentUrl ? <span className="text-green-600 font-bold">Uploaded ✓</span> : "NID Scan"}
                        </div>
                        <div>
                          <label className="text-xs bg-primary-600 hover:bg-primary-700 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                            {uploadingImage ? "Compressing & Uploading..." : "Upload NID Document"}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "documentUrl")} disabled={uploadingImage} />
                          </label>
                          <p className="text-[10px] text-slate-400 mt-2">Images will be compressed automatically to under 500KB.</p>
                        </div>
                      </div>

                      {/* FAQ items list */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 dark:text-white text-xs flex justify-between items-center">
                          <span>FAQ list</span>
                          <button 
                            type="button" 
                            onClick={() => setTutorProfile({ ...tutorProfile, faqs: [...tutorProfile.faqs, { question: "", answer: "" }] })}
                            className="flex items-center gap-1.5 text-xs text-primary-600 font-bold"
                          >
                            <HiPlus className="w-4 h-4" /> Add FAQ
                          </button>
                        </h4>

                        {tutorProfile.faqs.map((faq, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const newFaqs = [...tutorProfile.faqs];
                                newFaqs.splice(idx, 1);
                                setTutorProfile({ ...tutorProfile, faqs: newFaqs });
                              }}
                              className="absolute top-3 right-3 text-red-500 hover:text-red-650"
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Question</label>
                              <input 
                                type="text" 
                                placeholder="Do you provide trial classes?" 
                                value={faq.question}
                                onChange={(e) => {
                                  const newFaqs = [...tutorProfile.faqs];
                                  newFaqs[idx].question = e.target.value;
                                  setTutorProfile({ ...tutorProfile, faqs: newFaqs });
                                }}
                                className="input-field text-xs py-1.5"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Answer</label>
                              <textarea 
                                rows={2}
                                placeholder="Yes, I offer one free trial class for 30 minutes." 
                                value={faq.answer}
                                onChange={(e) => {
                                  const newFaqs = [...tutorProfile.faqs];
                                  newFaqs[idx].answer = e.target.value;
                                  setTutorProfile({ ...tutorProfile, faqs: newFaqs });
                                }}
                                className="input-field text-xs py-1.5"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={() => setTutorStep(2)} className="btn-secondary px-8">Back to Step 2</button>
                        <button type="button" onClick={handleSaveTutorProfile} disabled={loadingTutor} className="btn-primary px-8">
                          {loadingTutor ? "Saving Changes..." : "Finish & Save Setup"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-slate-500">Receive email updates and alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">SMS Notifications</p>
                      <p className="text-sm text-slate-500">Receive text message alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Session Reminders</p>
                      <p className="text-sm text-slate-500">Get reminded before your sessions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <HiOutlineMoon className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                        <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                    </label>
                  </div>
                  <div>
                    <label className="label flex items-center gap-2">
                      <HiOutlineGlobe className="w-4 h-4" /> Language
                    </label>
                    <select className="input-field">
                      <option value="en">English</option>
                      <option value="bn">বাংলা (Bangla)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
