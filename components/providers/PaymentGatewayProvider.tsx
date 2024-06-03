"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useAxios } from "./AxiosProvider";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useAuth } from "./AuthProvider";

interface PaymentGatewayContextType {
    walletBalance: number;
    rechargeWallet: (amount: number) => Promise<void>;
    confirmRecharge: ({ params }: { params: string }) => Promise<void>;
    fetchWalletBalance: () => Promise<void>;
}

const PaymentGatewayContext = createContext<PaymentGatewayContextType | null>(null);

function PaymentGatewayProvider({ children }: { children: React.ReactNode }) {

    const { axiosIWAuth } = useAxios();
    const { userToken, user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [walletBalance, setWalletBalance] = useState(0);

    const fetchWalletBalance = async () => {
        try {
            const response = await axiosIWAuth.get('/seller/wallet-balance');
            setWalletBalance(response.data.walletBalance);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || "An error occurred",
                variant: 'destructive'
            });
        }
    }

    const rechargeWallet = async (amount: number) => {
        try {
            const response = await axiosIWAuth.post('/seller/recharge-wallet', { amount });
            router.push(response.data.url);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || "An error occurred",
                variant: 'destructive'
            });
        }
    }

    const confirmRecharge = async ({ params }: { params: string }) => {
        try {
            const response = await axiosIWAuth.post(`/seller/confirm-recharge-wallet?merchantTransactionId=${params}`);
            router.push('/dashboard')
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || "An error occurred",
                variant: 'destructive'
            });
        }
    }

    // useEffect(() => {
    //     if ((!!user || !!userToken) && user?.role === "seller") {
    //         fetchWalletBalance();
    //     }
    // }, [confirmRecharge, user, userToken]);

    return (
        <PaymentGatewayContext.Provider value={{
            walletBalance,
            rechargeWallet,
            confirmRecharge,
            fetchWalletBalance
        }}>
            {children}
        </PaymentGatewayContext.Provider>
    );
}

export default PaymentGatewayProvider;

export const usePaymentGateway = () => {
    const context = useContext(PaymentGatewayContext);
    if (!context) {
        throw new Error('usePaymentGateway must be used within an PaymentGatewayProvider');
    }
    return context;
}