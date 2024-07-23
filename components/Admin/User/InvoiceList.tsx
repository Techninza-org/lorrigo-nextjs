'use client'
import { InvoiceListingCols } from './invoice-listing-col';
import { InvoiceListingTable } from './invoice-listing-table';
import { useSellerProvider } from '@/components/providers/SellerProvider';

const InvoiceList = () => {
    const {invoices} = useSellerProvider();
    
  return (
    <InvoiceListingTable columns={InvoiceListingCols} data={invoices} />
  )
}

export default InvoiceList