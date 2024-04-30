import { AdminVendorBillingCols } from "@/components/Admin/Finance/vendor-billing-cols";
import { VendorBillngTable } from "@/components/Admin/Finance/vendor-billing-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VendorBilling() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                  Vendor Billing
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <VendorBillngTable data={[]} columns={AdminVendorBillingCols} />
            </CardContent>
        </Card>
    )
}