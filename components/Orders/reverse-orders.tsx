"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusTable } from "./order-status-table";
import { OrderStatusCol } from "./order-status-col";
import { useSellerProvider } from "../providers/SellerProvider";
import { RevOrderFilter } from "../navigation/navigation-item";
import { useEffect, useState } from "react";
import { B2COrderType } from "@/types/types";

export default function ReverseOrders() {

    const DASHBOARD_LINKS = [
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
        const filtered = reverseOrders.filter((order) => order.bucket === bucket)
        setReverseFilterOrders(filtered)
    }

    useEffect(() => {
        setReverseFilterOrders(reverseOrders)
    }, [reverseOrders])
    return (
        <>
            <RevOrderFilter links={DASHBOARD_LINKS} handleRevFilter={handleFilter} />
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle className="md:flex justify-between space-y-3">
                        View Reverse Shipment
                    </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <OrderStatusTable columns={OrderStatusCol} data={reverseFilterOrders} />
                </CardContent>
            </Card>
        </>

    )
}
