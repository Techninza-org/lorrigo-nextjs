'use client'
import { useSellerProvider } from '@/components/providers/SellerProvider';
import { useParams } from 'next/navigation'
import React from 'react'

export default function InvoiceById() {
        const { id } = useParams();
        const {invoices} = useSellerProvider();
        const invoice = invoices?.find((i: { _id: string | string[]; }) => i._id === id);

    return (
        <div>
           {invoice && <iframe src={`data:application/pdf;base64,${invoice.pdf}`} width="100%" height="800px"></iframe>}
        </div>
    )
}
