import React from 'react';
import { DemoSliceA } from './DemoSliceA';
import { DemoSliceB } from './DemoSliceB';
import { BlogSliceDemo } from './BlogSliceDemo';

const ReRenderDemo: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        SRASM <span className="text-[#00E6E6]">Re-render Optimization</span> Demo
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        This demo proves that updating one slice of state does NOT cause re-renders in components subscribed to other slices.
                    </p>
                    <div className="mt-6 p-4 bg-[#1D1D1D] rounded-lg inline-block text-left text-sm text-gray-300 border border-[#333]">
                        <p className="font-bold text-white mb-2">How to verify:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                            <li>Click "Update Slice A". Observe only the Cyan box flashes.</li>
                            <li>Click "Update Slice B". Observe only the Red box flashes.</li>
                            <li>These components are also <strong>memoized</strong> to prevent re-renders when the parent App re-renders due to global state changes.</li>
                        </ol>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DemoSliceA />
                    <DemoSliceB />
                </div>

                <BlogSliceDemo />
            </div>
        </div>
    );
};

export default ReRenderDemo;
