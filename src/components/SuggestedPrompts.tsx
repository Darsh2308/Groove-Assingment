import React from "react";
import { Card } from "./ui/card";
import { Lightbulb, Sparkles, Code, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface SuggestedPromptsProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
}

const icons = [Sparkles, Code, BookOpen, Lightbulb];

export function SuggestedPrompts({
  prompts,
  onSelectPrompt,
}: SuggestedPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 suggested-prompts">
      <div className="flex items-center gap-2 mb-4 text-gray-600">
        <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
          <Lightbulb className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="text-sm font-medium">Try asking about</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-4 cursor-pointer border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50 group suggested-prompt-card"
                onClick={() => onSelectPrompt(prompt)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                    <Icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                    {prompt}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
