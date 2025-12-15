"use client";

import type React from "react";
import { useCallback, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HumanMessage } from "@langchain/core/messages";
import { model } from "../../config";
import { Button } from "../Button/Button";

type SRASMFileInput = {
    filePath: string;
    codes: string;
};

interface SRASMRealTimeSliceSplitDebuggerProps {
    files: SRASMFileInput[];
}
import { CheckCircle, Layers, AlertTriangle } from "lucide-react";

function SRASMResultToast({ parsed }: { parsed: any }) {
    return (
        <div className="max-w-md w-full bg-white border border-[#00E6E6] rounded-xl shadow-xl p-4">
            <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-[#00E6E6]" size={20} />
                <h4 className="font-semibold text-gray-900">SRASM Analysis Complete</h4>
            </div>

            {/* Issues */}
            <div className="mb-2 flex items-start gap-2">
                <AlertTriangle className="text-orange-500 mt-1" size={16} />
                <p className="text-sm text-gray-700">
                    <strong>{parsed.issues?.length ?? 0}</strong> potential issues
                    detected
                </p>
            </div>

            {/* Recommended slices */}
            <div className="mb-3 flex items-start gap-2">
                <Layers className="text-blue-500 mt-1" size={16} />
                <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">Recommended slices:</p>
                    <div className="flex flex-wrap gap-1">
                        {(parsed.recommendedSlices ?? []).slice(0, 5).map((s: any) => (
                            <span
                                key={s.sliceName}
                                className="px-2 py-0.5 rounded-md bg-gray-100 text-xs font-mono"
                            >
                                {s.sliceName}
                            </span>
                        ))}
                        {(parsed.recommendedSlices?.length ?? 0) > 5 && (
                            <span className="text-xs text-gray-500">+ more</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-500 border-t pt-2">
                Full JSON available in browser console
            </div>
        </div>
    );
}

function extractJson(text: string): any | null {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end < 0 || end <= start) return null;

    const jsonStr = text.slice(start, end + 1);
    try {
        return JSON.parse(jsonStr);
    } catch {
        return null;
    }
}

const SRASMRealTimeSliceSplitDebugger: React.FC<
    SRASMRealTimeSliceSplitDebuggerProps
> = ({ files }) => {
    const [showPrompt, setShowPrompt] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const combinedPreviewName = useMemo(() => {
        if (!files?.length) return "No files provided";
        if (files.length === 1) return files[0].filePath;
        return `${files[0].filePath} + ${files.length - 1} more`;
    }, [files]);

    const prompt = useMemo(() => {
        const joined = (files ?? [])
            .map((f) => `--- FILE: ${f.filePath} ---\n${f.codes}\n`)
            .join("\n");

        return `
You are SRASM (Saarock React AI State Management) Real-Time Slice Split Debugger.

Goal:
Given React/TS files, recommend how to split state into SRASM "slices" to reduce unnecessary re-renders.

SRASM design rules:
- Each slice has its own: Context + Provider + Reducer.
- Components must subscribe ONLY to the slice they need.
- No slice stores unrelated concerns.
- Avoid storing derived state if selectors can compute it.
- Prefer domain-based grouping (Auth, UI, Network, Forms, Cache, Cart, Product, etc).
- Recommend provider layout to avoid broad re-renders.
- If shared state is needed, propose:
  (a) shared slice, or
  (b) selectors, or
  (c) event-based communication.

Input files:
${(files ?? []).map((f) => `- ${f.filePath}`).join("\n")}

Code:
${joined}

Output format (STRICT JSON ONLY, no extra text):
{
  "files": ["string"],
  "issues": [
    {
      "type": "RERENDER_RISK | SLICE_MIXING | OVERGLOBAL_STATE | DERIVED_STATE_STORED | DEEP_OBJECT_MUTATION | CONTEXT_VALUE_IDENTITY | EFFECT_DEPENDENCY",
      "severity": 1-5,
      "message": "string",
      "evidence": ["short snippets or line descriptions"]
    }
  ],
  "recommendedSlices": [
    {
      "sliceName": "string",
      "responsibility": "string",
      "stateKeys": ["k1","k2"],
      "actions": ["ACTION_1","ACTION_2"],
      "initialStateShape": { "exampleKey": "exampleTypeOrValue" },
      "notes": ["why this split helps", "subscription benefit"]
    }
  ],
  "providerLayout": {
    "recommendedTree": ["SRASMRoot","SliceAProvider","SliceBProvider"],
    "reason": "string"
  },
  "migrationSteps": ["step 1","step 2","step 3"]
}
`;
    }, [files]);

    const checkTheSlices = useCallback(async () => {
        if (!files?.length) {
            toast.error("SRASM: No files provided for analysis.");
            return;
        }

        setIsAnalyzing(true);

        // ✅ react-hot-toast loading (returns id)
        const loadingId = toast.loading("SRASM: Analyzing slices...");

        try {
            const response = await model.generate([[new HumanMessage(prompt)]]);

            const text: string =
                (response as any)?.generations?.[0]?.[0]?.text ??
                (response as any)?.content ??
                String(response);

            const parsed = extractJson(text);

            const issuesCount = parsed?.issues?.length ?? 0;
            const slicesCount = parsed?.recommendedSlices?.length ?? 0;

            // ✅ update same toast by id
            toast.success(
                `SRASM: Done ✅ Issues: ${issuesCount} | Suggested slices: ${slicesCount}`,
                { id: loadingId, duration: 6000 }
            );

            console.log("SRASM AI Raw Text:", text);

            if (parsed) {
                console.log("SRASM AI Parsed JSON:", parsed);
                toast("SRASM: Check console for full JSON report.", { duration: 5000 });
                toast.custom(() => <SRASMResultToast parsed={parsed} />, {
                    duration: 8000,
                    position: "bottom-right",
                });
            } else {
                toast.error(
                    "SRASM: Model response was not valid JSON. Check console.",
                    {
                        duration: 6000,
                    }
                );
            }
        } catch (err: any) {
            console.error("SRASM Debugger Error:", err);
            toast.error(`SRASM: Failed ❌ ${err?.message ?? "Unknown error"}`, {
                id: loadingId,
                duration: 6000,
            });
        } finally {
            setIsAnalyzing(false);
        }
    }, [files, prompt]);


    return (
        <>
            <Toaster position="bottom-right" />
            {
                showPrompt && <div className="fixed bottom-4 left-4 z-50 bg-white border-2 border-[#00E6E6] rounded-lg shadow-lg p-4 max-w-md">
                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-[#00E6E6] rounded-full mt-2 shrink-0" />
                            <div>
                                <h3 className="font-semibold">SRASM Analysis Suggestion</h3>
                                <p className="text-sm mt-1">
                                    Would you like to analyze{" "}
                                    <span className="font-mono text-[#00E6E6]">
                                        {combinedPreviewName}
                                    </span>{" "}
                                    for optimal slice splitting?
                                </p>
                                <p className="text-xs mt-2 opacity-70">
                                    Files: {(files ?? []).length}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPrompt(false)}
                                disabled={isAnalyzing}
                            >
                                No, Skip
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    setShowPrompt(false);
                                    checkTheSlices();
                                }}
                                disabled={isAnalyzing}
                            >
                                Yes, Analyze
                            </Button>
                        </div>
                    </div>
                </div>
            }

        </>
    );


    return null;
};

export default SRASMRealTimeSliceSplitDebugger;
