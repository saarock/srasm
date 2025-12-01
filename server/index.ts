import OpenAI from "openai";
import { serve } from "bun";
import "dotenv/config";

// Initialize OpenAI client with your API key
const client = new OpenAI({
  
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to explain errors
async function explainError(errorMessage: string, stateSnapshot: any) {
  try {
    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: `
        You are an expert React developer.
        Explain this error in simple terms and suggest a fix.
        Error: ${errorMessage}
        State snapshot: ${JSON.stringify(stateSnapshot)}
      `,
    });
  console.log("Response start");
  
  console.log(response.output_text);

    return response.output_text;
  } catch (err: any) {
    console.error("OpenAI explainError failed:", err);
    return "Failed to get AI explanation.";
  }
}

// Helper to add CORS headers
function withCORS(response: Response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  
  return response;
}

// Start Bun server
serve({
  fetch: async (req) => {
    const url = new URL(req.url);

    // Handle preflight request
    if (req.method === "OPTIONS") {
      return withCORS(new Response(null, { status: 204 }));
    }

    if (req.method === "POST" && url.pathname === "/explain-error") {
      console.log("POST /explain-error hit");
      try {
        const body = await req.json();
        const { errorMessage, stateSnapshot } = body;

        const explanation = await explainError(errorMessage, stateSnapshot);
        // console.log(explanation);

        return withCORS(
          new Response(JSON.stringify({ explanation: explanation }), {
            headers: { "Content-Type": "application/json" },
          })
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err);
        return withCORS(
          new Response(JSON.stringify({ error: message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
          })
        );
      }
    }

    return withCORS(
      new Response(JSON.stringify({ error: "Not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      })
    );
  },
  port: 3000,
});

console.log("Bun server running on http://localhost:3000");
