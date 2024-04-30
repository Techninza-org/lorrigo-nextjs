import UsersList from "@/components/Admin/User/UsersList";
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersListing() {
    
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                   Users Listing
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <UsersList />
            </CardContent>
        </Card>
    )
}