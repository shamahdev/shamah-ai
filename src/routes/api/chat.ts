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
    const groq = createGroq({ apiKey });
    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      providerOptions: {
        groq: {
          reasoningFormat: "parsed",
          reasoningEffort: "low",
        },
      },
      tools: {
        browser_search: groq.tools.browserSearch({}),
      },
      toolChoice: "auto",
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
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
