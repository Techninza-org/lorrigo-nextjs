"use client";

import React, { createContext, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useSellerProvider } from "./SellerProvider";
import { z } from "zod";
import { CompanyProfileSchema } from "../Settings/company-profile-form";
import { pickupAddressFormSchema } from "../modal/add-pickup-location";
import { useAxios } from "./AxiosProvider";

interface reqPayload {
    name: string;
    contactPersonName: string;
    email?: string;
    pincode: string;
    address1: string;
    address2?: string;
    phone: string;
    city: string;
    state: string;
}

interface HubContextType {
    handleCreateHub: (hub: reqPayload) => void;
    editPickupLocation: (values: z.infer<typeof pickupAddressFormSchema>, id: string) => void;
    handleUpdateHub: (status: boolean, hubID: string) => Promise<boolean> | boolean;

    updateCompanyProfile: (values: z.infer<typeof CompanyProfileSchema>) => void;
}

const HubContext = createContext<HubContextType | null>(null);

function HubProvider({ children }: { children: React.ReactNode }) {

    const { getHub } = useSellerProvider()
    const { userToken } = useAuth();
    const { axiosIWAuth } = useAxios();

    const { toast } = useToast();
    const router = useRouter()

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
            } else if (res.data.message.includes("Oops! Invalid Data")) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Please Try Again",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: res.data.message || "Something went wrong. Please try again later.",
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

        // try {
        //     const formData = new FormData();
        //     const companyName = values?.companyName?.toString() || "";
        //     const companyEmail = values?.companyEmail?.toString() || "";
        //     const website = values?.website?.toString() || "";

        //     if (!companyEmail.includes("@")) {
        //         return toast({
        //             variant: "destructive",
        //             title: "Invalid email.",
        //         });
        //     }

        //     const myHeaders = new Headers();
        //     myHeaders.append("Authorization", `Bearer ${userToken}`);

        //     const formdata = new FormData();
        //     formdata.append("logo", companyLogo);
        //     formdata.append("companyProfile", `\"{\\\"companyName\\\":\\\"${companyName}\\\",\\\"companyEmail\\\":\\\"${companyEmail}\\\",\\\"website\\\":\\\"${website}\\\"}\"\n`);


        //     const requestOptions = {
        //         method: "PUT",
        //         headers: myHeaders,
        //         body: formdata,
        //         redirect: "follow"
        //     };

        //     fetch("http://localhost:4000/api/seller", { ...requestOptions, redirect: 'follow' })
        //         .then((response) => response.json())
        //         .then((result) => console.log(result))
        //         .catch((error) => console.error(error));

        //     toast({
        //         title: "Success",
        //         description: "Company Profile updated successfully.",
        //     });

        // } catch (error) {
        //     toast({
        //         variant: "destructive",
        //         title: "Error",
        //         description: "error.response.data.message",
        //     });
        // }
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
                companyProfile: {
                    companyName,
                    companyEmail,
                    website,
                }
            }

            const userRes = await axiosIWAuth.put("/seller", companyProfileData);
            if (userRes) {
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

    const editPickupLocation = async (values: z.infer<typeof pickupAddressFormSchema>, id: string) => {
        const update_id = id;

        try {
            const name = values?.facilityName?.toString() || "";
            const contactPersonName = values?.contactPersonName?.toString() || "";
            const phone = values?.phone?.toString() || "";
            const email = values?.email?.toString() || "";
            const address1 = values?.address?.toString() || "";
            const address2 = values?.address?.toString() || "";
            const country = values?.country?.toString() || "";
            const pincode = values?.pincode?.toString() || "";
            const city = values?.city?.toString() || "";
            const state = values?.state?.toString() || "";
            const isRTOAddressSame = values?.isRTOAddressSame || false;
            const rtoAddress = values?.rtoAddress?.toString() || "";
            const rtoCity = values?.rtoCity?.toString() || "";
            const rtoState = values?.rtoState?.toString() || "";
            const rtoPincode = values?.rtoPincode?.toString() || "";

            const pickupLocationData = {
                name,
                contactPersonName,
                phone,
                email,
                address1,
                address2,
                country,
                pincode,
                city,
                state,
                isRTOAddressSame,
                rtoAddress,
                rtoCity,
                rtoState,
                rtoPincode,
            }


            const userRes = await axiosIWAuth.put(`/hub/${update_id}`, pickupLocationData);

            if (userRes.data?.valid) {
                getHub();
                toast({
                    title: "Success",
                    description: "Pickup Location updated successfully.",
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

    const handleUpdateHub = async (status: boolean, hubID: string) => {
        try {
            const userRes = await axiosIWAuth.put(`/hub/${hubID}`, { isActive: status });
            if (userRes?.data?.valid) {
                toast({
                    title: "Success",
                    description: "Hub updated successfully.",
                });
                getHub();
                return true;
            }
            return false;
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response.data.message || "Something went wrong. Please try again later.",
            });
            return false;
        }
    }
    return (
        <HubContext.Provider
            value={{
                handleCreateHub,
                handleUpdateHub,
                updateCompanyProfile,
                editPickupLocation,
                
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
