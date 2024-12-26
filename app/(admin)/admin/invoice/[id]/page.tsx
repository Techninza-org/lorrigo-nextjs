import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';
import AdminAwb from '@/components/Admin/Finance/admin-awb';

export default function page({ params }: { params: { id: string } }) {
  return (
    <Card className="col-span-4">
    <CardHeader>
        <CardTitle className="space-y-6">
            <span className="text-base text-gray-600">Transaction Details</span>
            <div className="md:flex  space-y-3 md:space-y-0 md:space-x-3 mt-6 md:mt-0">
                <DollarSign />
                <span className="text-sm sm:text-md">Invoice No. {params.id}</span>
            </div>
        </CardTitle>
    </CardHeader>
    <CardContent className="pl-2">
        <AdminAwb />
    </CardContent>
</Card>
  )
}
