import React, { useState, useEffect, useRef } from "react";
import { ChatSidebar, ChatSession } from "./components/ChatSidebar";
import { ChatMessage, Message } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { SuggestedPrompts } from "./components/SuggestedPrompts";
import { ScrollArea } from "./components/ui/scroll-area";
import { Skeleton } from "./components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { sendToGemini, generateSuggestedQuestions } from "./utils/geminiApi";
import "./styles/mobile.css";
import {
  getSessions,
  saveSessions,
  getMessages,
  saveMessages,
  createSession,
  updateSession,
  deleteSession,
} from "./utils/storage";

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "Explain quantum computing in simple terms",
    "Write a poem about the ocean",
    "What are the benefits of meditation?",
    "Give me More info on this...",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);

    if (loadedSessions.length > 0) {
      const mostRecent = loadedSessions[0];
      setActiveSessionId(mostRecent.id);
      setMessages(getMessages(mostRecent.id));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => {
    const newSession = createSession();
    const updatedSessions = [newSession, ...sessions];

    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    setActiveSessionId(newSession.id);
    setMessages([]);

    setSuggestedPrompts([
      "Explain quantum computing in simple terms",
      "Write a poem about the ocean",
      "What are the benefits of meditation?",
      "Help me plan a trip to Japan",
    ]);
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    const sessionMessages = getMessages(sessionId);
    setMessages(sessionMessages);

    if (sessionMessages.length > 0) {
      const lastAssistantMessage = sessionMessages
        .filter((m) => m.role === "assistant")
        .pop();
      setSuggestedPrompts(
        generateSuggestedQuestions(lastAssistantMessage?.content)
      );
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);

    if (activeSessionId === sessionId) {
      if (updatedSessions.length > 0) {
        handleSelectSession(updatedSessions[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    let currentSessionId = activeSessionId;
    let updatedSessionsList = sessions;
    if (!currentSessionId) {
      const newSession = createSession();
      updatedSessionsList = [newSession, ...sessions];
      setSessions(updatedSessionsList);
      saveSessions(updatedSessionsList);
      setActiveSessionId(newSession.id);
      currentSessionId = newSession.id;
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(currentSessionId, updatedMessages);

    if (messages.length === 0) {
      const title = content.substring(0, 50) + (content.length > 50 ? "..." : "");
      updateSession(currentSessionId, { title, preview: content });

      const updatedSessions = updatedSessionsList.map((s) =>
        s.id === currentSessionId ? { ...s, title, preview: content } : s
      );
      setSessions(updatedSessions);
      saveSessions(updatedSessions);
    }

    setIsLoading(true);

    try {
      const response = await sendToGemini(updatedMessages);

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(currentSessionId, finalMessages);

      setSuggestedPrompts(generateSuggestedQuestions(response));
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please check your API configuration and try again.",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessages(currentSessionId, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 overflow-hidden">
      <div className="hidden md:block">
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm p-4 shadow-sm chat-header">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg chat-header-icon">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-800 text-sm md:text-base">AI Assistant</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Powered by Groq</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 text-xs font-medium">Online</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-full p-6 empty-state">
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-2xl mb-6 animate-pulse empty-state-icon">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-gray-900 mb-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent empty-state-title">
                    Hello! I'm your AI Assistant
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base px-2">
                    Ask me anything - I maintain full conversation context!
                  </p>
                </div>

                <SuggestedPrompts
                  prompts={suggestedPrompts}
                  onSelectPrompt={handleSelectPrompt}
                />
              </div>
            ) : (
              <div className="pb-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isLoading && (
                  <div className="flex gap-4 p-6 bg-gradient-to-r from-gray-50 to-purple-50/30">
                    <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-200 to-pink-200" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20 bg-purple-100" />
                      <Skeleton className="h-4 w-full bg-purple-50" />
                      <Skeleton className="h-4 w-3/4 bg-purple-50" />
                    </div>
                  </div>
                )}

                {!isLoading && messages.length > 0 && (
                  <div className="py-6">
                    <SuggestedPrompts
                      prompts={suggestedPrompts}
                      onSelectPrompt={handleSelectPrompt}
                    />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="Ask me anything..."
        />
      </div>
    </div>
  );
}
