import { LoaderCircleIcon } from "lucide-react";

export const LoadingComponent = () => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-500/60 ">
            <div className="relative w-20 h-20">
                <LoaderCircleIcon className="absolute inset-0 m-auto animate-spin text-white" />
            </div>
        </div>
    );
}