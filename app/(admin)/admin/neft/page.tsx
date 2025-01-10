import Neft from '@/components/Admin/Neft/neft'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function page() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    NEFT Payments
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Neft />
            </CardContent>
        </Card>
    )
}
