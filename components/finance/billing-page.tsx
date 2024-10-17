"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useSellerProvider } from "../providers/SellerProvider"
import { BillingTable } from "./billing-table"
import { SellerB2BBillingCols, SellerBillingCols } from "./billing-table-cols"

export const Billing = () => {
    const { sellerBilling, sellerB2BBilling } = useSellerProvider()
    console.log(sellerBilling, "sellerB2BBilling")
    return (
        <Tabs defaultValue="b2c">
            <TabsList>
                <TabsTrigger value="b2c">B2C</TabsTrigger>
                <TabsTrigger value="b2b">B2B</TabsTrigger>
            </TabsList>
            <TabsContent value="b2c">
                <BillingTable data={sellerBilling || []} columns={SellerBillingCols} />
            </TabsContent>
            <TabsContent value="b2b" >
                <BillingTable data={sellerB2BBilling || []} columns={SellerB2BBillingCols} />
            </TabsContent>
        </Tabs>
    )
}