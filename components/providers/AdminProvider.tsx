"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useSellerProvider } from "./SellerProvider";
import { AdminType, B2COrderType, RemittanceType, SellerType } from "@/types/types";
import { useAxios } from "./AxiosProvider";
import { ShippinB2BgRate, ShippingRate } from "@/types/AdminTypes";
import { CourierPriceConfigureSchema } from "../Admin/User/user-courier-configure";
import { z } from "zod";
import { B2BCourierPriceConfigureSchema } from "../Admin/User/user-b2b-courier-configure";
import { UserConfigSchema } from "../Admin/User/user-config";
import { B2BOrderType } from "@/types/B2BTypes";
import { WalletDeductionSchema } from "../Admin/Finance/manual-wallet-deduction-form";
import { formatDate } from "date-fns";

interface AdminContextType {
    users: SellerType[];
    currSeller: any;
    allRemittance: RemittanceType[] | null;
    shippingOrders: B2COrderType[];
    shippingB2BOrders: B2BOrderType[];
    allCouriers: ShippingRate[];
    allB2BCouriers: ShippinB2BgRate[];
    assignedCouriers: ShippingRate[];
    assignedB2BCouriers: ShippinB2BgRate[];
    futureRemittance: RemittanceType[] | null;
    handleCreateHub: (hub: AdminType) => void;
    handleSignup: (credentials: any, user: any) => void;
    getAllOrders: (status: string, { fromDate, toDate }: { fromDate: string, toDate: string }) => void;
    handleEditUser: (sellerId: string, user: any) => void;

    upateSellerB2BAssignedCouriers: ({ couriers }: { couriers: string[] }) => void;
    updateSellerCourierPrice: ({ value, sellerId }: { value: z.infer<typeof CourierPriceConfigureSchema>, sellerId: string }) => void;
    updateSellerB2BCourierPrice: ({ value, sellerId }: { value: z.infer<typeof B2BCourierPriceConfigureSchema>, sellerId: string }) => void;
    getSellerAssignedCouriers: () => void;
    upateSellerAssignedCouriers: ({ couriers }: { couriers: string[] }) => void;
    getSellerRemittanceID: (sellerId: string, remittanceId: string) => Promise<RemittanceType> | null;
    clientNVendorBills: any;
    b2bClientNVendorBills: any;
    getClientNVendorBillingData: () => void;
    handleUserConfig: (values: z.infer<typeof UserConfigSchema>) => Promise<boolean> | undefined;
    walletDeduction: (values: z.infer<typeof WalletDeductionSchema>) => Promise<boolean> | undefined;


    manageRemittance: ({ remittanceId, bankTransactionId, status }: { remittanceId: string, bankTransactionId: string, status: string }) => Promise<boolean>;
    getAllWalletTxn: ({ fromDate, toDate }: { fromDate: string, toDate: string }) => void;
    allTxn: any[];
    subadmins: any[];
    handleUpdateSubadminPaths: (id: string, paths: string[]) => Promise<boolean> | undefined;
    handleDeleteSubadmin: (id: string) => void;
    getDisputes: () => void;
    disputes: any[];
    handleAcceptDispute: (id: string, chargedWeight: number) => Promise<boolean>;
    handleRejectDispute: (id: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export default function AdminProvider({ children }: { children: React.ReactNode }) {
    const { getHub } = useSellerProvider()
    const { userToken, user } = useAuth();
    const { axiosIWAuth } = useAxios();

    const [users, setUsers] = useState([]);
    const [currSeller, setCurrSeller] = useState<any>();
    const [shippingOrders, setOrders] = useState<B2COrderType[]>([]);
    const [shippingB2BOrders, setB2BOrders] = useState<B2BOrderType[]>([]);
    const [allRemittance, setAllRemittance] = useState<RemittanceType[] | null>(null);
    const [futureRemittance, setFutureRemittance] = useState<RemittanceType[] | null>(null);
    const [allCouriers, setAllCouriers] = useState<ShippingRate[]>([]);
    const [allB2BCouriers, setAllB2BCouriers] = useState<ShippinB2BgRate[]>([]);
    const [assignedCouriers, setAssignedCouriers] = useState<ShippingRate[]>([]);
    const [assignedB2BCouriers, setAssignedB2BCouriers] = useState<ShippinB2BgRate[]>([]);
    const [clientNVendorBills, setClientNVendorBills] = useState<any>([]);
    const [b2bClientNVendorBills, setB2BClientNVendorBills] = useState<any>([]);
    const [allTxn, setAllTxn] = useState<any>([]);
    const [subadmins, setSubadmins] = useState([])
    const [disputes, setDisputes] = useState([]);

    const { toast } = useToast();
    const router = useRouter()
    const searchParams = useSearchParams()
    const sellerId = searchParams.get('sellerId')
    const defaultToDate = new Date();
    const defaultFromDate = new Date(
        defaultToDate.getFullYear(),
        defaultToDate.getMonth() - 1,
    );


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
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || "An error occurred",
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

    const getDisputes = async () => {
        try {
            const res = await axiosIWAuth.get('/admin/disputes');
            if (res.data?.valid) {
                setDisputes(res.data.disputes)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleAcceptDispute = async (id: string, chargedWeight: number) => {
        try {
            const res = await axiosIWAuth.post(`/admin/disputes/accept`, {
                disputeId: id,
                chargedWeight,
            });
            if (res.data?.valid) {
                toast({
                    variant: "default",
                    title: "Dispute",
                    description: "Dispute accepted successfully",
                });
                return true;
            }
            toast({
                variant: "destructive",
                title: "Dispute",
                description: "Failed to accept dispute",
            });
            return false
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response.data.message || "Something went wrong",
            });
            return false
        }
    }

    const handleRejectDispute = async (id: string) => {
        try {
            const res = await axiosIWAuth.post(`/admin/disputes/reject`, {
                disputeId: id
            });
            if (res.data?.valid) {
                toast({
                    variant: "default",
                    title: "Dispute",
                    description: "Dispute rejected successfully",
                });
                return true;
            }
            toast({
                variant: "destructive",
                title: "Dispute",
                description: "Failed to reject dispute",
            });
            return false
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response.data.message || "Something went wrong",
            });
            return false
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
                const sellerId = response?.data?.user?.id;
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
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || "An error occurred",
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
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || "An error occurred",
            });
        }

    }

    const getAllOrders = async (status: string, { fromDate, toDate }: { fromDate: string, toDate: string }) => {
        let url = status === "all" ? `/admin/all-orders?from=${fromDate}&to=${toDate}` : `/admin/?status=${status}`;
        try {
            const res = await axiosIWAuth.get(url);
            if (res.data?.valid) {
                setOrders(res.data.response.orders);
                setB2BOrders(res.data.response.b2borders);
                return res.data.response.orders
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getAllWalletTxn = async ({ fromDate, toDate }: { fromDate: string, toDate: string }) => {
        let url = `/admin/all-wallet?from=${fromDate}&to=${toDate}`
        try {
            const res = await axiosIWAuth.get(url);
            if (res.data?.valid) {
                setAllTxn(res.data.response.walletTxns);
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
            setAllB2BCouriers(res.data.b2bCouriers)
            return res.data.couriers
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getSellerAssignedCouriers = async () => {
        try {
            if (!sellerId) return
            const res = await axiosIWAuth.get(`/admin/seller-couriers?sellerId=${sellerId}`);
            setAssignedCouriers(res.data.couriers)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getSellerAssignedB2BCouriers = async () => {
        try {
            const res = await axiosIWAuth.get(`/admin/seller-B2B-couriers?sellerId=${sellerId}`);
            setAssignedB2BCouriers(res?.data?.couriers)

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
                description: error?.response?.data?.message || "An error occurred",
            });
            console.error('Error fetching data:', error);
        }
    }

    const updateSellerB2BCourierPrice = async ({ value, sellerId }: { value: z.infer<typeof B2BCourierPriceConfigureSchema>, sellerId: string }) => {
        try {
            const res = await axiosIWAuth.post(`/admin/update-seller-b2b-courier`, {
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
                description: error?.response?.data?.message || "An error occurred",
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
                getAllCouriers()
                getSellerAssignedCouriers()
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
                description: error?.response?.data?.message || "An error occurred",
            });
            console.error('Error fetching data:', error);
        }
    }

    const upateSellerB2BAssignedCouriers = async ({ couriers }: { couriers: string[] }) => {
        try {
            const res = await axiosIWAuth.post(`/admin/manage-seller-b2b-couriers`, {
                couriers,
                sellerId
            });
            if (res.data?.valid) {
                getAllCouriers()
                getSellerAssignedB2BCouriers()
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
                description: error?.response?.data?.message || "An error occurred",
            });
            console.error('Error fetching data:', error);
        }
    }

    const getSellerRemittanceID = async (sellerId: string, remittanceId: string) => {
        try {
            const res = await axiosIWAuth.get(`/admin/seller-remittance?sellerId=${sellerId}&remittanceId=${remittanceId}`);
            if (res.data?.valid) {
                return res.data.remittance;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getClientNVendorBillingData = async () => {
        try {
            const res = await axiosIWAuth.get('/admin/billing/client');
            setClientNVendorBills(res.data.data)
            setB2BClientNVendorBills(res.data.b2bData)
            return res.data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const manageRemittance = async ({ remittanceId, bankTransactionId, status }: { remittanceId: string, bankTransactionId: string, status: string }) => {
        try {
            const res = await axiosIWAuth.post(`/admin/manage-remittance`, {
                remittanceId,
                bankTransactionId,
                status
            });
            if (res.data?.valid) {
                toast({
                    variant: "default",
                    title: "Remittance Updated",
                    description: "Remittance has been updated successfully.",
                });
                getFutureRemittance()
                getAllRemittance()
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error fetching data:', error);
            return false;
        }
    }

    const handleUserConfig = async (values: z.infer<typeof UserConfigSchema>) => {
        try {
            const req = (await axiosIWAuth.put(`/admin/seller/config/${sellerId}`, {
                ...values
            })).data
            toast({
                variant: "default",
                title: "User Config Updated Successfully!"
            })
            return true
        } catch (error) {
            console.error('Error fetching data:', error);
            return false;
        }
    }

    const walletDeduction = async (values: z.infer<typeof WalletDeductionSchema>) => {
        try {
            const res = await axiosIWAuth.post(`/admin/wallet-deduction`, values);
            if (res.data?.valid) {
                toast({
                    variant: "default",
                    title: "Wallet Deduction Success",
                    description: "Wallet deduction has been successful.",
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error fetching data:', error);
            return false;
        }
    }

    const getSeller = async (sellerId: string) => {
        const res = (await axiosIWAuth.get(`/admin/seller?sellerId=${sellerId}`)).data;
        setCurrSeller(res)
    }

    const getSubadmins = async () => {
        try {
            const res = await axiosIWAuth.get(`/admin/subadmins`);
            if (res.data?.valid) {
                setSubadmins(res.data.subadmins)
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to get subadmins",
                });
            }
        } catch (error) {
            // toast({
            //     variant: "destructive",
            //     title: "Failed to get subadmins",
            // });

        }
    }

    const handleUpdateSubadminPaths = async (id: string, paths: string[]) => {
        try {
            const res = await axiosIWAuth.put(`/admin/subadmins/${id}`, { paths });
            if (res.data?.valid) {
                toast({
                    variant: "default",
                    title: "Subadmin Departments Updated Successfully",
                });
                getSubadmins();
                return true;
            }
            getSubadmins();
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    const handleDeleteSubadmin = async (id: string) => {
        try {
            const res = await axiosIWAuth.delete(`/admin/subadmins/delete/${id}`)
            if (res.data?.valid) {
                toast({
                    variant: "default",
                    title: "Subadmin Deleted Successfully",
                });
                getSubadmins();
                return true;
            }
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    useEffect(() => {
        if ((!!user || !!userToken) && user?.role === "admin") {
            // getAllOrders("all", { fromDate: defaultFromDate, toDate: defaultToDate });
            getAllSellers();
            getAllRemittance();

            getAllCouriers()
            getSellerAssignedCouriers()
            getFutureRemittance()
            getClientNVendorBillingData()
            getSubadmins()
            getDisputes()
        }
    }, [user, userToken])

    useEffect(() => {
        if ((!!user || !!userToken) && user?.role === "admin" && sellerId) {
            getSeller(sellerId);
            getSellerAssignedCouriers()
            getSellerAssignedB2BCouriers()
        }
    }, [user, userToken, sellerId])

    return (
        <AdminContext.Provider
            value={{
                users,
                currSeller,
                allRemittance,
                getAllOrders,
                shippingB2BOrders,
                futureRemittance,
                shippingOrders,
                allCouriers,
                allB2BCouriers,
                assignedCouriers,
                assignedB2BCouriers,
                handleCreateHub,
                handleSignup,
                handleEditUser,
                handleUserConfig,

                upateSellerB2BAssignedCouriers,
                updateSellerCourierPrice,
                updateSellerB2BCourierPrice,
                getSellerAssignedCouriers,
                getSellerRemittanceID,
                upateSellerAssignedCouriers,
                manageRemittance,
                clientNVendorBills,
                getClientNVendorBillingData,
                walletDeduction,
                getAllWalletTxn,
                b2bClientNVendorBills,
                allTxn,
                subadmins,
                handleUpdateSubadminPaths,
                handleDeleteSubadmin,
                getDisputes,
                disputes,
                handleAcceptDispute,
                handleRejectDispute

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
