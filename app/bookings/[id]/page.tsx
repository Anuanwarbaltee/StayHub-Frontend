"use client";


import { useState, useEffect } from 'react';
import {
    Users,
    ArrowRight,
    ChevronLeft,
    ShieldCheck,
    Lock,
    CheckCircle2,
    Loader2,
    Star,
    User as UserIcon,
    Bell,
    Heart,
    Hotel,
    Calendar,
    Mail,
    Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/app/lib/api';

/**
 * NOTE FOR USER: 
 * I have mocked 'useAppSelector', 'useParams', and 'apiFetch' to ensure 
 * the component works in this preview environment. 
 * When copying back to your project, restore your original imports.
 */

// Mocking hooks/api for preview
const useAppSelector = (fn: any) => fn({ bookingFilters: { startDate: '2024-10-24', endDate: '2024-10-27', capacity: 2 } });


export default function BookingFlow() {
    const [step, setStep] = useState<'details' | 'review' | 'summary'>('details');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const filterData = useAppSelector((state: any) => state.bookingFilters);
    const [roomData, setRoomData] = useState<any>(null);
    const [hotelData, setHotelData] = useState<any>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingReference, setBookingReference] = useState<string>("");
    const { id } = useParams();

    const [bookingForm, setBookingForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        checkInDate: "",
        checkOutDate: "",
        guests: 1,
        hotel: "",
        room: "",
    });

    const calculateNights = (): number => {
        if (!bookingForm.checkInDate || !bookingForm.checkOutDate) return 0;
        const start = new Date(bookingForm.checkInDate);
        const end = new Date(bookingForm.checkOutDate);
        const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        return Math.max(Math.ceil(diff), 0);
    };

    const nights = calculateNights();
    const serviceFee = 85.00;
    const taxes = (nights * (roomData?.price ?? 0)) * 0.12;
    const totalAmount = (nights * (roomData?.price ?? 0)) + serviceFee + taxes;

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!bookingForm.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!bookingForm.email.trim()) {
            newErrors.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(bookingForm.email)) {
            newErrors.email = "Invalid email address";
        }
        if (!bookingForm.phone.trim()) newErrors.phone = "Phone number is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBookingForm(prev => ({
            ...prev,
            [name]: name === 'guests' ? Number(value) : value
        }));
        if (errors[name]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const getRoomData = async () => {
        try {
            const res: any = await apiFetch(`room/${id}`, { method: "GET" });
            if (res.success && res.data) {
                setRoomData(res.data);
                setHotelData(res.data.hotelDetails || null);
                setBookingForm(prev => ({
                    ...prev,
                    hotel: res.data.hotelDetails._id || "",
                    room: res.data._id || "",
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (id) getRoomData();
    }, [id]);

    // useEffect(() => {
    //     if (!filterData) return;
    //     setBookingForm(prev => ({
    //         ...prev,
    //         checkInDate: filterData.startDate ? new Date(filterData.startDate).toISOString().split("T")[0] : "",
    //         checkOutDate: filterData.endDate ? new Date(filterData.endDate).toISOString().split("T")[0] : "",
    //         guests: filterData.capacity || 1,
    //     }));
    // }, [filterData]);

    useEffect(() => {
        if (!filterData) return;
        setBookingForm(prev => ({
            ...prev,
            checkInDate: filterData.startDate ? new Date(filterData.startDate).toISOString().split("T")[0] : "",
            checkOutDate: filterData.endDate ? new Date(filterData.endDate).toISOString().split("T")[0] : "",
            guests: filterData.capacity || 1,
        }));
    }, [filterData?.startDate, filterData?.endDate, filterData?.capacity]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setStep('review');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFinalSubmit = async () => {
        setLoading(true);
        const payload = {
            name: bookingForm.fullName.trim(),
            email: bookingForm.email,
            phone: bookingForm.phone,
            guests: Number(bookingForm.guests) || 1,
            checkInDate: bookingForm.checkInDate,
            checkOutDate: bookingForm.checkOutDate,
            roomId: id as string,
            hotelId: bookingForm?.hotel,
        };

        console.log("Booking Payload:", payload);
        const res: any = await apiFetch(`booking/create`, {
            method: "POST",
            body: JSON.stringify(payload),
        });

        setLoading(false);
        if (res?.success) {
            const ref = res.bookingId || `BK-${Date.now().toString().slice(-8)}`;
            setBookingReference(ref);
            setStep('summary');
        } else {
            alert(res?.message || "Failed to create booking");
        }
    };

    const ErrorText = ({ error }: { error?: string }) =>
        error ? <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{error}</p> : null;

    return (


        < main className="max-w-7xl mx-auto w-full p-4" >
            {/* 1. HEADER SECTION */}
            <div className="flex flex-col mb-12" >
                <h1 className="text-4xl font-bold text-[#000000] mb-6 tracking-tight">Complete Your Booking</h1>

                {/* Stepper Implementation */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 'details' ? 'bg-[#000000] text-white scale-110' : 'bg-[#006c49] text-[#76777d]'}`}>1</div>
                        <span className={`text-sm font-semibold ${step === 'details' ? 'text-[#000000]' : 'text-[#76777d]'}`}>Guest Details</span>
                    </div>
                    <div className="h-[1px] w-12 bg-[#c6c6cd]"></div>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 'review' ? 'bg-[#000000] text-white scale-110' : step === 'summary' ? 'bg-emerald-100 text-emerald-600' : 'bg-[#006c49] text-[#76777d]'}`}>
                            {step === 'summary' ? <CheckCircle2 size={16} /> : '2'}
                        </div>
                        <span className={`text-sm font-semibold ${step === 'review' ? 'text-[#000000]' : 'text-[#76777d]'}`}>review</span>
                    </div>
                    <div className="h-[1px] w-12 bg-[#c6c6cd]"></div>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 'summary' ? 'bg-[#000000] text-white scale-110' : 'bg-[#006c49] text-[#76777d]'}`}>3</div>
                        <span className={`text-sm font-semibold ${step === 'summary' ? 'text-[#000000]' : 'text-[#76777d]'}`}>Confirmation</span>
                    </div>
                </div>
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* LEFT COLUMN: FORM SECTION */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {step === 'details' ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12"
                            >
                                <section className="bg-white rounded-2xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <UserIcon size={24} className="text-[#000000]" />
                                        <h2 className="text-2xl font-semibold text-[#000000] tracking-tight">Guest Information</h2>
                                    </div>

                                    <form onSubmit={handleNext} className="space-y-10">
                                        <div className="grid grid-cols-1 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest ml-1">Full Name *</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={bookingForm.fullName}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-5 py-4 bg-[#f2f4f6] border-none rounded-xl outline-none transition-all font-medium text-[#000000] focus:ring-2 focus:ring-primary/10 ${errors.fullName ? 'ring-2 ring-red-500/20' : ''}`}
                                                        placeholder="Alexander Wright"
                                                    />
                                                </div>
                                                <ErrorText error={errors.fullName} />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest ml-1">Email Address *</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={bookingForm.email}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-5 py-4 bg-[#f2f4f6] border-none rounded-xl outline-none transition-all font-medium text-[#000000] focus:ring-2 focus:ring-primary/10 ${errors.email ? 'ring-2 ring-red-500/20' : ''}`}
                                                        placeholder="alexander@luxury.com"
                                                    />
                                                    <ErrorText error={errors.email} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest ml-1">Phone Number *</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={bookingForm.phone}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-5 py-4 bg-[#f2f4f6] border-none rounded-xl outline-none transition-all font-medium text-[#000000] focus:ring-2 focus:ring-primary/10 ${errors.phone ? 'ring-2 ring-red-500/20' : ''}`}
                                                        placeholder="+92 300 1234567"
                                                    />
                                                    <ErrorText error={errors.phone} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 pt-10 border-t border-[#eceef0]">
                                            <div className="flex items-center gap-3 mb-6">
                                                <Hotel size={20} className="text-[#006c49]" />
                                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#000000]">Stay Preferences</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="p-6 bg-[#f2f4f6] rounded-xl border border-[#eceef0]">
                                                    <p className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest mb-2">Check-in / Out</p>
                                                    <p className="font-bold text-[#000000]">{bookingForm.checkInDate} — {bookingForm.checkOutDate}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest ml-1">Number of Guests</label>
                                                    <div className="relative">
                                                        <select
                                                            name="guests"
                                                            value={bookingForm.guests}
                                                            onChange={handleInputChange}
                                                            className="w-full px-5 py-4 bg-[#f2f4f6] border-none rounded-xl font-bold text-[#000000] outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/10"
                                                        >
                                                            {[1, 2, 3, 4, 5, 6].map(n => (
                                                                <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronLeft className="-rotate-90 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#76777d]" size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-5 bg-[#000000] text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-all hover:bg-slate-900 active:scale-[0.98] shadow-lg shadow-primary/5 flex items-center justify-center gap-3"
                                        >
                                            Next <ArrowRight size={18} />
                                        </button>
                                    </form>
                                </section>
                            </motion.div>
                        ) :
                            step === 'review' ?
                                (
                                    <motion.div
                                        key="review"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-white rounded-2xl p-8 shadow-sm space-y-10"
                                    >
                                        <button
                                            onClick={() => setStep('details')}
                                            className="flex items-center gap-2 text-[10px] font-bold text-[#76777d] uppercase tracking-widest hover:text-[#000000] transition-colors"
                                        >
                                            <ChevronLeft size={16} /> Back to Details
                                        </button>

                                        <div className="flex items-center gap-3 mb-8">
                                            <ShieldCheck size={24} className="text-[#006c49]" />
                                            <h2 className="text-2xl font-semibold tracking-tight">Review Your Booking</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-6 bg-[#f2f4f6] rounded-xl border border-[#eceef0]">
                                                <p className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest mb-2">Guest Name</p>
                                                <p className="font-bold text-[#000000]">{bookingForm.fullName}</p>
                                            </div>
                                            <div className="p-6 bg-[#f2f4f6] rounded-xl border border-[#eceef0]">
                                                <p className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest mb-2">Contact Info</p>
                                                <p className="font-bold text-[#000000] truncate">{bookingForm.email}</p>
                                                <p className="text-xs text-[#76777d]">{bookingForm.phone}</p>
                                            </div>
                                            <div className="p-6 bg-[#f2f4f6] rounded-xl border border-[#eceef0]">
                                                <p className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest mb-2">Stay Dates</p>
                                                <p className="font-bold text-[#000000]">{bookingForm.checkInDate} — {bookingForm.checkOutDate}</p>
                                            </div>
                                            <div className="p-6 bg-[#f2f4f6] rounded-xl border border-[#eceef0]">
                                                <p className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest mb-2">Guests</p>
                                                <p className="font-bold text-[#000000]">{bookingForm.guests} Guest{bookingForm.guests > 1 ? 's' : ''}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <Lock size={18} className="text-[#006c49]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[11px] font-bold text-[#000000] uppercase tracking-wider mb-0.5">Manual review</p>
                                                <p className="text-xs text-[#006c49] font-medium leading-relaxed">
                                                    Your booking is secured. review will be handled manually by the hotel administrator.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleFinalSubmit}
                                            disabled={loading}
                                            className="w-full py-5 bg-[#000000] text-white font-bold text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-slate-900 disabled:bg-[#006c49]"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Confirm Booking <ArrowRight size={18} /></>}
                                        </button>
                                    </motion.div>
                                ) : (
                                    /* SUMMARY STEP / CONFIRMATION */
                                    <motion.div
                                        key="summary"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-2xl p-12 shadow-sm text-center"
                                    >
                                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle2 size={42} className="text-emerald-600" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#000000] mb-4 tracking-tight">Stay Confirmed!</h2>
                                        <p className="text-[#45464d] max-w-md mx-auto mb-10 leading-relaxed font-medium">
                                            Success! Your reservation reference is <span className="font-bold text-[#000000]">{bookingReference}</span>.
                                            A confirmation email has been sent to your inbox.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-lg mx-auto">
                                            <div className="p-6 bg-[#f2f4f6] rounded-2xl border border-[#eceef0] text-left">
                                                <p className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest mb-2">Duration</p>
                                                <p className="text-xl font-bold text-[#000000]">{nights} Nights</p>
                                            </div>
                                            <div className="p-6 bg-[#f2f4f6] rounded-2xl border border-[#eceef0] text-left">
                                                <p className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest mb-2">Guests</p>
                                                <p className="text-xl font-bold text-[#000000]">{bookingForm.guests} Persons</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => window.location.reload()}
                                            className="px-10 py-4 bg-[#000000] text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-900 transition-all"
                                        >
                                            Back to Home
                                        </button>
                                    </motion.div>
                                )}
                    </AnimatePresence>
                </div>

                {/* RIGHT COLUMN: BOOKING SUMMARY SIDEBAR */}
                {step !== 'summary' && (
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-32 bg-white rounded-2xl shadow-xl shadow-primary/5 overflow-hidden">
                            {/* Room Preview */}
                            <div className="relative h-56">
                                <img
                                    src={roomData?.images?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000'}
                                    className="w-full h-full object-cover"
                                    alt="Room"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-[#eceef0]">
                                    <ShieldCheck size={18} className="text-[#006c49]" />
                                    <span className="text-[11px] font-extrabold text-[#000000] uppercase tracking-widest">Best Price Guarantee</span>
                                </div>
                            </div>

                            {/* Details Table */}
                            <div className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#000000] mb-2 leading-tight">{hotelData?.name || 'Grand City Hotel'}</h3>
                                    <div className="flex items-center gap-1.5 text-[#006c49]">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />)}
                                        <span className="text-xs font-bold text-[#76777d] ml-2">(4.8/5)</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-[#45464d]">{roomData?.roomType} × {nights} nights</span>
                                        <span className="text-[#000000] font-bold">${(roomData?.price * nights).toLocaleString() || '0'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[#45464d]">Service & Cleaning Fee</span>
                                        <span className="text-[#000000] font-bold">${serviceFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[#45464d]">Estimated Taxes (12%)</span>
                                        <span className="text-[#000000] font-bold">${taxes.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#eceef0]">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#76777d] uppercase tracking-widest mb-1">Total Amount</p>
                                            <p className="text-4xl font-black text-[#000000] tracking-tighter">${totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <ShieldCheck size={28} className="text-[#006c49] ml-auto mb-2" />
                                            <p className="text-[9px] font-bold text-[#006c49] uppercase tracking-tighter">Verified Secure</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                )}
            </div>
        </main >
    );
}
