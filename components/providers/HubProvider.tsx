"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosInstance } from "axios";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useSellerProvider } from "./SellerProvider";
import { SettingType } from "@/types/types";
import { get } from "http";
import { set } from "date-fns";

// interface reqPayload {
//     name: string;
//     email?: string;
//     pincode: string;
//     address1: string;
//     address2: string;
//     phone: string;
//     city: string;
//     state: string;
// }                                 //added all these to SettingType .../components/modal/add-pickup-location.tsx

interface HubContextType {
    handleCreateHub: (hub: SettingType) => void;
    updateCompanyProfile: (formData: FormData) => void;
}

const HubContext = createContext<HubContextType | null>(null);

function HubProvider({ children }: { children: React.ReactNode }) {
    
    const {getHub} = useSellerProvider()
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

    const handleCreateHub = useCallback(async (hub: SettingType) => {
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
    }, [userToken,axiosIWAuth, getHub, router, toast])


    const updateCompanyProfile = async (formData: FormData) => {
        try {
            const companyName = formData.get("companyName")?.toString() || "";
            const email = formData.get("email")?.toString() || "";
            const website = formData.get("website")?.toString() || "";

            if (!email.includes("@")) {
                return toast({
                    variant: "destructive",
                    title: "Invalid email.",
                });
            }

            const companyProfileData = {
                companyName,
                email,
                website,
            }

            const userRes = await axiosIWAuth.put("/seller", companyProfileData);
            if(userRes){
                toast({
                    title: "Success",
                    description: "Company Profile updated successfully.",
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

    return (
        <HubContext.Provider
            value={{
                handleCreateHub,
                updateCompanyProfile,
                  
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
