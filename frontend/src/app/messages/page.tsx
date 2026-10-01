"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  LuSend,
  LuPaperclip,
  LuPhone,
  LuSearch,
  LuArrowLeft,
  LuShieldAlert,
  LuCheckCheck,
  LuMessageSquare,
} from "react-icons/lu";
import { FiMoreVertical } from "react-icons/fi";

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  phone: string;
}

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "নাফিস ফুয়াদ (Nafis Fuad)",
    role: "BUET CSE • Verified Tutor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    lastMessage: "আগামীকাল বিকেল ৪টায় ডেমো ক্লাসের শিডিউল কনফার্ম করলাম।",
    time: "10:30 AM",
    unread: 2,
    online: true,
    phone: "01819283746",
  },
  {
    id: "2",
    name: "ডাঃ আয়েশা সিদ্দিকা (Dr. Ayesha)",
    role: "DMC • Medical Biology Specialist",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    lastMessage: "আমি বোটানির সাইটোলজি অধ্যায়ের হ্যান্ডনোট পাঠিয়ে দিচ্ছি।",
    time: "Yesterday",
    unread: 0,
    online: false,
    phone: "01733445566",
  },
  {
    id: "3",
    name: "তানভীর হাসান রিফাত (Tanvir Rifat)",
    role: "BUET EEE • Physics Mentor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    lastMessage: "গত টেস্ট পরীক্ষায় গণিতে আপনার অগ্রগতি চমৎকার ছিল!",
    time: "Sun",
    unread: 0,
    online: true,
    phone: "01744556677",
  },
];

const initialMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      sender: "them",
      text: "আসসালামু আলাইকুম! এইচএসসি উচ্চতর গণিতের ইন্টিগ্রেশন অংশে আপনার প্রস্তুতির কী অবস্থা?",
      time: "10:15 AM",
    },
    {
      id: "m2",
      sender: "me",
      text: "ওয়ালাইকুম আসসালাম ভাইয়া। নির্দিষ্ট যৌগজ ও ক্ষেত্রফল নির্ণয়ের কিছু জটিল সমস্যা বুঝতে পারছি না।",
      time: "10:18 AM",
    },
    {
      id: "m3",
      sender: "them",
      text: "কোনো সমস্যা নেই। আমি বিগত ৫ বছরের বোর্ড ও ইঞ্জিনিয়ারিং এডমিশন প্রশ্ন সহজ ট্রিকসে বুঝিয়ে দেব।",
      time: "10:22 AM",
    },
    {
      id: "m4",
      sender: "me",
      text: "তাহলে কি আগামীকাল একটি ট্রায়াল ক্লাস নিতে পারেন?",
      time: "10:26 AM",
    },
    {
      id: "m5",
      sender: "them",
      text: "আগামীকাল বিকেল ৪টায় ডেমো ক্লাসের শিডিউল কনফার্ম করলাম। দেখা হবে ইনশাআল্লাহ!",
      time: "10:30 AM",
    },
  ],
};

const quickChips = [
  "১ দিনের ফ্রি ডেমো ক্লাস নেওয়া সম্ভব কি?",
  "সপ্তাহে কোন কোন দিন পড়াতে পারবেন?",
  "আপনার পড়ানোর মাধ্যম (বাংলা/ইংরেজি ভার্সন)?",
  "মাসিক পারিশ্রমিক আলোচনা হতে পারে কি?",
];

export default function MessagesPage() {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [callAlert, setCallAlert] = useState<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeChatId);
  const currentMessages = messages[activeChatId] || [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChatId) return;

    const newMsgObj: Message = {
      id: `m_${Date.now()}`,
      sender: "me",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsgObj],
    }));

    setNewMessage("");
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-canvas overflow-hidden">
      <Navbar />

      {/* Main Chat App Area */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto sm:px-4 sm:py-3">
        <div className="flex-1 flex bg-white sm:rounded-2xl border border-stone/80 shadow-xs overflow-hidden">
          {/* Conversation Sidebar */}
          <aside
            className={`w-full sm:w-84 lg:w-96 border-r border-stone/70 flex flex-col bg-white/60 ${
              activeChatId ? "hidden sm:flex" : "flex"
            }`}
          >
            {/* Header & Search */}
            <div className="p-4 border-b border-stone/60">
              <div className="flex items-center justify-between mb-3">
                <h1 className="font-display text-xl font-bold text-ink">
                  ইনবক্স (Messages)
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary-50 text-primary-800">
                  {conversations.length} Contacts
                </span>
              </div>

              <div className="relative">
                <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted/70" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম বা বিষয় খুঁজুন..."
                  className="w-full bg-clay-light/60 border border-stone/70 rounded-xl pl-10 pr-4 py-2 text-xs text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 transition-all"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone/40">
              {filteredConversations.map((conv) => {
                const isActive = activeChatId === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveChatId(conv.id)}
                    className={`w-full p-4 flex items-start gap-3.5 transition-colors text-left focus:outline-none ${
                      isActive
                        ? "bg-primary-50/70 border-l-4 border-primary-800"
                        : "hover:bg-clay-light/50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone/60"
                      />
                      {conv.online ? (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                      ) : (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-stone-400 rounded-full ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className="font-semibold text-sm text-ink truncate">
                          {conv.name}
                        </p>
                        <span className="text-[11px] text-ink-muted flex-shrink-0">
                          {conv.time}
                        </span>
                      </div>

                      <p className="text-xs text-primary-700 font-medium truncate mb-1">
                        {conv.role}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-ink-muted truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <span className="w-4 h-4 rounded-full bg-primary-800 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Active Chat Conversation Area */}
          <main
            className={`flex-1 flex flex-col bg-canvas/30 ${
              activeChatId ? "flex" : "hidden sm:flex"
            }`}
          >
            {activeConversation ? (
              <>
                {/* Chat Top Header */}
                <div className="px-5 py-3.5 bg-white border-b border-stone/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveChatId("")}
                      className="sm:hidden p-2 -ml-2 rounded-lg text-ink-muted hover:text-ink hover:bg-clay-light transition-colors"
                      aria-label="Back to contacts"
                    >
                      <LuArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      <img
                        src={activeConversation.avatar}
                        alt={activeConversation.name}
                        className="w-10 h-10 rounded-xl object-cover border border-stone/60"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                          activeConversation.online ? "bg-emerald-500" : "bg-stone-400"
                        }`}
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-sm text-ink leading-tight">
                        {activeConversation.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-primary-700 font-medium">
                          {activeConversation.role}
                        </span>
                        <span className="text-stone/60">•</span>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          {activeConversation.online ? "অনলাইন (Active Now)" : "অফলাইন"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCallAlert(`সরাসরি কল নম্বর: ${activeConversation.phone}`)}
                      className="p-2.5 rounded-xl border border-stone/70 text-ink hover:text-primary-800 hover:bg-clay-light transition-colors"
                      title="কল করুন"
                    >
                      <LuPhone className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2.5 rounded-xl border border-stone/70 text-ink hover:text-primary-800 hover:bg-clay-light transition-colors"
                      title="More options"
                    >
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Call Alert Toast (if triggered) */}
                {callAlert && (
                  <div className="bg-primary-800 text-white text-xs py-2 px-4 flex items-center justify-between">
                    <span>{callAlert}</span>
                    <button onClick={() => setCallAlert(null)} className="font-bold text-sm">
                      ✕
                    </button>
                  </div>
                )}

                {/* Safety & Trust Escrow Banner */}
                <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-900">
                  <LuShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span className="leading-tight font-bangla">
                    <strong>নিরাপত্তা পরামর্শ:</strong> ডেমো ক্লাস নেওয়ার আগে কোনো অগ্রিম টাকা সরাসরি ব্যক্তিগত নাম্বারে লেনদেন করবেন না।
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {currentMessages.map((msg) => {
                    const isMe = msg.sender === "me";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                            isMe
                              ? "bg-primary-800 text-white rounded-br-none"
                              : "bg-white text-ink border border-stone/80 rounded-bl-none"
                          }`}
                        >
                          <p className="leading-relaxed font-bangla">{msg.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
                              isMe ? "text-cream/80" : "text-ink-muted/80"
                            }`}
                          >
                            <span>{msg.time}</span>
                            {isMe && <LuCheckCheck className="w-3.5 h-3.5 text-cream" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Inquiry Chips */}
                <div className="px-4 py-2.5 bg-white/70 border-t border-stone/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <span className="text-[11px] font-bold text-ink-muted flex-shrink-0 font-bangla">
                    দ্রুত প্রশ্ন:
                  </span>
                  {quickChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setNewMessage(chip)}
                      className="text-xs whitespace-nowrap px-3.5 py-1.5 rounded-full bg-clay-light/80 hover:bg-primary-50 hover:text-primary-800 text-ink border border-stone/70 transition-all font-bangla flex-shrink-0"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Message Input Box */}
                <div className="p-4 bg-white border-t border-stone/70">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="ফাইল যুক্ত করুন"
                      className="p-2.5 rounded-xl border border-stone/70 text-ink-muted hover:text-ink hover:bg-clay-light transition-colors"
                    >
                      <LuPaperclip className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="এখানে আপনার মেসেজ লিখুন... (Type a message)"
                      className="flex-1 bg-clay-light/40 border border-stone/80 rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 transition-all font-bangla"
                    />

                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2.5 px-4 rounded-xl bg-primary-800 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-primary-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                    >
                      <span>পাঠান</span>
                      <LuSend className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty selection state */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-800 flex items-center justify-center mb-4">
                  <LuMessageSquare className="w-8 h-8" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">
                  একটি চ্যাট নির্বাচন করুন
                </h3>
                <p className="text-sm text-ink-muted max-w-sm mt-1 leading-relaxed">
                  বাম পাশের তালিকা থেকে যেকোনো টিউটর বা শিক্ষার্থীর মেসেজে ক্লিক করে কথা বলা শুরু করুন।
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
