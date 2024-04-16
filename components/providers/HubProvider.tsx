"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosInstance } from "axios";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useSellerProvider } from "./SellerProvider";

interface reqPayload {
    name: string;
    email?: string;
    pincode: string;
    address1: string;
    address2: string;
    phone: string;
    city: string;
    state: string;
}

interface HubContextType {
    handleCreateHub: (hub: reqPayload) => void;
}

const HubContext = createContext<HubContextType | null>(null);

function HubProvider({ children }: { children: React.ReactNode }) {
    const { getHub } = useSellerProvider()
    const { userToken } = useAuth();

    const { toast } = useToast();
    const router = useRouter()

    const axiosConfig = {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000/api',
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
        },
    };

    const axiosIWAuth: AxiosInstance = axios.create(axiosConfig);

    const handleCreateHub = useCallback(async (hub: reqPayload) => {
        try {
            const res = await axiosIWAuth.post('/hub', hub);


            if (res.data.valid) {
                getHub()
                toast({
                    variant: "default",
                    title: "Hub created successfully",
                    description: "Hub has been created successfully",
                });
                router.refresh()
            }else{
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Something went wrong. Please try again later.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again later.",
            });

        }
    }, [userToken, axiosIWAuth, getHub, router, toast])

    return (
        <HubContext.Provider
            value={{
                handleCreateHub,
            }}
        >
            {children}
        </HubContext.Provider>
    );
}

export default HubProvider;

export function useHubProvider() {
    const context = useContext(HubContext);
    if (context == undefined) {
        throw new Error("component and page must be inside the provider");
    }
    return context;
}
