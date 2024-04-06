"use client";

import { Nav } from "./nav";
import { HandCoins, Home, Settings, ShoppingCart, TrendingUpIcon } from "lucide-react";
import { TopNav } from "./top-nav";
import { useState } from "react";
import { cn } from "@/lib/utils";


export function NavigationBar({ children }: { children: React.ReactNode }) {
    const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(true)
    const handleMouseEnter = () => {
        setIsNavCollapsed(false); // Expand when mouse enters
    };

    const handleMouseLeave = () => {
        setIsNavCollapsed(true);
    };


    return (
        <div className="w-full z-50">
            <div className="fixed shadow-md w-full backdrop-blur-sm z-50">
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
                    links={[
                        {
                            title: "Home",
                            icon: Home,
                            href: "/dashboard",
                        },
                        {
                            title: "Dashboard Orders",
                            icon: TrendingUpIcon,
                            href: "/dashboard/orders",
                        },
                        {
                            title: "Your Orders",
                            icon: ShoppingCart,
                            href: "/orders",
                        },
                        {
                            title: "Settings",
                            icon: Settings,
                            href: "/settings",
                        },
                        {
                            title: "Finance",
                            icon: HandCoins,
                        },
                    ]}
                />
            </div>
            <div
                className={cn(
                    "container transition-all duration-300 ease-in-out pt-20 space-y-3",
                    isNavCollapsed ? "pl-14" : "pl-64"
                )}
            >
                {children}
            </div>
        </div>
    );
}