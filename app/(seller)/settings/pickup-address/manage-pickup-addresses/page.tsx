import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PickupAddresses from "@/components/Settings/pickup-addresses";

export default function ManagePickupAddresses() {

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Pickup Addresses
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <PickupAddresses />
            </CardContent>
        </Card>
    )
}
