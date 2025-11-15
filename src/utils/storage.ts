import { ChatSession } from "../components/ChatSidebar";
import { Message } from "../components/ChatMessage";

const SESSIONS_KEY = "chat_sessions";
const MESSAGES_PREFIX = "chat_messages_";

export function getSessions(): ChatSession[] {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    if (!data) return [];
    const sessions = JSON.parse(data);
    return sessions.map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp),
    }));
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getMessages(sessionId: string): Message[] {
  try {
    const data = localStorage.getItem(`${MESSAGES_PREFIX}${sessionId}`);
    if (!data) return [];
    const messages = JSON.parse(data);
    return messages.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return [];
  }
}

export function saveMessages(sessionId: string, messages: Message[]): void {
  localStorage.setItem(
    `${MESSAGES_PREFIX}${sessionId}`,
    JSON.stringify(messages)
  );
}

export function createSession(): ChatSession {
  return {
    id: `session_${Date.now()}`,
    title: "New Chat",
    timestamp: new Date(),
  };
}

export function updateSession(
  sessionId: string,
  updates: Partial<ChatSession>
): void {
  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
    saveSessions(sessions);
  }
}

export function deleteSession(sessionId: string): void {
  const sessions = getSessions().filter((s) => s.id !== sessionId);
  saveSessions(sessions);
  localStorage.removeItem(`${MESSAGES_PREFIX}${sessionId}`);
}
