import { ManualDeductionForm } from "@/components/Admin/Finance/manual-wallet-deduction-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManualDeductionPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Manual Wallet Deduction
                </CardTitle>
            </CardHeader>
            <CardContent>

                <ManualDeductionForm />
            </CardContent>
        </Card>
    );
}