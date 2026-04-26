"use client";

import React, { useRef, useState } from "react";
import {
    Building2,
    MapPin,
    Image as ImageIcon,
    Sparkles,
    Globe,
    UploadCloud,
    X
} from "lucide-react";
import ErrorText from "../../component/ui/errorText";
import { apiFetch } from "@/app/lib/api";
import ImageUpload from "../../component/imageUpload";
import { showAlert } from "@/app/redux/reducers/alertSlice";
import { useDispatch } from "react-redux";
import GlobalAlert from "@/app/components/ui/alert";

export default function AddHotelForm() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [hotelForm, setHotelForm] = useState({
        name: "",
        city: "",
        country: "",
        description: "",
        images: [] as string[],
        amenities: [] as { name: string }[],
        zipCode: "",
        state: "",
        mapLink: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setHotelForm(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleAmenityChange = (item: string) => {
        setHotelForm((prev) => {
            const exists = prev.amenities.some(a => a.name === item);

            const updatedAmenities = exists
                ? prev.amenities.filter(a => a.name !== item)
                : [...prev.amenities, { name: item }];

            if (updatedAmenities.length > 0) {
                setErrors(prevErrors => ({ ...prevErrors, amenities: "" }));
            }

            return { ...prev, amenities: updatedAmenities };
        });
    };

    const handleImagesUploaded = (newUrls: string[]) => {
        setHotelForm(prev => ({
            ...prev,
            images: [...prev.images, ...newUrls]
        }));
    };

    const handleImageRemoved = (urlToRemove: string) => {
        setHotelForm(prev => ({
            ...prev,
            images: prev.images.filter(url => url !== urlToRemove)
        }));
    };



    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!hotelForm.name.trim()) newErrors.name = "Hotel name is required";
        if (!hotelForm.name.trim()) newErrors.mapLink = "Google map link is required";
        if (!hotelForm.description.trim()) newErrors.description = "Description is required";
        if (!hotelForm.country.trim()) newErrors.country = "Country is required";
        if (!hotelForm.city.trim()) newErrors.city = "City is required";
        if (hotelForm.amenities.length === 0) {
            newErrors.amenities = "Please select at least one amenity";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            const formData = new FormData(e.currentTarget);
            formData.forEach((value, key) => {
                if (value instanceof File) {
                    console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            });
            try {

                let res = await apiFetch("hotel/add", {
                    method: "POST",
                    body: JSON.stringify(hotelForm),
                });
                if (res.success) {
                    dispatch(showAlert({ type: "success", message: res.message || "Hotel added successfully! Awaiting admin approval." }));
                } else {
                    dispatch(showAlert({ type: "error", message: res.message || "Failed to add hotel." }));
                }


                // window.location.href = "/login?registered=true";
                // setError("Registration failed. Please check your details.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <div className="max-w-5xl mx-auto pb-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Add New Hotel</h1>
                    <p className="text-slate-500 text-sm">Fill in the details to list your property on the platform.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 mb-2 text-blue-600">
                                <Building2 size={20} />
                                <h2 className="font-semibold text-slate-900">General Information</h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Hotel Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={hotelForm.name}
                                    onChange={handleChange}
                                    placeholder="Enter Hotel Name"
                                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
                                />
                                <ErrorText error={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description *</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    value={hotelForm.description}
                                    onChange={handleChange}
                                    placeholder="Tell guests what makes this hotel special..."
                                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all resize-none ${errors.description ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
                                />
                                <ErrorText error={errors.description} />
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 mb-2 text-blue-600">
                                <Sparkles size={20} />
                                <h2 className="font-semibold text-slate-900">Amenities </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {['Free WiFi', 'Breakfast', 'Pool', 'Parking', 'Spa', 'Restaurant'].map((item) => (
                                    <label
                                        key={item}
                                        className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            checked={hotelForm.amenities.some(a => a.name === item)}
                                            onChange={() => handleAmenityChange(item)}
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-600">{item}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.amenities && (
                                <div className="pt-2">
                                    <ErrorText error={errors.amenities} />
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 mb-2 text-blue-600">
                                <MapPin size={20} />
                                <h2 className="font-semibold text-slate-900">Location Details</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Country */}
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={hotelForm.country}
                                        onChange={handleChange}
                                        placeholder="Enter Country Name"
                                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none ${errors.country ? 'border-red-500' : 'border-slate-200'}`}
                                    />
                                    <ErrorText error={errors.country} />
                                </div>

                                {/* State & City */}
                                <div className="space-y-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={hotelForm.city}
                                            onChange={handleChange}
                                            placeholder="Enter City Name"
                                            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none ${errors.city ? 'border-red-500' : 'border-slate-200'}`}
                                        />
                                        <ErrorText error={errors.city} />
                                    </div>
                                    <label className="text-sm font-medium text-slate-700">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={hotelForm.state}
                                        onChange={handleChange}
                                        placeholder="Enter State"
                                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none ${errors.state ? 'border-red-500' : 'border-slate-200'}`}
                                    />
                                </div>


                                {/* Zip Code & Map Link */}
                                <div className="space-y-2 col-span-1">
                                    <label className="text-sm font-medium text-slate-700">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={hotelForm.zipCode}
                                        onChange={handleChange}
                                        placeholder="Enter ZipCode"
                                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none ${errors.zipCode ? 'border-red-500' : 'border-slate-200'}`}
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Google Maps Link *</label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            name="mapLink"
                                            value={hotelForm.mapLink}
                                            onChange={handleChange}
                                            placeholder="https://goo.gl/maps/..."
                                            className={`w-full pl-4 pr-10 py-2.5 bg-blue-50/30 border rounded-xl outline-none transition-all ${errors.mapLink ? 'border-red-500' : 'border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'}`}
                                        />
                                        <Globe className="absolute right-3 top-3 text-slate-400" size={18} />
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Paste the share link from Google Maps. Our team will verify the exact coordinates.
                                    </p>
                                    <ErrorText error={errors.mapLink} />
                                </div>
                            </div>
                        </section>

                        {/* Image Section  */}
                        <ImageUpload
                            value={hotelForm.images}
                            onUploadComplete={handleImagesUploaded}
                            onRemove={handleImageRemoved}
                        />

                        <div className="flex items-center gap-3 pt-4">
                            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-200">
                                Submit for Approval
                            </button>
                            <button type="button" className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <GlobalAlert />
        </>

    );
}