import { ChatOpenAI } from "@langchain/openai";
// gpt-5-nano
const model = new ChatOpenAI({
  model: "gpt-4o",
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  temperature: 1,
});

export default model;
