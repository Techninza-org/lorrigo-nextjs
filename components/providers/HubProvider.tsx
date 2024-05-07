"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useSellerProvider } from "./SellerProvider";
import { BankDetailsSchema } from "../Settings/bank-details";
import { z } from "zod";
import { CompanyProfileSchema } from "../Settings/company-profile-form";
import { BillingAddressSchema } from "../Settings/billing-address-form";
import { GstinFormSchema } from "../Settings/gstin-form";
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
    updateCompanyProfile: (values: z.infer<typeof CompanyProfileSchema>) => void;
    updateBankDetails: (values: z.infer<typeof BankDetailsSchema>) => void;
    updateBillingAddress: (values: z.infer<typeof BillingAddressSchema>) => void;
    uploadGstinInvoicing: (values: z.infer<typeof GstinFormSchema>) => void;
    editPickupLocation: (values: z.infer<typeof pickupAddressFormSchema>, id: string) => void;
    addBulkAddresses: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCreateHubs: (hubs: reqPayload[]) => Promise<any>;
    handleCompanyLogoChange: (logo: any) => void;
}

const HubContext = createContext<HubContextType | null>(null);

function HubProvider({ children }: { children: React.ReactNode }) {

    const { getHub } = useSellerProvider()
    const { userToken } = useAuth();
    const { axiosIWAuth } = useAxios();

    const { toast } = useToast();
    const router = useRouter()
    const [companyLogo, setCompanyLogo] = useState("");


    const handleCreateHubs = useCallback(async (hubs: reqPayload[]) => {
        try {
            const responses = await Promise.all(hubs.map(hub => axiosIWAuth.post('/hub', hub)));
            const allValid = responses.every(res => res.data.valid);
            if (allValid) {
                getHub();
                toast({
                    variant: "default",
                    title: "Hubs created successfully",
                    description: "Hubs have been created successfully",
                });
                router.refresh();
            } else {
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
    }, [userToken, axiosIWAuth, getHub, router, toast]);

    const addBulkAddresses = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const contents = e.target?.result as string;
                let data: any[];

                // Handle CSV files
                if (file.name.endsWith('.csv')) {
                    const lines = contents.split('\n');
                    data = lines.map(line => line.split(','));
                }
                // Handle XLSX files
                else if (file.name.endsWith('.xlsx')) {
                    const workbook = XLSX.read(contents, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                } else {
                    throw new Error('Unsupported file format');
                }

                const indexNames = ["name", "contactPersonName", "phone", "email", "address1", "pincode", "city", "state"];

                function transformArraysToObjects(data: any[], indexNames: string[]) {
                    return data.slice(1).map(innerArray => {
                        const obj: { [key: string]: any } = {};
                        innerArray.forEach((item: any, index: number) => {
                            if (typeof item === 'string') {
                                const trimmedItem = item.trim();
                                const num = Number(trimmedItem);
                                if (indexNames[index] === 'phone' || indexNames[index] === 'pincode') {
                                    if (!Number.isNaN(num)) {
                                        obj[indexNames[index]] = num;
                                    } else {
                                        toast({
                                            variant: "destructive",
                                            title: "Error",
                                            description: `Invalid Phone or Pincode`,
                                        })
                                    }
                                } else {
                                    obj[indexNames[index]] = trimmedItem;
                                }
                            } else {
                                obj[indexNames[index]] = item;
                            }
                        });
                        return obj;
                    })
                }
                const hubs = transformArraysToObjects(data, indexNames);
                console.log(hubs);
                handleCreateHubs(hubs as reqPayload[]);
            };
            if (file.name.endsWith('.csv')) {
                reader.readAsText(file);
            } else if (file.name.endsWith('.xlsx')) {
                reader.readAsArrayBuffer(file);
            }
        }
    }

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

    const updateBankDetails = async (values: z.infer<typeof BankDetailsSchema>) => {
        try {
            const accHolderName = values?.accHolderName?.toString() || "";
            const accType = values?.accType?.toString() || "";
            const accNumber = values?.accNumber?.toString() || "";
            const ifscNumber = values?.ifscNumber?.toString() || "";

            const bankDetails = {
                bankDetails: {
                    accHolderName,
                    accType,
                    accNumber,
                    ifscNumber,
                }
            }

            const userRes = await axiosIWAuth.put("/seller", bankDetails);
            if (userRes) {
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

    const updateBillingAddress = async (values: z.infer<typeof BillingAddressSchema>) => {
        try {
            const address_line_1 = values?.address_line_1?.toString() || "";
            const address_line_2 = values?.address_line_2?.toString() || "";
            const pincode = values?.pincode?.toString() || "";
            const city = values?.city?.toString() || "";
            const state = values?.state?.toString() || "";
            const phone = values?.phone?.toString() || "";

            const billingAddress = {
                billingAddress: {
                    address_line_1,
                    address_line_2,
                    pincode,
                    city,
                    state,
                    phone,
                }
            }

            const userRes = await axiosIWAuth.put("/seller", billingAddress);
            if (userRes) {
                toast({
                    title: "Success",
                    description: "Billing Address updated successfully.",
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

    const uploadGstinInvoicing = async (values: z.infer<typeof GstinFormSchema>) => {
        try {
            const gstin = values?.gstin?.toString() || "";
            const tan = values?.tan?.toString() || "";
            const deductTDS = values?.deductTDS?.toString() || "";


            const gstinData = {
                gstInvoice: {
                    gstin,
                    tan,
                    deductTDS,
                }
            }

            const userRes = await axiosIWAuth.put("/seller", gstinData);
            if (userRes) {
                toast({
                    title: "Success",
                    description: "GSTIN Details updated successfully.",
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

    const handleCompanyLogoChange = (logo: any) => {
        console.log(logo);
        setCompanyLogo(logo);
    }

    return (
        <HubContext.Provider
            value={{
                handleCreateHub,
                updateCompanyProfile,
                updateBankDetails,
                updateBillingAddress,
                uploadGstinInvoicing,
                editPickupLocation,
                addBulkAddresses,
                handleCreateHubs,
                handleCompanyLogoChange
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
