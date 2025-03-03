"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusTable } from "./order-status-table";
import { OrderStatusCol } from "./order-status-col";
import { useSellerProvider } from "../providers/SellerProvider";
import { RevOrderFilter } from "../navigation/navigation-item";
import { useEffect, useState } from "react";
import { B2COrderType } from "@/types/types";
import Link from "next/link";
import { BoxIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default function ReverseOrders() {

    const DASHBOARD_LINKS = [
        {
            label: "All",
        },
        {
            label: "New",
            bucket: 0
        },
        {
            label: "Reverse Pickup Confirmed",
            bucket: 101
        },
        {
            label: "Return In Transit",
            bucket: 102
        },
        {
            label: "Return Cancelled",
            bucket: 103
        },
        {
            label: "Return Delivered",
            bucket: 104
        },
        {
            label: "Return Lost",
            bucket: 105
        },
    ]

    const { reverseOrders } = useSellerProvider()
    const [reverseFilterOrders, setReverseFilterOrders] = useState<B2COrderType[]>(reverseOrders) // Provide the correct initial state

    const handleFilter = (bucket: number | undefined) => {
        if (bucket === undefined) {
            setReverseFilterOrders(reverseOrders);
        } else {
            const filtered = reverseOrders.filter((order) => order.bucket === bucket);
            setReverseFilterOrders(filtered);
        }
    };

    useEffect(() => {
        setReverseFilterOrders(reverseOrders)
    }, [reverseOrders])
    return (
        <>
            <RevOrderFilter links={DASHBOARD_LINKS} handleRevFilter={handleFilter} activeBucket={undefined} />
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle className="md:flex justify-between">
                        <div className="mb-4 sm:mb-0">
                        View Reverse Shipment
                        </div>
                        <Link href="/new/b2c/reverse" className={cn(buttonVariants({
                            variant: "themeNavActiveBtn",
                            size: "sm",
                        }), "gap-1")}>
                            <BoxIcon size={18} /> Create Reverse Shipment
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <OrderStatusTable paginationInfo={{}} columns={OrderStatusCol} data={reverseFilterOrders} />
                </CardContent>
            </Card>
        </>

    )
}
