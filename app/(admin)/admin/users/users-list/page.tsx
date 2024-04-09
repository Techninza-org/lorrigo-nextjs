import { AdminUsersListingCols } from "@/components/Admin/User/users-listing-cols";
import { UsersListingTable } from "@/components/Admin/User/users-listing-table";
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
                <UsersListingTable data={[]} columns={AdminUsersListingCols} />
            </CardContent>
        </Card>
    )
}