'use client'
import { useEffect, useState } from 'react';
import { InvoiceListingTable } from './invoice-listing-table';
import { useAxios } from '@/components/providers/AxiosProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSearchParams } from 'next/navigation';
import { AdminInvoiceListingCols } from './admin-invoice-listing-col';

const AdminInvoiceList = () => {
    const searchParams = useSearchParams();
    const sellerId = searchParams.get('sellerId');
    const [invoices, setInvoices] = useState([]);
    const {axiosIWAuth} = useAxios();
    const {userToken} = useAuth();
  
    const getSellerInvoices = async () => {
        try {
            const res = await axiosIWAuth.get(`/admin/invoice?sellerId=${sellerId}`);
            
            if (res.data?.valid) {
                setInvoices(res.data.invoices);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if (!userToken) return;
        getSellerInvoices() 
        
    }, [userToken, sellerId]);
    
  return (
    <InvoiceListingTable columns={AdminInvoiceListingCols} data={invoices} />
  )
}

export default AdminInvoiceList