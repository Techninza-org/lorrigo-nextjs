'use client'
import UsersList from "@/components/Admin/User/UsersList";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAxios } from "@/components/providers/AxiosProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function UsersListing() {
    const [loading, setLoading] = useState(false);
    const {axiosIWAuth} = useAxios();
    const {userToken} = useAuth();
    const { toast } = useToast();

    async function handleGenerateInvoices() {
        setLoading(true);
        const res = await axiosIWAuth.get(`/admin/generate-invoice`);
        if (res.data?.valid) {
            setLoading(false);
            toast({
                variant: "default",
                title: "Invoices Generated Successfully",
              });
        }else{
            setLoading(false);
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
                    {loading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>}
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