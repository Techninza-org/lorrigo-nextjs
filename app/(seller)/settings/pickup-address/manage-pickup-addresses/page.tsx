import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PickupAddresses from "@/components/Settings/pickup-addresses";
import Image from "next/image";

export default function ManagePickupAddresses() {

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Pickup Addresses
                    {/* <Image src={`data:image/png;base64,${Base64Data}`} alt="Add" width={400} height={400} /> */}
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
// data:image/png;base64,
