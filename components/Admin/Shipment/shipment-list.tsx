'use client'
import { AdminShipmentListingCol } from "@/components/Admin/Shipment/shipment-listing-col";
import { ShipmentListingTable } from "@/components/Admin/Shipment/shipment-listing-table";
import { B2BOrderStatusCol } from "@/components/Orders/b2b/b2b-order-status-col";
import { B2BOrderStatusTable } from "@/components/Orders/b2b/b2b-order-status-table";
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const ShipmentList = () => {

    const { shippingOrders, shippingB2BOrders } = useAdminProvider()
    const [orderCategory, setOrderCategory] = useState("d2c")
    return (
        <Card>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Shipment Listing
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Select onValueChange={(value) => setOrderCategory(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={orderCategory.toUpperCase()} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="d2c">D2C</SelectItem>
                            <SelectItem value="b2b">B2B</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <ShipmentListingTable
                    columns={AdminShipmentListingCol}
                    data={orderCategory === "d2c" ? shippingOrders : shippingB2BOrders}
                />
            </CardContent>
        </Card>
    )
}