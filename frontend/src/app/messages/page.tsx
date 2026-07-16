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
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-2">
        <div className="max-w-6xl mx-auto px-0 sm:px-4 lg:px-6">
          <div className="bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800" style={{ height: "calc(100vh - 80px)" }}>
            <div className="flex h-full">
              {/* Chat List */}
              <div className={`w-full sm:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col ${activeChat ? "hidden sm:flex" : "flex"}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Messages</h2>
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
                      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group ${
                        activeChat === conv.id ? "bg-primary-50 dark:bg-primary-950" : ""
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow">
                          {conv.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{conv.name}</p>
                          <span className="text-xs text-slate-400">{conv.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
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
                    <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setActiveChat("")}
                          className="sm:hidden p-1 -ml-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          ←
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow">
                          {activeConversation.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-slate-900 dark:text-white">{activeConversation.name}</p>
                          <p className={`text-xs ${activeConversation.online ? "text-green-600" : "text-slate-400"}`}>
                            {activeConversation.online ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-primary-600 transition-colors">
                        <HiOutlinePhone className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {mockMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                              msg.sender === "me"
                                ? "bg-primary-600 text-white rounded-br-md"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-md"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-primary-200" : "text-slate-400"}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                          <HiOutlinePaperClip className="w-5 h-5" />
                        </button>
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 input-field text-sm py-2.5"
                          onKeyDown={(e) => e.key === "Enter" && setNewMessage("")}
                        />
                        <button
                          onClick={() => setNewMessage("")}
                          disabled={!newMessage}
                          className="btn-primary text-sm py-2.5 px-5"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <HiOutlineUser className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                      <p className="text-lg font-medium">Select a conversation</p>
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
