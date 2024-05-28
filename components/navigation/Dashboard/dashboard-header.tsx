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
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useSellerProvider } from "@/components/providers/SellerProvider";

export const DashboardHeader = () => {
    const { handlebusinessDropdown, business } = useSellerProvider()
    return (
        <div className="flex justify-between space-x-6 py-6">
            <div className="flex  gap-3">
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
            </div>
            {/* <SearchBar
                data={[
                    {
                        label: "Orders",
                        type: "channel",
                        data: [{ icon: null, name: "", id: "" }]
                    },
                    {
                        label: "Hub",
                        type: "channel",
                        data: [{ icon: null, name: "", id: "" }]
                    },
                    {
                        label: "AWB",
                        type: "channel",
                        data: [{ icon: null, name: "", id: "" }]
                    },
                ]}
            /> */}

            <div className="space-x-3">
                <Link href="/new/b2c" className={buttonVariants({
                    variant: "themeButton"
                })}>Create Forward Shipment</Link>

                <Link href="/new/b2c/reverse" className={buttonVariants({
                    variant: "themeButton"
                })}>Create Reverse Shipment</Link>

            </div>

        </div>
    );
}