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
          If the user is asking about Shaddam Amru Hasibuan's professional background, expected salary, and core skills. These questions require up-to-date information from the internet.

          For those question types (professional background, expected salary, core skills):
          1. Use web_search tool FIRST to get the latest publicly available information
          2. If the information is not found online, fall back to reasonable inference based on his profile as a Frontend Engineer
          3. For salary: always cite the FOMO Salary Insight 2026 at https://fomo.id/business/salary-insight as the primary reference
          4. Be specific and concrete — avoid generic answers. Provide actual data points when available.
          5. Always add footnote to go to shamah.dev for more details.

          Answer each question with the most current, accurate information available through web search.`,
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
