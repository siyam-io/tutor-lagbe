"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiOutlinePaperClip, HiOutlinePhone, HiOutlineUser } from "react-icons/hi";

// Mock conversations
const conversations = [
  { id: "1", name: "Md. Rahman", lastMessage: "See you tomorrow at 10 AM!", time: "10:30 AM", unread: 2, online: true },
  { id: "2", name: "Fatema Akter", lastMessage: "I'll send the notes today.", time: "Yesterday", unread: 0, online: false },
  { id: "3", name: "Tanvir Hasan", lastMessage: "Thank you for the session!", time: "Mon", unread: 1, online: true },
];

// Mock messages for active conversation
const mockMessages = [
  { id: "1", sender: "them", text: "Hello! How is your study going?", time: "10:15 AM" },
  { id: "2", sender: "me", text: "It's going well! I have some questions about the math homework.", time: "10:18 AM" },
  { id: "3", sender: "them", text: "Sure, let me know what you need help with.", time: "10:20 AM" },
  { id: "4", sender: "me", text: "The integration problems from chapter 7. Can you explain them?", time: "10:25 AM" },
  { id: "5", sender: "them", text: "Of course! We can cover them in our next session. See you tomorrow at 10 AM!", time: "10:30 AM" },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState("1");
  const [newMessage, setNewMessage] = useState("");

  const activeConversation = conversations.find((c) => c.id === activeChat);

  return (
    <>
      <Navbar />
      <main className="py-2">
        <div className="max-w-6xl mx-auto px-0 sm:px-4 lg:px-6">
          <div className="bg-white rounded-none sm:rounded-card shadow-soft overflow-hidden border border-stone" style={{ height: "calc(100vh - 80px)" }}>
            <div className="flex h-full">
              {/* Chat List */}
              <div className={`w-full sm:w-80 border-r border-stone flex flex-col ${activeChat ? "hidden sm:flex" : "flex"}`}>
                <div className="p-5 border-b border-stone">
                  <h2 className="font-display text-xl font-semibold text-ink">Messages</h2>
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="input-field mt-3 text-sm py-2.5"
                  />
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveChat(conv.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors duration-300 text-left group border-l-2 ${
                        activeChat === conv.id
                          ? "bg-sage/10 border-primary-800"
                          : "border-transparent hover:bg-clay-light"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-image bg-clay/40 border border-stone flex items-center justify-center font-display font-semibold text-primary-800 text-sm">
                          {conv.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-bangla-green rounded-full ring-2 ring-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-ink truncate">{conv.name}</p>
                          <span className="text-xs text-ink-muted">{conv.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-ink-muted truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="w-5 h-5 bg-primary-800 text-white text-xs rounded-full flex items-center justify-center font-medium">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className={`flex-1 flex flex-col ${activeChat ? "flex" : "hidden sm:flex"}`}>
                {activeConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="px-5 py-4 border-b border-stone flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setActiveChat("")}
                          className="sm:hidden p-1 -ml-1 text-ink-muted hover:text-ink transition-colors duration-300"
                        >
                          ←
                        </button>
                        <div className="w-9 h-9 rounded-image bg-clay/40 border border-stone flex items-center justify-center font-display font-semibold text-primary-800 text-sm">
                          {activeConversation.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-ink">{activeConversation.name}</p>
                          <p className={`text-xs ${activeConversation.online ? "text-sage-700" : "text-ink-muted"}`}>
                            {activeConversation.online ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <button className="p-2.5 rounded-full hover:bg-clay-light text-sage-700 transition-colors duration-300">
                        <HiOutlinePhone className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Safety Escrow Notice */}
                    <div className="bg-ochre/10 px-5 py-3 border-b border-ochre/30 flex items-center justify-between text-xs text-ochre-800">
                      <span className="flex items-center gap-1.5">
                        <span>🛡️</span>
                        <span>নিরাপত্তা পরামর্শ: কোনো অগ্রিম টাকা সরাসরি লেনদেন করবেন না। ডেমো ক্লাসের পর প্ল্যাটফর্মের মাধ্যমে কনফার্ম করুন।</span>
                      </span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {mockMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-3 rounded-card text-sm ${
                              msg.sender === "me"
                                ? "bg-primary-800 text-white"
                                : "bg-clay-light text-ink border border-stone"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p className={`text-[10px] mt-1.5 text-right ${msg.sender === "me" ? "text-white/60" : "text-ink-muted"}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Inquiry Chips (Increases conversion & speeds up responses) */}
                    <div className="px-5 py-3 bg-clay-light/60 border-t border-stone flex items-center gap-2 overflow-x-auto scrollbar-thin">
                      <span className="text-[11px] text-ink-muted font-medium flex-shrink-0">দ্রুত মেসেজ:</span>
                      {[
                        "১ দিনের ফ্রি ডেমো ক্লাস নেওয়া সম্ভব কি?",
                        "সপ্তাহে কোন কোন দিন পড়াতে পারবেন?",
                        "আপনার পড়ানোর মাধ্যম (বাংলা/ইংরেজি)?",
                        "মাসিক পারিশ্রমিক কত আলোচনা হতে পারে?",
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => setNewMessage(chip)}
                          className="text-xs whitespace-nowrap px-3.5 py-1.5 bg-white hover:bg-sage/10 text-ink-muted hover:text-primary-800 rounded-full border border-stone transition-colors duration-300 flex-shrink-0"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-5 border-t border-stone">
                      <div className="flex items-center gap-2">
                        <button 
                          aria-label="Attach file"
                          className="p-2.5 rounded-full hover:bg-clay-light text-ink-muted transition-colors duration-300"
                        >
                          <HiOutlinePaperClip className="w-5 h-5" />
                        </button>
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="মেসেজ লিখুন... (Type your message)"
                          className="flex-1 input-field text-sm py-2.5"
                          onKeyDown={(e) => e.key === "Enter" && setNewMessage("")}
                        />
                        <button
                          onClick={() => setNewMessage("")}
                          disabled={!newMessage}
                          className="btn-primary text-xs"
                        >
                          পাঠান
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-ink-muted">
                    <div className="text-center">
                      <HiOutlineUser className="w-16 h-16 mx-auto mb-4 text-stone" />
                      <p className="font-display text-lg font-medium">Select a conversation</p>
                      <p className="text-sm mt-1">Choose from your existing messages to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
