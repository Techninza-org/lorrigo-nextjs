"use client"

import { AdminVendorBillingCols } from "./vendor-billing-cols"
import { VendorBillingTable } from "./vendor-billing-table"
import { useAdminProvider } from "@/components/providers/AdminProvider"

export const VendorBilling = () => {
    const { vendorBills } = useAdminProvider()
    return (
        <VendorBillingTable data={vendorBills || []} columns={AdminVendorBillingCols} />
    )
}