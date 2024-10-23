import Listing from "@/components/Admin/Sub/Listing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubadminsList() {
    
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                   Sub-Admins 
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <Listing />
            </CardContent>
        </Card>
    )
}