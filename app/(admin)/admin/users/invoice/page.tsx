import Invoice from '@/components/Admin/User/invoice'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react'

export default function page() {
  return (
    <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Invoices
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Invoice />
            </CardContent>
        </Card>
  )
}
