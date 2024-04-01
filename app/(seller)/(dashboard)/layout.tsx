import { DashboardHeader } from "@/components/navigation/Dashboard/dashboard-header";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const DASHBOARD_LINKS = [
        {
            label: "Overview",
            href: "/dashboard"
        },
        {
            label: "Orders",
            href: "/dashboard/orders"
        },
        {
            label: "Shipments",
            href: "/orders"
        },
        {
            label: "RTO",
            href: "/dashboard/rto"
        },
        {
            label: "Courier",
            href: "/dashboard/courier"
        },
        {
            label: "Delay",
            href: "/dashboard/delay"
        },
        {
            label: "Tracking",
            href: "/dashboard/tracking"
        }
    ]
    return (
        <div className="h-full overflow-hidden">
            <DashboardHeader />
            <Suspense fallback={<span>Loading...</span>}>
                <NavigationItem links={DASHBOARD_LINKS} />
            </Suspense>
            {children}
        </div>
    );
}