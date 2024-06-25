import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorBilling } from "@/components/Admin/Finance/vendor-billing";


export default function VendorBillingPage() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                  Vendor Billing
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <VendorBilling />
            </CardContent>
        </Card>
    )
}