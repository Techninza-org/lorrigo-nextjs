"use client"

import { useEffect } from "react";
import { usePaymentGateway } from "../providers/PaymentGatewayProvider";
import { useParams } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";

export const InvoicePayqment = () => {
    const { confirmInvoicePayment } = usePaymentGateway();
    const { userToken } = useAuth();
    const params = useParams();

    useEffect(() => {
        async function confirmInvoicePay() {
            await confirmInvoicePayment({ params: params?.merchentId?.toString(), invoiceId: params?.invoiceId?.toString() });
        }
        confirmInvoicePay();
    }, [params, userToken]);
    return (
        <div>
            <h1>Success!</h1>
        </div>
    );
}