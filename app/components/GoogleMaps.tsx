interface Props {
    coords: [number, number],
    name: string
}
export default function MapComponent({ coords, name }: Props) {
    const lat = coords?.[1] || null;
    const lng = coords?.[0] || null;

    // Construct the embed URL. 
    const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="h-full w-full rounded-3xl overflow-hidden border border-gray-100 shadow-inner relative z-0 bg-gray-50">
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map location of ${name}`}
                src={mapUrl}
            ></iframe>
            <div className="absolute bottom-3 left-15 bg-white/95 backdrop-blur px-4 py-3 rounded-2xl border border-white/20 shadow-xl z-10 max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Location</p>
                </div>
                <p className="text-sm font-semi-bold text-gray-800 truncate">{name}</p>
            </div>
        </div>
    );
};