"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useAdminProvider } from "@/components/providers/AdminProvider"
import { ClientBillingTable } from "./client-billing-table"
import { AdminB2BClientBillingCols, AdminClientBillingCols } from "./client-billing-cols"

export const ClientBilling = () => {
    const { clientNVendorBills, b2bClientNVendorBills } = useAdminProvider()

    return (
        <Tabs defaultValue="b2c">
            <TabsList>
                <TabsTrigger value="b2c">B2C</TabsTrigger>
                <TabsTrigger value="b2b">B2B</TabsTrigger>
            </TabsList>
            <TabsContent value="b2c">
                <ClientBillingTable data={clientNVendorBills || []} columns={AdminClientBillingCols} />
            </TabsContent>
            <TabsContent value="b2b" >
                <ClientBillingTable data={b2bClientNVendorBills || []} columns={AdminB2BClientBillingCols} />
            </TabsContent>
        </Tabs>
    )
}