import { useRef, useEffect } from 'react';
import { useSRASM } from '../../srsm';
import { Type } from 'lucide-react';

export const DemoSliceB = () => {
    // Only subscribe to demoB slice
    const { state, setState } = useSRASM('demoB');
    const renderCountRef = useRef(0);
    const highlightRef = useRef<HTMLDivElement>(null);

    renderCountRef.current++;

    // Visual flash on render
    useEffect(() => {
        if (highlightRef.current) {
            highlightRef.current.style.backgroundColor = '#FF6B6B40';
            setTimeout(() => {
                if (highlightRef.current) {
                    highlightRef.current.style.backgroundColor = 'transparent';
                }
            }, 300);
        }
    });

    const updateText = () => {
        const texts = ['Hello World', 'SRASM Rocks', 'No Re-renders!', 'Performance 🚀'];
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        setState({ text: randomText });
    };

    return (
        <div
            ref={highlightRef}
            className="p-6 rounded-xl border border-[#FF6B6B] bg-[#1a1a1a] transition-colors duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#FF6B6B]">Slice B Component</h3>
                <span className="text-xs px-2 py-1 bg-[#FF6B6B20] text-[#FF6B6B] rounded">
                    Subscribes to 'demoB'
                </span>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-300">
                    <span>Text:</span>
                    <span className="font-mono text-lg text-white truncate max-w-[150px]">{state.text}</span>
                </div>

                <div className="flex justify-between items-center text-gray-300">
                    <span>Color:</span>
                    <div
                        className="w-6 h-6 rounded border border-gray-600"
                        style={{ backgroundColor: state.color }}
                    />
                </div>

                <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Render Count: <span className="text-white">{renderCountRef.current}</span></p>
                    <button
                        onClick={updateText}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white font-semibold rounded-lg hover:bg-[#FF5252] transition-colors"
                    >
                        <Type size={16} />
                        Update Slice B
                    </button>
                </div>
            </div>
        </div>
    );
}
