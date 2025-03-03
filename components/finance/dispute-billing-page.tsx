"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useSellerProvider } from "../providers/SellerProvider"
import { DisputeBillingTable } from "./dispute-billing-table"
import { DisputeSellerBillingCols } from "./dispute-billing-table-col"

export const DisputeBilling = () => {
    const { sellerBilling, sellerB2BBilling } = useSellerProvider()
    // @ts-ignore
    const disputeSellerBilling = sellerBilling?.filter((bill: { billingAmount: number, disputeAcceptedBySeller: boolean }) => !bill.disputeAcceptedBySeller || !bill.disputeRaisedBySystem)
    const disputeSellerBillingb2b = sellerB2BBilling?.filter((bill: { billingAmount: number }) => bill.billingAmount > 0)
    
    return (
        <Tabs defaultValue="b2c">
            <TabsList>
                <TabsTrigger value="b2c">B2C</TabsTrigger>
                <TabsTrigger value="b2b">B2B</TabsTrigger>
            </TabsList>
            <TabsContent value="b2c">
                <DisputeBillingTable data={disputeSellerBilling || []} columns={DisputeSellerBillingCols} />
            </TabsContent>
            <TabsContent value="b2b" >
                <DisputeBillingTable data={disputeSellerBillingb2b || []} columns={DisputeSellerBillingCols} />
            </TabsContent>
        </Tabs>
    )
}