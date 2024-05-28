"use client"

import { createContext, useContext } from "react";

interface PaymentGatewayContextType {
   
}

const PaymentGatewayContext = createContext<PaymentGatewayContextType | null>(null);

function PaymentGatewayProvider({ children }: { children: React.ReactNode }) {




    return (
        <PaymentGatewayContext.Provider value={{
           
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