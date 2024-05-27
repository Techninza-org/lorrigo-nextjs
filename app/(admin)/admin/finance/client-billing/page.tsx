import { ClientBilling } from "@/components/Admin/Finance/client-billing";
import { AdminClientBillingCols } from "@/components/Admin/Finance/client-billing-cols";
import { ClientBillingTable } from "@/components/Admin/Finance/client-billing-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VendorBilling() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Client Billing
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ClientBilling />
            </CardContent>
        </Card>
    )
}