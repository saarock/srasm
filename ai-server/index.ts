import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());


const PORT = process.env.PORT || 7000;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

function cleanError(err:any) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Unknown error";
}

async function fetchWithTimeout(url: string, options = {}, ms = 60_000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function askOpenAI(input: string, model = OPENAI_MODEL) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY in environment");
  }

  const res = await fetchWithTimeout(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input,                 // simple text input is fine

        temperature: 0.2,
      }),
    },
    60_000
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message || JSON.stringify(data);
    throw new Error(`OpenAI HTTP ${res.status} ${msg}`);
  }

  // ✅ 1) preferred if present
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }

  // ✅ 2) fallback: extract from output[] content blocks
  const text =
    data?.output
      ?.flatMap((item: any) => item?.content ?? [])
      ?.filter((c: any) => c?.type === "output_text")
      ?.map((c: any) => c?.text ?? "")
      ?.join("") ?? "";

  return text;
}


// ---------------- Routes ----------------
app.get("/", (req, res) => {
  res.status(200).send("<h1>AI Server</h1><p>Use POST /ask</p>");
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "ai-server",
    model_default: OPENAI_MODEL,
    has_openai_key: Boolean(process.env.OPENAI_API_KEY),
  });
});

app.get("/models", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ ok: false, error: "Missing OPENAI_API_KEY" });
    }

    const response = await fetchWithTimeout("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg = data?.error?.message || JSON.stringify(data);
      return res.status(response.status).json({ ok: false, error: msg });
    }

    return res.json({
      ok: true,
      models: data.data?.slice(0, 20) ?? [],
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: cleanError(err) });
  }
});

app.post("/ask", async (req, res) => {
  try {

    const { question, model } = req.body || {};

    
    if (!question || typeof question !== "string") {
        console.log("hahaerror");
        
      return res
        .status(400)
        .json({ ok: false, error: "question (string) is required" });
    }


    
    const answer = await askOpenAI(question, model || OPENAI_MODEL);
    console.log(answer);
    

    return res.json({
      ok: true,
      model: model || OPENAI_MODEL,
      answer,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: cleanError(err) });
  }
});

// ---------------- Listen ----------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
