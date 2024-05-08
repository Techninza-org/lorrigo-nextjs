import AddUserForm from "@/components/Admin/User/add-user-form";
import AdminProvider from "@/components/providers/AdminProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersListing() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                   Add User
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 mt-6">
                <AdminProvider>
                    <AddUserForm />
                </AdminProvider>
            </CardContent>
        </Card>
    )
}