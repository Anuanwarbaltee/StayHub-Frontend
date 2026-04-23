"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 antialiased">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar closeDrawer={() => setOpen(false)} />
            </div>

            {/* Mobile Drawer */}
            {open && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
                        <Sidebar closeDrawer={() => setOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Area */}
            <div className="flex flex-col flex-1 min-w-0">
                <Topbar onMenuClick={() => setOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}