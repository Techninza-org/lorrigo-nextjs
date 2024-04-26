import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodRemittancePage from "@/components/Remittances/cod-remittances-page";
import { LoadingComponent } from "@/components/loading-spinner";


export default function RemittancesPage() {

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Remittances
                    <div className="md:flex space-y-3 md:space-y-0 md:space-x-3 mt-6 md:mt-0">
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <Suspense fallback={<LoadingComponent/>}>
                    <CodRemittancePage />
                </Suspense>
            </CardContent>
        </Card>
    );

}