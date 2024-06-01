"use client"

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import SearchBar from "@/components/search-bar";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useSellerProvider } from "@/components/providers/SellerProvider";
import { LucideBox, LucideTruck } from "lucide-react";
import { getBucketStatus } from "@/components/Orders/order-action-button";
import { formatPhoneNumberIntl } from "react-phone-number-input";

export const DashboardHeader = () => {
    const { handlebusinessDropdown, orders, sellerFacilities } = useSellerProvider()

    const ordersSearchData = orders.map((order) => {
        return {
            icon: <LucideBox size={18} />,
            name: order.order_reference_id || "",
            id: order._id || "",
            subBadgeText: order.awb || "",
            badgeInfo: {
                variant: getBucketStatus(order?.bucket || 0) === "Cancelled" ? "failure" : "success",
                text: getBucketStatus(order?.bucket || 0)
            }
        }
    })

    const ordersAWBData = orders
        .filter(order => order.awb)
        .map(order => ({
            icon: <LucideBox size={18} />,
            name: order.awb || "",
            id: order.awb || "",
            subBadgeText: order.order_reference_id || "",
            badgeInfo: {
                variant: getBucketStatus(order?.bucket || 0) === "Cancelled" ? "failure" : "success",
                text: getBucketStatus(order?.bucket || 0)
            }
        }));

    const ordersHubData = sellerFacilities.map((hub) => {
        return {
            icon: <LucideTruck size={18} />,
            name: hub.name || "",
            id: hub.name || "",
            subBadgeText: formatPhoneNumberIntl(`+${hub.phone}`) || "",
            badgeInfo: {
                variant: "secondary",
                text: hub.address1.slice(0, 20) + "..." || ""

            }
        }
    })

    return (
        <div className="flex justify-between items-center space-x-6 py-6">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Dashboard
            </h2>
            <Select onValueChange={handlebusinessDropdown}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="D2C" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="D2C">D2C</SelectItem>
                    <SelectItem disabled={true} value="B2B">B2B</SelectItem>
                </SelectContent>
            </Select>
            <SearchBar
                data={[
                    {
                        label: "Hub",
                        type: "hub",
                        data: ordersHubData
                    },
                    {
                        label: "Orders",
                        type: "order",
                        data: ordersSearchData
                    },
                    {
                        label: "AWB",
                        type: "order",
                        data: ordersAWBData
                    },
                ]}
            />

            <Link href="/new/b2c" className={buttonVariants({
                variant: "themeButton"
            })}>Create Forward Shipment</Link>

            <Link href="/new/b2c/reverse" className={buttonVariants({
                variant: "themeButton"
            })}>Create Reverse Shipment</Link>

        </div>
    );
}