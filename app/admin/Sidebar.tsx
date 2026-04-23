"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Hotel,
    BedDouble,
    CalendarCheck,
    ChevronDown,
    ChevronRight
} from "lucide-react";

const menu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
        name: "Hotels",
        icon: Hotel,
        children: [
            { name: "Add Hotel", href: "/admin/hotels/add" },
            { name: "Hotel List", href: "/admin/hotels/list" },
            { name: "Hotel Details", href: "/admin/hotels/details" },
        ],
    },
    {
        name: "Rooms",
        icon: BedDouble,
        children: [
            { name: "Add Room", href: "/admin/rooms/add" },
            { name: "Room List", href: "/admin/rooms/list" },
        ],
    },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
];

export default function Sidebar({ closeDrawer }: { closeDrawer: () => void }) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const pathname = usePathname();

    const toggleMenu = (name: string) => {
        setOpenMenu(openMenu === name ? null : name);
    };

    return (
        <aside className="h-full w-64 border-r border-slate-200 bg-white flex flex-col transition-all">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                    Stay<span className="text-blue-600">Admin</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    if (!item.children) {
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={closeDrawer}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <Icon size={18} />
                                {item.name}
                            </Link>
                        );
                    }

                    const isParentActive = item.children.some(child => pathname === child.href);

                    return (
                        <div key={item.name} className="space-y-1">
                            <button
                                onClick={() => toggleMenu(item.name)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isParentActive ? "text-slate-900" : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </div>
                                {openMenu === item.name ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-200 ease-in-out ${openMenu === item.name ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="ml-9 mt-1 flex flex-col gap-1 border-l border-slate-100">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={closeDrawer}
                                            className={`pl-4 py-1.5 text-sm transition-colors ${pathname === child.href
                                                ? "text-blue-600 font-semibold"
                                                : "text-slate-500 hover:text-slate-900"
                                                }`}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}