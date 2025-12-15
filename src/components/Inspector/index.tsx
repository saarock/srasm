import type { InspectorProps } from "../../types";


export const Inspector: React.FC<InspectorProps> = ({ selected }) => (
    <div className="w-72 md:w-80 bg-[#181818] rounded-xl p-4 overflow-auto border border-[#2A2A2A]">
        <div className="text-md text-[#00E6E6] font-bold mb-3 border-b border-[#2A2A2A] pb-2">
            🔍 Node Inspector
        </div>
        {selected ? (
            <div className="flex flex-col gap-3">
                <div className="text-xs text-[#888888] font-semibold">Selected Key</div>
                <div className="font-mono text-sm text-[#F0F0F0] break-all p-2 bg-[#0A0A0A] rounded-lg border border-[#2A2A2A]">
                    {selected.key}
                </div>
                <div className="text-xs text-[#888888] font-semibold">
                    Raw Value (JSON)
                </div>
                <pre className="bg-[#0A0A0A] p-3 rounded-lg text-xs text-[#D0D0D0] max-h-60 overflow-auto border border-[#2A2A2A] shadow-inner font-mono">
                    {JSON.stringify(selected.data, null, 2)}
                </pre>
            </div>
        ) : (
            <div className="text-sm text-[#888888] p-4 bg-[#1D1D1D] rounded-lg">
                Select a node in the hierarchy view to inspect its key and raw value.
            </div>
        )}
    </div>
);
