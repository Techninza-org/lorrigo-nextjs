'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderStatusTable } from '@/components/Orders/order-status-table';
import { useAuth } from '@/components/providers/AuthProvider';
import axios, { AxiosInstance } from 'axios';
import { OrderType } from '@/types/types';
import { OrderStatusColAdmin } from '@/components/Orders/order-status-col-admin';

const SellerOrdersAdmin = () => {
    const [orders, setOrderDetails] = useState<OrderType[]>([]);
    const searchParams = useSearchParams();
    const sellerId = searchParams.get('sellerId');
    const { userToken } = useAuth();
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
            const res = await axiosIWAuth.get(`/admin/orders/seller/${sellerId}`);
            
            if (res.data?.valid) {
                setOrderDetails(res.data.orders);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if (!userToken) return;
        getSellerOrders() 
        
    }, [userToken]);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Shipments
                </CardTitle>
                <CardContent className="pl-2">
                    <OrderStatusTable paginationInfo={{}} columns={OrderStatusColAdmin} data={orders} />
                </CardContent>
            </CardHeader>
        </Card>
    )
}

export default SellerOrdersAdmin;