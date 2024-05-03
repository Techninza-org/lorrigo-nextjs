'use client'
import { OrderStatusTable } from "@/components/Orders/order-status-table";
import { OrderStatusCol } from "@/components/Remittances/cod-remittances-col";
import { useAuth } from "@/components/providers/AuthProvider";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderType } from "@/types/types";
import axios, { AxiosInstance } from "axios";
import { useEffect, useState } from "react";

export default function SellerOrders({sellerId}: {sellerId: any}) {
    const [order, setOrderDetails] = useState<OrderType[]>();
    const {userToken} = useAuth();
    const axiosConfig = {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
        headers: {
            'Content-Type': 'application/json',
            ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
        },
    };
    const axiosIWAuth: AxiosInstance = axios.create(axiosConfig);

    const getSellerOrders = async () => {
        try {
            const res = await axiosIWAuth.get(`/admin/order/${sellerId}`);
            if (res.data?.valid) {
                setOrderDetails(res.data.order);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if (!userToken) return;
        getSellerOrders() 
        console.log(order);
        
    }, [userToken]);


    return (
        <CardContent className="pl-2">
            <OrderStatusTable columns={OrderStatusCol} data={order || []} />
        </CardContent>
    )
}
