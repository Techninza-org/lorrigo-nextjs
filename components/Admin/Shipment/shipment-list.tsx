'use client'
import { AdminShipmentListingCol } from "@/components/Admin/Shipment/shipment-listing-col";
import { ShipmentListingTable } from "@/components/Admin/Shipment/shipment-listing-table";
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ShipmentList = () => {

    const { shippingOrders } = useAdminProvider()
    return (
        <Card>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Shipment Listing
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ShipmentListingTable columns={AdminShipmentListingCol} data={shippingOrders} />
            </CardContent>
        </Card>
    )
}