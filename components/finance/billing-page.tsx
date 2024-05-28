"use client"
import { useSellerProvider } from "../providers/SellerProvider"
import { BillingTable } from "./billing-table"
import { SellerBillingCols } from "./billing-table-cols"

export const Billing = () => {
    const { sellerBilling } = useSellerProvider()
    return (
        <BillingTable data={sellerBilling || []} columns={SellerBillingCols} />
    )
}