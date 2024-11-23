import { Billing } from "@/components/finance/billing-page";
import { DisputeBilling } from "@/components/finance/dispute-billing-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Billing Disputes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <DisputeBilling />
            </CardContent>
        </Card>
    );

}