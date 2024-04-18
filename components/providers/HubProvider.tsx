"use client";

import React, { createContext, useCallback, useContext} from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosInstance } from "axios";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useSellerProvider } from "./SellerProvider";
import { SellerType } from "@/types/types";
import { BankDetailsSchema } from "../Settings/bank-details";
import { z } from "zod";
import { CompanyProfileSchema } from "../Settings/company-profile-form";

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
    handleCreateHub: (hub: SellerType) => void;
    updateCompanyProfile: (values: z.infer<typeof CompanyProfileSchema>) => void;
    updateBankDetails: (values: z.infer<typeof BankDetailsSchema>) => void;
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

    const handleCreateHub = useCallback(async (hub: SellerType) => {
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


    const updateCompanyProfile = async (values: z.infer<typeof CompanyProfileSchema>) => {
        try {
            const companyName = values?.companyName?.toString() || "";
            const companyEmail = values?.companyEmail?.toString() || "";
            const website = values?.website?.toString() || "";

            if (!companyEmail.includes("@")) {
                return toast({
                    variant: "destructive",
                    title: "Invalid email.",
                });
            }

            const companyProfileData = {
                companyName,
                companyEmail,
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
    
    const updateBankDetails = async (values: z.infer<typeof BankDetailsSchema>) => {
        try {
            const accHolderName = values?.accHolderName?.toString() || "";
            const accType = values?.accType?.toString() || "";
            const accNumber = values?.accNumber?.toString() || "";
            const ifscNumber = values?.ifscNumber?.toString() || "";

            const bankDetails = {
                accHolderName,
                accType,
                accNumber,
                ifscNumber,
            }

            const userRes = await axiosIWAuth.put("/seller", bankDetails);
            if(userRes){
                toast({
                    title: "Success",
                    description: "Bank Details submitted successfully.",
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
                updateBankDetails
                  
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
