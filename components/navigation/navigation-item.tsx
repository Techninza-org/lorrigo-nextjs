"use client"

import * as React from "react"
import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function NavigationItem({ links }: { links: { label: string; href: string }[] }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const status = searchParams.get("status");

    const [isMobile, setIsMobile] = React.useState(false);

    const currentValue = status ? `/orders?status=${status}` : pathname;

    const handleChange = (value: string) => {
        window.location.href = value;
    };

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); 
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (isMobile) {
        return (
            <Select value={currentValue} onValueChange={handleChange}>
                <SelectTrigger className="w-full my-4 border rounded-md">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {links.map((link) => (
                        <SelectItem key={link.label} value={link.href}>
                            {link.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {links.map((link, index) => {
                    const isActive = status ? link.href === `/orders?status=${status}` : link.href === pathname;
                    return (
                        <NavigationMenuItem key={link.label}>
                            <Link href={link.href} passHref legacyBehavior>
                                <NavigationMenuLink
                                    className={cn(
                                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900",
                                        isActive ? "text-red-500 font-medium bg-gray-100 shadow-sm" : "",
                                    )}
                                >
                                    {link.label}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export function RevOrderFilter({
    links,
    handleRevFilter,
    activeBucket
}: {
    links: { label: string; bucket?: number }[],
    handleRevFilter: (bucket: number | undefined) => void,
    activeBucket: number | undefined
}) {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); 
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (isMobile) {
        const handleChange = (value: string) => {
            const selectedBucket = links.find(link => link.label === value)?.bucket;
            handleRevFilter(selectedBucket);
        };

        return (
            <Select value={links.find(link => link.bucket === activeBucket)?.label} onValueChange={handleChange}>
                <SelectTrigger className="w-full my-4 border rounded-md">
                    <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                    {links.map((link) => (
                        <SelectItem key={link.label} value={link.label}>
                            {link.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {links.map((link) => {
                    const isActive = link.bucket === activeBucket;

                    return (
                        <NavigationMenuItem key={link.label}>
                            <button onClick={() => handleRevFilter(link.bucket)}>
                                <NavigationMenuLink
                                    className={cn(
                                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900",
                                        isActive ? "text-red-500 font-medium bg-gray-100 shadow-sm" : ""
                                    )}
                                >
                                    {link.label}
                                </NavigationMenuLink>
                            </button>
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

