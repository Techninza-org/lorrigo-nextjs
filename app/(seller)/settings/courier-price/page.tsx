import { ClientRateCard } from "@/components/Courires/client-courires-pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CourierPricePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Courier Pricing</CardTitle>
            </CardHeader>
            <CardContent>
                <ClientRateCard isDisabled={true} />
            </CardContent>
        </Card>
    );
}