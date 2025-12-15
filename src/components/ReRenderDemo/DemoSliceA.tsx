import { useRef, useEffect } from 'react';
import { useSRASM } from '../../srsm';
import { RefreshCcw } from 'lucide-react';

export const DemoSliceA = () => {
    // Only subscribe to demoA slice
    const { state, setState } = useSRASM('demoA');
    const renderCountRef = useRef(0);
    const highlightRef = useRef<HTMLDivElement>(null);

    renderCountRef.current++;

    // Visual flash on render
    useEffect(() => {
        if (highlightRef.current) {
            highlightRef.current.style.backgroundColor = '#00E6E640';
            setTimeout(() => {
                if (highlightRef.current) {
                    highlightRef.current.style.backgroundColor = 'transparent';
                }
            }, 300);
        }
    });

    const increment = () => {
        setState((prev) => ({
            ...prev,
            count: prev.count + 1,
            lastUpdated: new Date().toLocaleTimeString(),
        }));
    };

    return (
        <div
            ref={highlightRef}
            className="p-6 rounded-xl border border-[#00E6E6] bg-[#1a1a1a] transition-colors duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#00E6E6]">Slice A Component</h3>
                <span className="text-xs px-2 py-1 bg-[#00E6E620] text-[#00E6E6] rounded">
                    Subscribes to 'demoA'
                </span>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-300">
                    <span>Count:</span>
                    <span className="font-mono text-2xl text-white">{state.count}</span>
                </div>

                <div className="flex justify-between items-center text-gray-300 text-sm">
                    <span>Last Updated:</span>
                    <span className="font-mono text-white">{state.lastUpdated}</span>
                </div>

                <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Render Count: <span className="text-white">{renderCountRef.current}</span></p>
                    <button
                        onClick={increment}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00E6E6] text-black font-semibold rounded-lg hover:bg-[#00CCCC] transition-colors"
                    >
                        <RefreshCcw size={16} />
                        Update Slice A
                    </button>
                </div>
            </div>
        </div>
    );
};
