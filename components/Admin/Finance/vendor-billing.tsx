"use client"

import { AdminVendorBillingCols } from "./vendor-billing-cols"
import { VendorBillingTable } from "./vendor-billing-table"
import { useAdminProvider } from "@/components/providers/AdminProvider"

export const VendorBilling = () => {
    const { clientNVendorBills } = useAdminProvider()
    return (
        <VendorBillingTable data={clientNVendorBills || []} columns={AdminVendorBillingCols} />
    )
}