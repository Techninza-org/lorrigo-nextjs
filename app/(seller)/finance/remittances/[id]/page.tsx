import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotebookText } from "lucide-react";
import TrackRemittance from "@/components/Remittances/track-remittance";
import { LoadingComponent } from "@/components/loading-spinner";

export default function RemittancePage({ params }: { params: { id: string } }) {

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="space-y-6">
                    <span className="text-base text-gray-600">Transaction Details</span>
                    <div className="md:flex  space-y-3 md:space-y-0 md:space-x-3 mt-6 md:mt-0">
                        <NotebookText />
                        <span className="text-sm sm:text-md">{params.id}</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <Suspense fallback={<LoadingComponent/>}>
                    <TrackRemittance />
                </Suspense>

            </CardContent>
        </Card>
    )
}