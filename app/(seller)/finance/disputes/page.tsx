import { Disputes } from "@/components/finance/disputes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DisputesPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Disputes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Disputes />
            </CardContent>
        </Card>
    )
}