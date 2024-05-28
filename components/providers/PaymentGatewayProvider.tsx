"use client"

import { createContext, useContext } from "react";
import { useAxios } from "./AxiosProvider";

interface PaymentGatewayContextType {
    rechargeWallet: (amount: number) => Promise<void>;
}

const PaymentGatewayContext = createContext<PaymentGatewayContextType | null>(null);

function PaymentGatewayProvider({ children }: { children: React.ReactNode }) {

    const { axiosIWAuth } = useAxios();


    const rechargeWallet = async (amount: number) => {
        const response = await axiosIWAuth.post('/seller/recharge-wallet', { amount });
        console.log(response.data)

    }



    return (
        <PaymentGatewayContext.Provider value={{
            rechargeWallet
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