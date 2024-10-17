"use client";

import { Nav } from "./nav";
import { HandCoins, HandIcon, Home, MapPin, Settings, ShoppingCart, TrendingUpIcon, Truck, User, LucideSettings, Wallet } from "lucide-react";
import { TopNav } from "./top-nav";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSellerProvider } from "../providers/SellerProvider";


export function NavigationBar({ children }: { children: React.ReactNode }) {
    const { seller } = useSellerProvider()
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
            title: "Orders",
            icon: ShoppingCart,
            subLinks: [
                {
                    title: "Forward Orders",
                    href: "/orders",
                    isDisabled: !seller?.config?.isD2C
                },
                {
                    title: "Reverse Orders",
                    href: "/orders/reverse",
                },
                {
                    title: "B2B Orders",
                    href: "/orders/b2b",
                    isDisabled: !seller?.config?.isB2B
                },
            ],
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
                {
                    title: "Invoice",
                    href: "/finance/invoice",
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
                {
                    title: "Manual Wallet Deduction",
                    href: "/admin/finance/manual-deduction",
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
        {
            title: "Wallet transactions",
            icon: Wallet,
            href: "/admin/users/wallet-txn",
        },
    ];

    const navLinks = isAdmin ? ADMIN_NAV_LINKS : SELLER_NAV_LINKS;

    return (
        <div className="w-full z-50">
            <div className="fixed shadow-md w-full bg-white z-50">
                <TopNav />
            </div>

            <div
                className={cn(
                    "z-50 fixed top-16 mt-2 shadow-md h-full flex flex-col transition-all duration-300 ease-in-out bg-gray-800 items-center text-white",
                    isNavCollapsed ? 'w-16' : ' w-64'
                )}
                onClick={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Nav isCollapsed={isNavCollapsed} links={navLinks} />
            </div>

            <div
                className={cn(
                    "container max-w-screen-2xl transition-all duration-300 ease-in-out pt-20 space-y-3",
                    "pl-20 sm:pl-24"
                )}
            >
                {children}
            </div>
        </div>

    );
}