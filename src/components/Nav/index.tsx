import React from "react";
import { Link, useLocation } from "react-router-dom";

const Nav: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="w-full px-6 py-4 bg-[#181818] border-b border-[#2A2A2A] flex items-center justify-between sticky top-0 z-50">
            <div className="text-xl font-bold text-[#00E6E6]">SRASM</div>

            <div className="flex gap-6">
                <Link
                    to="/"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border
            ${isActive("/")
                            ? "bg-[#2A2A2A] text-[#00E6E6] border-[#333]"
                            : "text-[#E0E0E0] hover:bg-[#2A2A2A] hover:text-[#00E6E6] border-transparent"
                        }`}
                >
                    Home
                </Link>

                <Link
                    to="/tree"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border
            ${isActive("/tree")
                            ? "bg-[#2A2A2A] text-[#00E6E6] border-[#333]"
                            : "text-[#E0E0E0] hover:bg-[#2A2A2A] hover:text-[#00E6E6] border-transparent"
                        }`}
                >
                    SRASM Tree
                </Link>

                <Link
                    to="/chat"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border
            ${isActive("/chat")
                            ? "bg-[#2A2A2A] text-[#00E6E6] border-[#333]"
                            : "text-[#E0E0E0] hover:bg-[#2A2A2A] hover:text-[#00E6E6] border-transparent"
                        }`}
                >
                    AI Debugger
                </Link>

                <Link
                    to="/demo"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border
            ${isActive("/demo")
                            ? "bg-[#2A2A2A] text-[#00E6E6] border-[#333]"
                            : "text-[#E0E0E0] hover:bg-[#2A2A2A] hover:text-[#00E6E6] border-transparent"
                        }`}
                >
                    Re-render Demo
                </Link>
            </div>
        </nav>
    );
};

export default Nav;
