import React, { useState, KeyboardEvent } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Ask me anything...",
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white p-4 shadow-lg chat-input-container">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex gap-3 items-end bg-gradient-to-r from-gray-50 to-purple-50/30 p-3 rounded-2xl border border-gray-200 shadow-sm chat-input-wrapper">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[56px] max-h-[200px] resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 placeholder:text-gray-400 chat-input-textarea"
            rows={1}
          />

          <Button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            size="icon"
            className="h-[56px] w-[56px] flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 rounded-xl chat-input-button"
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center">
          <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-200 rounded">
            Enter
          </kbd>{" "}
          to send •{" "}
          <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-200 rounded">
            Shift + Enter
          </kbd>{" "}
          for new line
        </p>
      </div>
    </div>
  );
}
