'use client'
import UsersList from "@/components/Admin/User/UsersList";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAxios } from "@/components/providers/AxiosProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function UsersListing() {
    const {axiosIWAuth} = useAxios();
    const {userToken} = useAuth();
    const { toast } = useToast();

    async function handleGenerateInvoices() {
        const res = await axiosIWAuth.get(`/admin/generate-invoice`);
        if (res.data?.valid) {
            toast({
                variant: "default",
                title: "Invoices Generated Successfully",
              });
        }else{
            toast({
                variant: "destructive",
                title: "Failed to Generate Invoices",
            });
        }
    }
    
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                   Users Listing
                    <Button variant={"themeButton"} onClick={handleGenerateInvoices}>Generate Invoices</Button>
                </CardTitle>
                <div className="flex justify-end">
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <UsersList />
            </CardContent>
        </Card>
    )
}