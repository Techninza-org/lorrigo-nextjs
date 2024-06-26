import { ClientBilling } from "@/components/Admin/Finance/client-billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientBillingPage() {
    return (
        <Card>
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