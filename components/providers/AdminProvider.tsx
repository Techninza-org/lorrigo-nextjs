"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useSellerProvider } from "./SellerProvider";
import { AdminType, RemittanceType, SellerType } from "@/types/types";
import { useAxios } from "./AxiosProvider";

interface AdminContextType {
    handleCreateHub: (hub: AdminType) => void;
    users: SellerType[];
    allRemittance: RemittanceType[] | null;

}

const AdminContext = createContext<AdminContextType | null>(null);

export default function AdminProvider({ children }: { children: React.ReactNode }) {
    const { getHub } = useSellerProvider()
    const { userToken, user } = useAuth();
    const { axiosIWAuth } = useAxios();
    
    const [users, setUsers] = useState([]);
    const [allRemittance, setAllRemittance] = useState<RemittanceType[] | null>(null);

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

    useEffect(() => {
        if (!userToken) return;
        getAllSellers();
        getAllRemittance();
    }, [userToken]);

    return (
        <AdminContext.Provider
            value={{
                handleCreateHub,
                users,
                allRemittance
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
