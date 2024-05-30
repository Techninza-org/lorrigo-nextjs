"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusTable } from "./order-status-table";
import { OrderStatusCol } from "./order-status-col";
import { useSellerProvider } from "../providers/SellerProvider";

export default function Orders() {
    const { orders } = useSellerProvider()

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    View Shipment
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <OrderStatusTable columns={OrderStatusCol} data={orders} />
            </CardContent>
        </Card>
    )
}
