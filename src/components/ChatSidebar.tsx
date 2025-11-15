import React, { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { PlusCircle, MessageSquare, Trash2, Menu } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  preview?: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="w-16 border-r border-gray-100 bg-gradient-to-b from-gray-50 to-white flex flex-col items-center py-4 gap-3">
        <Button
          onClick={() => setCollapsed(false)}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <Button
          onClick={onNewChat}
          size="icon"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-gray-100 bg-gradient-to-b from-gray-50 to-white flex flex-col h-full shadow-sm chat-sidebar">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Conversations</h2>
          <Button
            onClick={() => setCollapsed(true)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center text-gray-400 text-sm p-8">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            sessions.map((session) => (
              <ContextMenu key={session.id}>
                <ContextMenuTrigger asChild>
                  <div
                    className={`
                      group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer
                      transition-all duration-200
                      ${
                        activeSessionId === session.id
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 shadow-md border border-purple-100"
                          : "hover:bg-white hover:shadow-sm border border-transparent"
                      }
                    `}
                    onClick={() => onSelectSession(session.id)}
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        activeSessionId === session.id
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <MessageSquare
                        className={`w-4 h-4 ${
                          activeSessionId === session.id
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden pr-2">
                      <p className="text-sm font-medium truncate whitespace-nowrap">{session.title}</p>
                      {session.preview && (
                        <p className="text-xs text-gray-400 truncate mt-0.5 whitespace-nowrap">
                          {session.preview}
                        </p>
                      )}
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-2xl rounded-xl p-2 min-w-[16rem]">
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() => onDeleteSession(session.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 focus:bg-gradient-to-r focus:from-red-50 focus:to-pink-50 focus:text-red-700 group data-[variant=destructive]:text-red-600"
                  >
                    <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg group-hover:from-red-200 group-hover:to-pink-200 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-red-700">Delete</span>
                      <span className="text-xs text-gray-500 group-hover:text-red-600">Remove this conversation</span>
                    </div>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
