"use client"

import { useEffect } from "react";
import { usePaymentGateway } from "../providers/PaymentGatewayProvider";
import { useParams } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";

export const SuccessPayqment = () => {
    const { confirmRecharge } = usePaymentGateway();
    const { userToken } = useAuth();
    const params = useParams();

    useEffect(() => {
        async function confirmPayment() {
            await confirmRecharge({ params: params.merchantTxId.toString() });
        }
        confirmPayment();
    }, [params, userToken]);
    return (
        <div>
            <h1>Success Payment</h1>
        </div>
    );
}