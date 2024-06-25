"use client"

import { useAdminProvider } from "@/components/providers/AdminProvider"
import { ClientBillingTable } from "./client-billing-table"
import { AdminVendorBillingCols } from "./vendor-billing-cols"

export const ClientBilling = () => {
    const { clientBills } = useAdminProvider()

    return (
        <ClientBillingTable data={clientBills || []} columns={AdminVendorBillingCols}/>
    )
}