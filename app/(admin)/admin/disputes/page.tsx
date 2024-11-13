import AdminDisputeTable from "@/components/Admin/Dispute/AdminDispute-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientBillingPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Disputes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AdminDisputeTable />
            </CardContent>
        </Card>
    )
}