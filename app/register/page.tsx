import React from 'react';
import { Shield } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex flex-col items-center">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-blue-600 font-bold text-2xl mb-8"
                    >
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        StayHub
                    </a>

                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
                    <RegisterForm />
                </div>

                <p className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest">
                    Secure Registration &bull; 256-bit Encryption
                </p>
            </div>
        </div>
    );
}