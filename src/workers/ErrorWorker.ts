import { HumanMessage } from "@langchain/core/messages";
import model from "../config/lanchain";

self.onmessage = async (event) => {
  const { errorMessage, slice } = event.data;

  try {
    const message =
      errorMessage instanceof Error
        ? errorMessage.message
        : typeof errorMessage === "object"
        ? JSON.stringify(errorMessage)
        : String(errorMessage ?? "Unknown error");

    const prompt = `Explain this error in the context of slice "${slice}": ${message}`;

    // Generate completion
    const response = await model.generate([[new HumanMessage(prompt)]]);

    // Extract text from first completion
    const explanation =
      response.generations[0][0]?.text || "AI could not generate explanation.";
      console.log(explanation);
      

    // Post explanation back
    self.postMessage({ explanation });
  } catch (err) {
    console.error("AI Worker error:", err);
    self.postMessage({
      explanation: "AI could not generate explanation for this error.",
    });
  } finally {
    self.close();
  }
};
