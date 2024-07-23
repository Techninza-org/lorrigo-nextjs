import AdminInvoiceList from "@/components/Admin/User/AdminInvoice";
import InvoiceList from "@/components/Admin/User/InvoiceList";
import Invoice from "@/components/finance/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function InvoicePage() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Invoice
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AdminInvoiceList />
            </CardContent>
        </Card>
    );

}