import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
    fullPage?: boolean;
    message?: string;
    size?: number;
}

const Loader = ({ fullPage = false, message = "Loading...", size = 32 }: LoaderProps) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
                {/* Outer Ring */}
                <div
                    className="absolute inset-0 border-4 border-blue-100 rounded-full"
                    style={{ width: size, height: size }}
                />
                {/* Spinning Element */}
                <Loader2
                    className="text-blue-600 animate-spin relative z-10"
                    size={size}
                />
            </div>
            {message && (
                <p className="text-sm font-medium text-slate-500 animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8 w-full">
            {content}
        </div>
    );
};

export default Loader;