import { SearchX } from "lucide-react";

interface props {
    heading: string,
    message?: string
}

export default function Notfound({ heading = "No Data Found", message }: props) {

    return (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">

            <SearchX size={64} className="text-gray-400 mb-4" />

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {heading}
            </h2>

            {
                message && (
                    <p className="text-gray-500 max-w-md">
                        {message}
                    </p>
                )

            }

        </div>
    );
}
