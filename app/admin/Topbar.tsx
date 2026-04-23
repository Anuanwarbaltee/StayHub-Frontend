"use client";

import { Menu, Search, Bell, User } from "lucide-react";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">

            {/* Left Section: Mobile Menu & Search */}
            <div className="flex items-center gap-4 flex-1">
                {/* Hamburger (Mobile Only) */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                {/* Search Bar (Hidden on small mobile, visible on tablet+) */}
                <div className="hidden sm:flex items-center relative max-w-md w-full">
                    <Search className="absolute left-3 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search everything..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-2 md:gap-4">

                {/* Notifications */}
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                {/* User Profile */}
                <button className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 leading-none">Alex Rivera</p>
                        <p className="text-xs text-slate-500 mt-1">Super Admin</p>
                    </div>

                    <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                        <User size={20} />
                    </div>
                </button>

            </div>
        </header>
    );
}