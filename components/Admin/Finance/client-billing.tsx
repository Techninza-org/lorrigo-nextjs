"use client"

import { useAdminProvider } from "@/components/providers/AdminProvider"
import { ClientBillingTable } from "./client-billing-table"
import { AdminClientBillingCols } from "./client-billing-cols"

export const ClientBilling = () => {
    const { clientNVendorBills } = useAdminProvider()

    return (
        <ClientBillingTable data={clientNVendorBills || []} columns={AdminClientBillingCols}/>
    )
}