import InvoiceList from "@/components/finance/InvoiceList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoicePage() {

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Invoice
                </CardTitle>
            </CardHeader>
            <CardContent>
                <InvoiceList />
            </CardContent>
        </Card>
    );

}