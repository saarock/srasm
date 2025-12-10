import { useEffect, useState } from "react";
import { model } from "../config";
import { HumanMessage } from "@langchain/core/messages";



// This hook is in the test for now
export function useAiGeneratedStateByText(messageForAi: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any | null>(null); // Store raw JSON response.
  const [error, setError] = useState<string | null>(null); // Store error messages.

  useEffect(() => {
    if (messageForAi) {
      setLoading(true);
      setError(null);

      model
        .generate([[
          new HumanMessage(`${messageForAi} Please provide only the necessary information, no extra text or anything else. I want a direct answer.`)
        ]])
        .then((res) => {
          setLoading(false);

          // Extract the response text from the model result
          const responseText = res.generations[0][0]?.text;
          console.log(responseText);

          if (responseText) {
            // Use regex to match JSON content wrapped in ```json...```
            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);

            if (jsonMatch && jsonMatch[1]) {
              try {
                // Parse the matched JSON string (jsonMatch[1] contains the actual JSON content)
                const parsedResponse = JSON.parse(jsonMatch[1]);
                setResponse(parsedResponse); // Store the parsed object
              } catch (err) {
                setError("Failed to parse the extracted JSON response.");
                console.error("Parsing error:", err);
              }
            } else {
              setError("No valid JSON block found in the response.");
            }
          } else {
            setError("No valid response text received.");
          }
        })
        .catch((err) => {
          setLoading(false);
          setError("Failed to generate response");
          console.error("Generation error:", err);
        });
    }
  }, [messageForAi]); // Trigger effect when messageForAi changes

  return { loading, response, error };
}
