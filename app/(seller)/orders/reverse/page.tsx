import ReverseOrders from "@/components/Orders/reverse-orders";
import { LoadingComponent } from "@/components/loading-spinner";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { Suspense } from "react";

export default function ReverseOrdersPage() {
   
    return (
        <>
            <Suspense fallback={<LoadingComponent/>}>
                <ReverseOrders />
            </Suspense>
        </>
    );

}