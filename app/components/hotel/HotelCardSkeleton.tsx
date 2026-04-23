const HotelCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">

            <div className="h-48 bg-gray-200"></div>

            <div className="p-5 space-y-4">

                <div className="flex justify-between items-start">
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                </div>

                <div className="h-4 bg-gray-200 rounded w-1/2"></div>

                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                </div>

            </div>
        </div>
    );
};

export default HotelCardSkeleton;
