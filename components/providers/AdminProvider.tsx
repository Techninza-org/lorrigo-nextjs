"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useSellerProvider } from "./SellerProvider";
import { AdminType, B2COrderType, RemittanceType, SellerType } from "@/types/types";
import { useAxios } from "./AxiosProvider";
import { ShippingRate } from "@/types/AdminTypes";
import { CourierPriceConfigureSchema } from "../Admin/User/user-courier-configure";
import { z } from "zod";

interface AdminContextType {
    users: SellerType[];
    allRemittance: RemittanceType[] | null;
    shippingOrders: B2COrderType[];
    allCouriers: ShippingRate[];
    assignedCouriers: ShippingRate[];
    futureRemittance: RemittanceType[] | null;
    handleCreateHub: (hub: AdminType) => void;
    handleSignup: (credentials: any, user: any) => void;
    handleEditUser: (sellerId: string, user: any) => void;

    updateSellerCourierPrice: ({ value, sellerId }: { value: z.infer<typeof CourierPriceConfigureSchema>, sellerId: string }) => void;
    getSellerAssignedCouriers: () => void;
    upateSellerAssignedCouriers: ({ couriers }: { couriers: string[] }) => void;
    getSellerRemittanceID: (sellerId: string, remittanceId: string) => Promise<RemittanceType> | null;
    clientBills: any;


}

const AdminContext = createContext<AdminContextType | null>(null);

export default function AdminProvider({ children }: { children: React.ReactNode }) {
    const { getHub } = useSellerProvider()
    const { userToken, user } = useAuth();
    const { axiosIWAuth } = useAxios();

    const [users, setUsers] = useState([]);
    const [shippingOrders, setOrders] = useState<B2COrderType[]>([]);
    const [allRemittance, setAllRemittance] = useState<RemittanceType[] | null>(null);
    const [futureRemittance, setFutureRemittance] = useState<RemittanceType[] | null>(null);
    const [allCouriers, setAllCouriers] = useState<ShippingRate[]>([]);
    const [assignedCouriers, setAssignedCouriers] = useState<ShippingRate[]>([]);
    const [clientBills, setClientBills] = useState<any>([]);

    const { toast } = useToast();
    const router = useRouter()
    const searchParams = useSearchParams()
    const sellerId = searchParams.get('sellerId')


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

    const getFutureRemittance = async () => {
        try {
            const res = await axiosIWAuth.get('/admin/remittances/future');

            if (res.data?.valid) {
                setFutureRemittance(res.data.remittanceOrders);
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
            const res = await axiosIWAuth.get('/admin/couriers');
            setAllCouriers(res.data.couriers)
            return res.data.couriers

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getSellerAssignedCouriers = async () => {
        try {
            const res = await axiosIWAuth.get(`/admin/seller-couriers?sellerId=${sellerId}`);
            setAssignedCouriers(res.data.couriers)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const updateSellerCourierPrice = async ({ value, sellerId }: { value: z.infer<typeof CourierPriceConfigureSchema>, sellerId: string }) => {
        try {
            const res = await axiosIWAuth.post(`/admin/update-seller-courier`, {
                ...value,
                sellerId
            });
            if (res.data?.valid) {
                toast({
                    variant: "default",
                    title: "Courier Price Updated",
                    description: "Courier price has been updated successfully.",
                });
            }


        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response.data.message
            });
            console.error('Error fetching data:', error);
        }
    }

    const upateSellerAssignedCouriers = async ({ couriers }: { couriers: string[] }) => {
        try {
            const res = await axiosIWAuth.post(`/admin/manage-seller-couriers`, {
                couriers,
                sellerId
            });
            if (res.data?.valid) {
                toast({
                    variant: "default",
                    title: "Courier Price Updated",
                    description: "Courier price has been updated successfully.",
                });
            }
        }
        catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response.data.message
            });
            console.error('Error fetching data:', error);
        }
    }

    const getSellerRemittanceID = async (sellerId: string, remittanceId: string) => {
        try {
            const res = await axiosIWAuth.get(`/admin/seller-remittance?sellerId=${sellerId}&remittanceId=${remittanceId}`);
            console.log(res.data)
            if (res.data?.valid) {
                return res.data.remittance;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getClientBillingData = async () => {
        try {
            const res = await axiosIWAuth.get('/admin/billing/client');
            setClientBills(res.data.data)
            return res.data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if ((!!user || !!userToken) && user?.role === "admin") {
            getAllOrders("all")
            getAllSellers();
            getAllRemittance();

            getAllCouriers(),
                getSellerAssignedCouriers(),
                getFutureRemittance()
            getClientBillingData();
        }
    }, [user, userToken])

    useEffect(() => {
        if ((!!user || !!userToken) && user?.role === "admin" && sellerId) {
            getSellerAssignedCouriers()
        }
    }, [user, userToken, sellerId])

    return (
        <AdminContext.Provider
            value={{
                users,
                allRemittance,
                futureRemittance,
                shippingOrders,
                allCouriers,
                assignedCouriers,
                handleCreateHub,
                handleSignup,
                handleEditUser,

                updateSellerCourierPrice,
                getSellerAssignedCouriers,
                getSellerRemittanceID,
                upateSellerAssignedCouriers,
                clientBills
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
