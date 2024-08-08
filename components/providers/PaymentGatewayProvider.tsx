"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useAxios } from "./AxiosProvider";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useAuth } from "./AuthProvider";
import { useOrigin } from "@/hooks/use-origin";
import { PaymentTransaction } from "@/types/types";

interface PaymentGatewayContextType {
    walletBalance: number;
    rechargeWallet: (amount: number) => Promise<void>;
    confirmRecharge: ({ params }: { params: string }) => Promise<void>;
    fetchWalletBalance: () => Promise<void>;
    getAllTransactions: () => Promise<PaymentTransaction[]>;
    payInvoiceIntent: (amount: number, invoiceId: string) => Promise<void>;
    confirmInvoicePayment: ({ params, invoiceId }: { params: string, invoiceId: string }) => Promise<void>;
}

const PaymentGatewayContext = createContext<PaymentGatewayContextType | null>(null);

function PaymentGatewayProvider({ children }: { children: React.ReactNode }) {
    const { axiosIWAuth } = useAxios();
    const { userToken, user } = useAuth();
    const { toast } = useToast();
    const origin = useOrigin();
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
                variant: 'destructive',
            });
        }
    };
    const rechargeWallet = async (amount: number) => {
        try {
            const response = await axiosIWAuth.post('/seller/recharge-wallet', { amount, origin });
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
            await fetchWalletBalance();
            router.push('/dashboard')
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || "An error occurred",
                variant: 'destructive'
            });
        }
    }

    const payInvoiceIntent = async (amount: number, invoiceId: string) => {
        try {
            const response = await axiosIWAuth.post('/seller/pay-invoice', { amount, origin, invoiceId });
            router.push(response.data.url);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || "An error occurred",
                variant: 'destructive'
            });
        }
    }

    const confirmInvoicePayment = async ({ params, invoiceId }: { params: string, invoiceId: string }) => {
        try {
            const response = await axiosIWAuth.post(`/seller/confirm-invoice-payment?merchantTransactionId=${params}&invoiceId=${invoiceId}`);
            await fetchWalletBalance();
            router.push('/dashboard')
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || "An error occurred",
                variant: 'destructive'
            });
        }
    }

    const getAllTransactions = async () => {
        try {
            const response = await axiosIWAuth.get('/seller/transactions');
            return response.data.transactions;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || "An error occurred",
                variant: 'destructive'
            });
        }
    }

    useEffect(() => {
        if ((user || userToken) && user?.role === "seller") {
            fetchWalletBalance();
        }
    }, [user, userToken]);

    return (
        <PaymentGatewayContext.Provider value={{
            walletBalance,
            rechargeWallet,
            confirmRecharge,
            fetchWalletBalance,
            getAllTransactions,
            payInvoiceIntent,
            confirmInvoicePayment
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