import { createGroq } from "@ai-sdk/groq";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const MODEL = "groq/compound-mini";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async (ctx) => {
        return await POST(ctx.request);
      },
    },
  },
});

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "GROQ_API_KEY not configured",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const { messages }: { messages: UIMessage[] } = await request.json();

    // Filter out reasoning parts from messages before conversion
    // Reasoning parts are internal and shouldn't be sent back to the model
    const filteredMessages = messages.map((message) => {
      if (message.role === "assistant" && message.parts) {
        return {
          ...message,
          parts: message.parts.filter((part) => part.type !== "reasoning"),
        };
      }
      return message;
    });

    // Add system instruction for context about Shaddam and salary data
    const systemMessage: UIMessage = {
      id: "system-context",
      role: "system",
      parts: [
        {
          type: "text",
          text: `When users refer to "Shaddam", they refer to "Shaddam Amru Hasibuan". Always use the full name when providing information.
      If The user is asking about Shaddam Amru Hasibuan, provide information based on the following:
      Priority order for information:
      1. Check https://shamah.dev/llm.txt for the latest publicly available information
      2. If llm.txt didn't provided needed information, use web_search tool to find current information
      For salary: use FOMO Salary Insight 2025 at https://fomo.id/business/salary-insight as the primary reference.
      Be specific and concrete — avoid generic answers. Provide actual data points when available. Use web search to get the most current information.`,
        },
      ],
    };

    // Prepend system message to the beginning of the conversation
    const messagesWithContext = [systemMessage, ...filteredMessages];

    const groq = createGroq({ apiKey });
    const result = streamText({
      model: groq(MODEL),
      providerOptions: {
        groq: {
          compound_custom: {
            tools: {
              enabled_tools: [
                "web_search",
                "code_interpreter",
                "visit_website",
              ],
            },
          },
        },
      },
      toolChoice: "auto",
      messages: await convertToModelMessages(messagesWithContext),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
