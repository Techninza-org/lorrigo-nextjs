import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PickupAddresses from "@/components/Settings/pickup-addresses";

export default function ManagePickupAddresses() {

    return (
        <Card className="col-span-4 md:col-span-2 lg:col-span-4">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    Pickup Addresses
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-0 sm:pl-2 md:pl-4 lg:pl-6">
                <PickupAddresses />
            </CardContent>
        </Card>

    )
}
