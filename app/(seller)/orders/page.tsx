import Orders from "@/components/Orders";
import { LoadingComponent } from "@/components/loading-spinner";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { Suspense } from "react";

export default function OrdersPage() {
    const DASHBOARD_LINKS = [
        {
            label: "New",
            href: "/orders?status=new",
        },
        {
            label: "Ready to Ship",
            href: "/orders?status=ready-to-ship",
        },
        {
            label: "In-Transit",
            href: "/orders?status=in-transit",
        },
        {
            label: "Delivered",
            href: "/orders?status=delivered",
        },
        {
            label: "RTO",
            href: "/orders?status=rto",
        },
        {
            label: "NDR",
            href: "/orders?status=ndr",
        },
        {
            label: "All Shipments",
            href: "/orders",
        },
        {
            label: "Reverse Orders",
            href: "/orders/reverse",
        },
    ]

    return (
        <>
            <Suspense fallback={<LoadingComponent/>}>
            <NavigationItem links={DASHBOARD_LINKS}  />
                <Orders />
            </Suspense>
        </>
    );

}