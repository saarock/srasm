import React, { useEffect, useState } from "react";
import { model } from "../config";
import { HumanMessage } from "@langchain/core/messages";
import {
  AlertTriangle,
  Bot,
  Loader2,
  RefreshCcw,
  Terminal,
} from "lucide-react";
import type { ErrorHandlerProps } from "../types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  error,
  relevantCode,
  sliceName,
  additionalSlices,
}) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  

  useEffect(() => {
    const fetchExplanation = async () => {
      setLoading(true);
      try {
        const errObj = error as any;
        const message = errObj?.message || String(error);
        const slice = sliceName || errObj?.slice || "global";
        const slices = additionalSlices || errObj?.slices || [];

        // AI prompt with slice info and additional slices
        const prompt = `
You are an expert debugger. Explain this error in the context of slice "${slice}".
Error message: ${message}
Slice Name: ${slice}
Additional Slices: ${JSON.stringify(slices)}
${
  relevantCode && relevantCode.length > 0
    ? `Relevant code:\n${relevantCode
        .map((c) => `File: ${c.fileName}\n${c.code}`)
        .join("\n\n")}`
    : ""
}

Provide a concise, developer-friendly explanation and a potential fix and @note pleased provide the result in Markdown with headings (#) or code blocks.
`;

        const response = await model.generate([[new HumanMessage(prompt)]]);
        const text =
          response.generations[0][0]?.text ||
          "AI could not generate explanation.";  
          console.log(text);
                  
        setExplanation(text);
      } catch (err) {
        console.error("AI explanation failed:", err);
        setExplanation(
          "Failed to get AI explanation. Please check your network or API key."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [error]);

  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] p-6 text-[#E0E0E0]">
      <div className="max-w-3xl w-full bg-[#1E1E1E] rounded-2xl shadow-2xl border border-[#333] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-red-500/10 border-b border-red-500/20 p-6 flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-full text-red-500">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-red-400">
              Application Error
            </h1>
            <p className="text-red-300/80 text-sm">
              Something went wrong in the application.
            </p>
          </div>
        </div>

        {/* Error Details */}
        <div className="p-6 space-y-6">
          <div className="bg-[#181818] rounded-xl p-4 border border-[#2A2A2A] font-mono text-sm overflow-x-auto">
            <div className="flex items-center gap-2 text-[#888] mb-2 border-b border-[#333] pb-2">
              <Terminal size={14} />
              <span>Error Log</span>
            </div>
            <p className="text-red-300 whitespace-pre-wrap break-words">
              {errorMessage}
            </p>
          </div>

          {/* AI Section */}
          <div className="bg-[#252525] rounded-xl p-5 border border-[#333] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00E6E6] to-blue-600" />

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  loading
                    ? "bg-blue-500/20 text-blue-400 animate-pulse"
                    : "bg-[#00E6E6]/20 text-[#00E6E6]"
                }`}
              >
                <Bot size={24} />
              </div>
              <h2 className="text-lg font-semibold text-[#E0E0E0]">
                {loading ? "AI is analyzing..." : "AI Diagnosis"}
              </h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-[#888] space-y-3">
                <Loader2 size={32} className="animate-spin text-[#00E6E6]" />
                <p className="text-sm animate-pulse">
                  Consulting the neural network...
                </p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-[#CCC] text-sm leading-relaxed" >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {explanation!.replace(/\\n/g, "\n")}
                </Markdown>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#181818] p-4 border-t border-[#2A2A2A] flex justify-end">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-white rounded-lg transition-all border border-[#444] hover:border-[#666]"
          >
            <RefreshCcw size={16} />
            Reload Application
          </button>
        </div>
      </div>
    </div>
  );
};
