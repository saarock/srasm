import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-5-nano",
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  temperature: 1,
});

export default model;
