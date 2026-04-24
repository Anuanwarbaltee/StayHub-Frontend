import React, { Suspense } from 'react';
import { Shield } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import GlobalAlert from '../components/ui/alert';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex flex-col items-center text-center">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-blue-600 font-bold text-2xl mb-8"
                    >
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        StayHub
                    </a>


                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100 sm:px-10">
                    <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
                        <LoginForm />
                    </Suspense>
                </div>

                <div className="mt-6 text-center">
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Create a free account
                        </a>
                    </p>
                </div>
            </div>
            {/* <GlobalAlert /> */}
        </div>
    );
}