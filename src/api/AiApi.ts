import axios from "axios";
import model from "../config/lanchain";

export class SRASMAi {
  /**
   * Explain a state-related error using OpenAI backend
   */
  static async explainError(
    errorMessage: string,
    stateSnapshot: any
  ): Promise<void> {
    try {
      // // alert()
      // const response: any = await model.invoke("Why do parrots talk?");
      // console.log(response);

      // console.log(response?.content);
      // const aiMsg = await model.invoke([
      //   {
      //     role: "system",
      //     content:
      //       "You are a helpful assistant that translates English to French. Translate the user sentence.",
      //   },
      //   {
      //     role: "user",
      //     content: "I love programming.",
      //   },
      // ]);

      // console.log(aiMsg);
      
    } catch (err: any) {
      console.error("AI explainError failed:", err);
      // return "Failed to get AI explanation.";
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
