import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

export const LoadingComponent = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/60 ">
            <div className="relative w-20 h-20">
                <LoadingSpinner className="absolute inset-0 m-auto text-white" />
            </div>
        </div>
    );
}

export const LoadingSpinner = ({ className }: { className?: string }) => {
    return (
        <LoaderCircleIcon className={cn("animate-spin", className)} />
    );
}