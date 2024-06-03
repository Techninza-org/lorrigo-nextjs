"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSellerProvider } from "../../providers/SellerProvider";
import { B2BOrderStatusTable } from "./b2b-order-status-table";
import { B2BOrderStatusCol } from "./b2b-order-status-col";

export default function B2BOrders() {

    const { b2bOrders } = useSellerProvider()

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    View B2B Shipment
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <B2BOrderStatusTable columns={B2BOrderStatusCol} data={b2bOrders} />
            </CardContent>
        </Card>
    )
}
