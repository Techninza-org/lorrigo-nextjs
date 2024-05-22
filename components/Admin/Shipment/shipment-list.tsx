'use client'
import { AdminShipmentListingCol } from "@/components/Admin/Shipment/shipment-listing-col";
import { ShipmentListingTable } from "@/components/Admin/Shipment/shipment-listing-table";
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ShipmentList = () => {

    const { shippingOrders } = useAdminProvider()
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Shipment Listing
                    <div className="md:flex space-y-3 md:space-y-0 md:space-x-3 mt-6 md:mt-0">
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ShipmentListingTable columns={AdminShipmentListingCol} data={shippingOrders} />
            </CardContent>
        </Card>
    )
}