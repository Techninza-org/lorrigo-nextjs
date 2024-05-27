"use client"

import { AdminClientBillingCols } from "./client-billing-cols"
import { ClientBillingTable } from "./client-billing-table"
import { useAdminProvider } from "@/components/providers/AdminProvider"

export const ClientBilling = () => {
    const { clientBills } = useAdminProvider()
    return (
        <ClientBillingTable data={clientBills || []} columns={AdminClientBillingCols} />
    )
}