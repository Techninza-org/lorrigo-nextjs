"use client"

import { useAdminProvider } from "@/components/providers/AdminProvider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { VendorBillingTable } from "./vendor-billing-table"
import { AdminB2BVendorBillingCols, AdminVendorBillingCols } from "./vendor-billing-cols"


export const VendorBilling = () => {
    const { clientNVendorBills, b2bClientNVendorBills } = useAdminProvider()
    return (
        <Tabs defaultValue="b2c">
            <TabsList>
                <TabsTrigger value="b2c">B2C</TabsTrigger>
                <TabsTrigger value="b2b">B2B</TabsTrigger>
            </TabsList>
            <TabsContent value="b2c">
                <VendorBillingTable data={clientNVendorBills || []} columns={AdminVendorBillingCols} type={'b2c'} />
            </TabsContent>
            <TabsContent value="b2b" >
                <VendorBillingTable data={b2bClientNVendorBills || []} columns={AdminB2BVendorBillingCols} type={'b2b'} />
            </TabsContent>
        </Tabs>
    )
}