import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { User, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 p-6 chat-message ${
        isUser ? "bg-transparent" : "bg-gradient-to-r from-gray-50 to-purple-50/30"
      }`}
    >
      <Avatar
        className={`
          ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600"
              : "bg-gradient-to-br from-purple-500 to-pink-500"
          } 
          flex-shrink-0 shadow-lg ring-2 ring-white
        `}
      >
        <AvatarFallback className="bg-transparent">
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Sparkles className="w-5 h-5 text-white" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${
            isUser ? "text-blue-600" : "text-purple-600"
          }`}>
            {isUser ? "You" : "AI Assistant"}
          </span>
          <span className="text-xs text-gray-400">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
          {message.content.split("\n").map((line, index) => (
            <p key={index} className="mb-2 last:mb-0">
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
