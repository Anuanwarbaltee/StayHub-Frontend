"use client"
import React from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';
import { useAppDispatch } from '@/app/redux/hook/hooks';
import { updateUser } from '@/app/redux/reducers/userSlice';

export default function LoginForm() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [showSuccess, setShowSuccess] = React.useState(false);
    const dispatch = useAppDispatch();
    // Check if user just registered successfully
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('registered')) {
            setShowSuccess(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setShowSuccess(false);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('username');
        const password = formData.get('password');


        try {
            let res: any = await apiFetch("user/login", {
                method: "POST",
                auth: false,
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (res.success) {
                dispatch(
                    updateUser({
                        user: res?.data?.user,
                        accessToken: res?.data?.accessToken,
                        refreshToken: res?.data?.refreshToken
                    })
                )
                // window.location.href = "/";
            } else {
                setError(res.Error)
            }
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {showSuccess && (
                <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                    Registration successful! Please log in.
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in shake-1">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Email address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            name="username"
                            type="text"
                            required
                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            name="password"
                            type="password"
                            required
                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500 cursor-pointer">
                        Remember me
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-100 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                )}
            </button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-400">Or continue with</span>
                </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-3"> */}
            <button type="button" className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-gray-100 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                Google
            </button>
            {/* <button type="button" className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-gray-100 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
          Github
        </button> 
             </div> */}
        </form>
    );
}