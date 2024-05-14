'use client'
import { AdminShipmentListingCol } from "@/components/Admin/Shipment/shipment-listing-col";
import { ShipmentListingTable } from "@/components/Admin/Shipment/shipment-listing-table";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios, { AxiosInstance } from "axios";
import { useEffect, useState } from "react";

export const ShipmentList = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const { userToken } = useAuth();
    const axiosConfig = {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
        headers: {
            'Content-Type': 'application/json',
            ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
        },
    };
    const axiosIWAuth: AxiosInstance = axios.create(axiosConfig);
    const getAllOrders = async (status: string) => {
        let url = status === "all" ? `/admin/all-orders` : `/admin/?status=${status}`
        try {
            const res = await axiosIWAuth.get(url);
            if (res.data?.valid) {
                setOrders(res.data.response.orders);
                return res.data.response.orders
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(() => {
        if (!userToken) return;
        getAllOrders("all")
    }, [userToken]);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Shipment Listing
                    <div className="md:flex space-y-3 md:space-y-0 md:space-x-3 mt-6 md:mt-0">
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ShipmentListingTable columns={AdminShipmentListingCol} data={orders} />
            </CardContent>
        </Card>
    )
}