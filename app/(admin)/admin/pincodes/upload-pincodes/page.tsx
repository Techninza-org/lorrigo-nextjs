import UploadPincodeSheet from "@/components/Admin/Pincode/upload-pincode-sheet-form";
import AdminProvider from "@/components/providers/AdminProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadPincodes() {
    return (
        <Card className="col-span-4  mt-6">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Upload Pincode Sheet
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 mt-6">
                <AdminProvider>
                    <UploadPincodeSheet />
                </AdminProvider>
            </CardContent>
        </Card>
    )
}