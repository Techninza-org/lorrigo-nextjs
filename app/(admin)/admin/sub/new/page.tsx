import CreateSubAdmin from '@/components/Admin/Sub/CreateSub'
import AdminProvider from '@/components/providers/AdminProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="md:flex justify-between space-y-3">
                    Add SubAdmin
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CreateSubAdmin />
            </CardContent>
        </Card>
    )
}

export default page