import { AdminPincodeServiceCol } from "@/components/Admin/Pincode/pincode-service-col";
import { PincodeServiceTable } from "@/components/Admin/Pincode/pincode-service-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckPincodeService() {
    return (
        <Card className="col-span-4 mt-10">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                   Check Pincode Service
                    <div className="md:flex space-y-3 md:space-y-0 md:space-x-3 mt-6 md:mt-0">
                        </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <PincodeServiceTable data={[]} columns={AdminPincodeServiceCol} />
            </CardContent>
        </Card>
    )
}