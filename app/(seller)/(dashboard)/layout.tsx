import { LoadingComponent } from "@/components/loading-spinner";
import { DashboardHeader } from "@/components/navigation/Dashboard/dashboard-header";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const DASHBOARD_LINKS = [
        {
            label: "Overview",
            href: "/dashboard"
        },
        // {
        //     label: "Orders",
        //     href: "/dashboard/orders"
        // },
        {
            label: "Shipments",
            href: "/orders"
        },
        {
            label: "RTO",
            href: "/orders?status=rto"
        },
    ]
    return (
        <div className="h-full overflow-hidden">
            <DashboardHeader />
            <Suspense fallback={<LoadingComponent/>}>
                <NavigationItem links={DASHBOARD_LINKS} />
            </Suspense>
            {children}
        </div>
    );
}