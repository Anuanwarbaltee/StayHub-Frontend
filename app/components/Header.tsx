"use client";

import Link from "next/link";
import { Shield, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">

                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition">
                        <Shield className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                        StayHub
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">

                    <Link href="/" className="hover:text-gray-900 transition">
                        Home
                    </Link>

                    <Link href="/explore" className="hover:text-gray-900 transition">
                        Explore
                    </Link>

                    <Link href="/bookings" className="hover:text-gray-900 transition">
                        Bookings
                    </Link>

                    {/* Divider */}
                    <div className="w-px h-5 bg-gray-200"></div>

                    {/* CTA */}
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-sm">
                        Sign In
                    </button>
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600"
                >
                    <Menu size={20} />
                </button>
            </div>

            {open && (
                <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3 shadow-sm">
                    <Link href="/" className="block text-gray-700">Home</Link>
                    <Link href="/explore" className="block text-gray-700">Explore</Link>
                    <Link href="/bookings" className="block text-gray-700">Bookings</Link>

                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2">
                        Sign In
                    </button>
                </div>
            )}
        </header>
    );
}