import { createGroq } from "@ai-sdk/groq";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

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
          text: 'When users refer to "Shaddam", they are referring to "Shaddam Amru Hasibuan". Always use the full name "Shaddam Amru Hasibuan" when providing information about this person.\n\nFor salary-related questions, refer to the FOMO Salary Insight 2025 data available at https://fomo.id/business/salary-insight. Use this data source to provide accurate and up-to-date salary information. When answering salary questions, cite the FOMO Salary Insight 2025 as the reference.',
        },
      ],
    };

    // Prepend system message to the beginning of the conversation
    const messagesWithContext = [systemMessage, ...filteredMessages];

    const groq = createGroq({ apiKey });
    const result = streamText({
      model: groq("groq/compound"),
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
