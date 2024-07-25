import { Suspense, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingComponent } from "@/components/loading-spinner";
import Remittances from "@/components/Admin/Finance/Remittances";


export default function RemittancesPageAdmin() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    COD Remittances
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<LoadingComponent />}>
                    <Remittances />
                </Suspense>
            </CardContent>
        </Card>
    );

}