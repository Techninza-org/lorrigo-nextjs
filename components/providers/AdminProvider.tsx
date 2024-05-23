"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useSellerProvider } from "./SellerProvider";
import { AdminType, B2COrderType, RemittanceType, SellerType } from "@/types/types";
import { useAxios } from "./AxiosProvider";
import { ShippingRate } from "@/types/AdminTypes";

interface AdminContextType {
    users: SellerType[];
    allRemittance: RemittanceType[] | null;
    shippingOrders: B2COrderType[];
    allCouriers: ShippingRate[];
    handleCreateHub: (hub: AdminType) => void;
    handleSignup: (credentials: any, user: any) => void;
    handleEditUser: (sellerId: string, user: any) => void;

}

const AdminContext = createContext<AdminContextType | null>(null);

export default function AdminProvider({ children }: { children: React.ReactNode }) {
    const { getHub } = useSellerProvider()
    const { userToken, user } = useAuth();
    const { axiosIWAuth } = useAxios();

    const [users, setUsers] = useState([]);
    const [shippingOrders, setOrders] = useState<B2COrderType[]>([]);
    const [allRemittance, setAllRemittance] = useState<RemittanceType[] | null>(null);
    const [allCouriers, setAllCouriers] = useState<ShippingRate[]>([]);

    const { toast } = useToast();
    const router = useRouter()


    const handleCreateHub = useCallback(async (hub: AdminType) => {
        try {
            const res = await axiosIWAuth.post('/hub', hub);
            toast({
                variant: "default",
                title: "Hub created successfully",
                description: "Hub has been created successfully",
            });

            getHub()
            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "error.response.data.message",
            });

        }
    }, [userToken, axiosIWAuth, getHub, router, toast])

    const getAllSellers = async () => {
        try {
            const res = await axiosIWAuth.get('/getSellers');
            setUsers(res.data.sellers);
        } catch (error) {
            console.log('Error fetching sellers: ', error);
        }
    };

    const getAllRemittance = async () => {
        try {
            const res = await axiosIWAuth.get('/admin/all-remittances');

            if (res.data?.valid) {
                setAllRemittance(res.data.remittanceOrders);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSignup = async (credentials: any, user: any) => {
        try {
            const response = await axiosIWAuth.post('/auth/signup', credentials);
            if (response.data.user) {
                const sellerId = response.data.user.id;
                const res = await axiosIWAuth.put(`/admin/seller?sellerId=${sellerId}`, user);
                if (res.data.seller) {
                    return toast({
                        variant: "default",
                        title: "Signup Success",
                        description: "User has been created successfully.",
                    });
                }
            } else if (response.data.message === "user already exists") {
                return toast({
                    variant: "destructive",
                    title: "Signup Error",
                    description: "User already exists.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "error.response.data.message",
            });
        }
    }

    const handleEditUser = async (sellerId: string, user: any) => {
        try {
            const res = await axiosIWAuth.put(`/admin/seller?sellerId=${sellerId}`, user);
            if (res.data.seller) {
                return toast({
                    variant: "default",
                    title: "User updated",
                    description: "User has been updated successfully.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "error.response.data.message",
            });
        }

    }

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

    const getAllCouriers = async () => {
        try {
            // TODO: endpoint to /admin/all-couriers
            const res = await axiosIWAuth.get('/admin/all-couriers');
            return res.data.couriers
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if ((!!user || !!userToken) && user?.role === "admin") {
            getAllOrders("all")
            getAllSellers();
            getAllRemittance();
        }
    }, [user, userToken])
    return (
        <AdminContext.Provider
            value={{
                users,
                allRemittance,
                shippingOrders,
                allCouriers,
                handleCreateHub,
                handleSignup,
                handleEditUser
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}


export function useAdminProvider() {
    const context = useContext(AdminContext);
    if (context == undefined) {
        throw new Error("component and page must be inside the provider");
    }
    return context;
}
