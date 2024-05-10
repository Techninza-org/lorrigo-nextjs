import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PickupAddresses from "@/components/Settings/pickup-addresses";

export default function ManagePickupAddresses() {

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Pickup Addresses
                    <div className="md:flex space-y-3 md:space-y-0 md:space-x-3 mt-6 md:mt-0">
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <PickupAddresses />
            </CardContent>
        </Card>
    )
}
