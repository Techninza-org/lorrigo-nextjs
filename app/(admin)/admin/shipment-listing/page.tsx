import { AdminShipmentListingCol } from "@/components/Admin/Shipment/shipment-listing-col";
import { ShipmentListingTable } from "@/components/Admin/Shipment/shipment-listing-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShipmentListingPage() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                   Shipement Listing
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ShipmentListingTable columns={AdminShipmentListingCol} data={[]} />
            </CardContent>
        </Card>
    )
}