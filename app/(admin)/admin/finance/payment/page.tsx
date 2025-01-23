import InvoiceList from "@/components/finance/InvoiceList";
import NEFTPaymentForm from "@/components/Admin/Finance/neft-payment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoicePaymentPage() {

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Invoice Payment
                </CardTitle>
            </CardHeader>
            <CardContent>
                <NEFTPaymentForm />
            </CardContent>
        </Card>
    );

}