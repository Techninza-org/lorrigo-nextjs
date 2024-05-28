"use client";

import { Nav } from "./nav";
import { HandCoins, HandIcon, Home, MapPin, Settings, ShoppingCart, TrendingUpIcon, Truck, User, LucideSettings } from "lucide-react";
import { TopNav } from "./top-nav";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";


export function NavigationBar({ children }: { children: React.ReactNode }) {
    const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(true)
    const handleMouseEnter = () => {
        setIsNavCollapsed(false);
    };

    const handleMouseLeave = () => {
        setIsNavCollapsed(true);
    };

    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    const SELLER_NAV_LINKS = [
        {
            title: "Home",
            icon: Home,
            href: "/dashboard",
        },
        {
            title: "Your Orders",
            icon: ShoppingCart,
            href: "/orders",
        },
        {
            title: "Finance",
            icon: HandCoins,
            subLinks: [
                {
                    title: "Remittances",
                    href: "/finance/remittances",
                },
                {
                    title: "Billing",
                    href: "/finance/billing",
                },
            ],
        },
        {
            title: "Settings",
            icon: LucideSettings,
            href: "/settings",
        },
    ];

    const ADMIN_NAV_LINKS = [
        {
            title: "Shipment Listing",
            icon: Truck,
            href: "/admin/shipment-listing",
        },
        {
            title: "Finance",
            icon: HandCoins,
            subLinks: [
                {
                    title: "Remittances",
                    href: "/admin/finance/remittance",
                },
                {
                    title: "Vendor Billing",
                    href: "/admin/finance/vendor-billing",  
                },
                {
                    title: "Client Billing",
                    href: "/admin/finance/client-billing",  
                },
            ]
        },
        {
            title: "Upload Pincodes",
            icon: MapPin,
            href: "/admin/pincodes/upload-pincodes",
        },
        {
            title: "Users",
            icon: User,
            subLinks: [
                {
                    title: "Users List",
                    href: "/admin/users/users-list",
                },
                {
                    title: "Add User",
                    href: "/admin/users/add-user",
                }
            ]
        },

    ];

    const navLinks = isAdmin ? ADMIN_NAV_LINKS : SELLER_NAV_LINKS;

    return (
        <div className="w-full z-50">
            <div className="fixed shadow-md w-full bg-white z-50">
                <TopNav />
            </div>
            <div
                className={cn("z-10 fixed top-16 mt-2 shadow-md h-full flex flex-col transition-all duration-300 ease-in-out bg-gray-800 items-center text-white",
                    isNavCollapsed ? 'w-16' : ' w-64'
                )}
                onClick={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Nav
                    isCollapsed={isNavCollapsed}
                    links={navLinks}
                />
            </div>
            <div
                className={cn(
                    "container max-w-screen-2xl transition-all duration-300 ease-in-out pt-20 space-y-3",
                    isNavCollapsed ? "pl-24" : "pl-72"
                )}
            >
                {children}
            </div>
        </div>
    );
}