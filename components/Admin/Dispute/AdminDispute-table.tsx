'use client'
import React from 'react'
import { DisputeTable } from './dispute-table'
import { AdminDisputeColDefs } from './dispute-cols'
import { useAdminProvider } from '@/components/providers/AdminProvider'

const AdminDisputeTable = () => {
    const { disputes } = useAdminProvider();
    console.log(disputes, "disputes");

    return (
        <DisputeTable data={disputes || []} columns={AdminDisputeColDefs} />
    )
}

export default AdminDisputeTable