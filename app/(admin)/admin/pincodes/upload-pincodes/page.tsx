import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadPincodes from "@/components/Admin/Pincode/upload-pincode-sheet";

export default function UploadPincodesBulk() {
    return (
        <>
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Upload Pincode Sheet
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 mt-6">
                <UploadPincodes />
            </CardContent>
        </>
    )
}