"use client"
import React from 'react';
import { Users } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';

export default function RegisterForm() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [role, setRole] = React.useState("customer");

  // FIX: Explicitly type the state to allow string (data URL) or null
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append('role', role);
    formData.forEach((item, index) => {
      console.log("the value of items", item)
      return
    })
    try {

      await apiFetch("user/register", {
        method: "POST",
        auth: false,
        body: formData,
        isformdata: true,
      });

      // window.location.href = "/login?registered=true";
    } catch (err) {
      setError("Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Role Selector */}
      <div className="flex p-1 bg-gray-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${role === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => setRole('hotelOwner')}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${role === 'hotelOwner' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
        >
          Hotel Owner
        </button>
      </div>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} className="w-full h-full object-cover" alt="Avatar Preview" />
            ) : (
              <Users className="text-gray-300 w-10 h-10" />
            )}
          </div>
          <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
            UPLOAD
            <input type="file" name="avatar" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>
        <span className="text-xs text-gray-400 font-medium">Profile Photo (Optional)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
          <input
            name="fullName"
            type="text"
            required
            className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
            placeholder="John Doe"
          />
        </div>

        {/* Username */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
          <input
            name="username"
            type="text"
            required
            className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
            placeholder="johndoe"
          />
        </div>

        {/* Email address */}
        <div className="col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">Email address</label>
          <input
            name="email"
            type="email"
            required
            className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone Number */}
        <div className="col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
          <input
            name="phone"
            type="tel"
            required
            className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Password */}
        <div className="col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-100 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? "Creating account..." : "Join StayHub"}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        By registering, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </form>
  );
}