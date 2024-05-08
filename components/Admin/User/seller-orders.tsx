'use client'
import { OrderStatusTable } from "@/components/Orders/order-status-table";
import { OrderStatusCol } from "@/components/Remittances/cod-remittances-col";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAxios } from "@/components/providers/AxiosProvider";
import { CardContent } from "@/components/ui/card";
import { OrderType } from "@/types/types";
import axios, { AxiosInstance } from "axios";
import { useEffect, useState } from "react";

export default function SellerOrders({sellerId}: {sellerId: any}) {
    const [order, setOrderDetails] = useState<OrderType[]>();
    const {axiosIWAuth} = useAxios();
    const {userToken} = useAuth();
  
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
