import axios from "axios";

export class SRASMAi {
  /**
   * Explain a state-related error using OpenAI backend
   */
  static async explainError(
    errorMessage: string,
    stateSnapshot: any
  ): Promise<string> {
    try {
      const response = await axios.post(
        "http://localhost:3000/explain-error",
        {
          errorMessage,
          stateSnapshot,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // The AI explanation from backend
      return response.data.explanation || "Could not generate explanation.";
    } catch (err: any) {
      console.error("AI explainError failed:", err);
      return "Failed to get AI explanation.";
    }
  }

  /**
   * Predict if the slice update is heavy (needs worker)
   */
  static async predictHeavySlice(slice: any, payload: any): Promise<boolean> {
    try {
      const size = JSON.stringify(payload).length;
      return size > 5000;
    } catch (err) {
      console.warn("predictHeavySlice fallback to true", err);
      return true;
    }
  }
}
