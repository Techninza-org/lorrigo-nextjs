'use client'
import { useAuth } from '@/components/providers/AuthProvider';
import { useAxios } from '@/components/providers/AxiosProvider';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function AdminInvoiceById() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState<{ pdf: string } | null>(null)
    const {axiosIWAuth} = useAxios();
    const {userToken} = useAuth();
  
    const getSellerInvoice = async () => {
        try {
            const res = await axiosIWAuth.get(`/admin/invoice/${id}`);
            
            if (res.data?.valid) {
                setInvoice(res.data.invoice);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if (!userToken) return;
        getSellerInvoice() 
        
    }, [userToken]);
    return (
        <div>
           {invoice && <iframe src={`data:application/pdf;base64,${invoice.pdf}`} width="100%" height="800px"></iframe>}
        </div>
    )
}
