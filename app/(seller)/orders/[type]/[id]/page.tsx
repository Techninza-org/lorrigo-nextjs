import CourierPage from "@/components/Orders/courier-page";
import { LoadingComponent } from "@/components/loading-spinner";
import { Suspense } from "react";

export default function OrderPage() {
    return (
        <div className="grid grid-cols-3 gap-3 my-8">
            <Suspense fallback={<LoadingComponent />}>
                <CourierPage />
            </Suspense>
        </div>
    )
}