import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditUserForm from "@/components/Admin/User/edit-user-form";

const EditUser = () => {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Edit User
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 mt-6">
                <EditUserForm />
            </CardContent>
        </Card>
    )
}

export default EditUser;