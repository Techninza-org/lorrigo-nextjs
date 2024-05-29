"use client"

import { createContext, useContext } from "react";
import { useAxios } from "./AxiosProvider";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useSellerProvider } from "./SellerProvider";

interface PaymentGatewayContextType {
    rechargeWallet: (amount: number) => Promise<void>;
    confirmRecharge: ({ params }: { params: string }) => Promise<void>;
}

const PaymentGatewayContext = createContext<PaymentGatewayContextType | null>(null);

function PaymentGatewayProvider({ children }: { children: React.ReactNode }) {

    const { axiosIWAuth } = useAxios();
    const router = useRouter();
    const { toast } = useToast();

    const rechargeWallet = async (amount: number) => {
        const response = await axiosIWAuth.post('/seller/recharge-wallet', { amount });
        router.push(response.data.url);
    }

    const confirmRecharge = async ({ params }: { params: string }) => {
        try {
            const response = await axiosIWAuth.post(`/seller/confirm-recharge-wallet?merchantTransactionId=${params}`);
            router.push('/dashboard')
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                variant: 'destructive'
            });
        }
    }

    return (
        <PaymentGatewayContext.Provider value={{
            rechargeWallet,
            confirmRecharge
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