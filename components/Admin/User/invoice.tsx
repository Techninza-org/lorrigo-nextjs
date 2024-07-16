'use client'
import { useAxios } from '@/components/providers/AxiosProvider';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Invoice = () => {
    const [invoices, setInvoices] = useState<any>();
    const {axiosIWAuth} = useAxios();
    const searchParams = useSearchParams();
    const sellerId = searchParams.get('sellerId');
    console.log(sellerId);
    const getSellerOrders = async () => {
        try {
            const res = await axiosIWAuth.get(`/admin/invoice?sellerId=${sellerId}`);
            setInvoices(res.data.invoices);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        getSellerOrders();
    }, [])

  return (
    <div>
      {invoices ? (
        invoices
          .map((invoice: any, index: any) => (
            <iframe
              key={index}
              src={`data:application/pdf;base64,${invoice.pdf}`}
              width="100%"
              height="600px"
              title={`Invoice PDF - ${invoice.date}`} 
            />
          ))
      ) : (
        <p>No Invoice Found...</p>
      )}
    </div>
  )
}

export default Invoice