import { Message } from "../components/ChatMessage";

const GROQ_API_KEY: string = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

interface GroqRequest {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
}

interface GroqResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

function isApiKeyConfigured(): boolean {
  return GROQ_API_KEY !== "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" && GROQ_API_KEY.length > 0;
}

export async function sendToGemini(messages: Message[]): Promise<string> {
  if (!isApiKeyConfigured()) {
    throw new Error(
      "⚠️ Groq API key not configured!\n\n" +
      "Visit https://console.groq.com to get a free API key"
    );
  }

  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const requestBody: GroqRequest = {
      model: GROQ_MODEL,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 2048,
    };

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error:", errorData);

      if (response.status === 429) {
        throw new Error(
          "Rate limit reached. Please wait a moment and try again."
        );
      }

      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your configuration."
        );
      }

      throw new Error(
        `API error: ${response.status}\n${JSON.stringify(errorData)}`
      );
    }

    const data: GroqResponse = await response.json();
    const responseText =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return responseText;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
}

export function generateSuggestedQuestions(lastMessage?: string): string[] {
  const defaultQuestions = [
    "Can you explain that in simpler terms?",
    "What are some examples?",
    "Tell me more about this topic",
    "How does this work in practice?",
  ];

  return defaultQuestions;
}
