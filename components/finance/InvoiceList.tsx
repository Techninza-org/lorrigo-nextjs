'use client'
import { InvoiceListingCols } from './invoice-listing-col';
import { InvoiceListingTable } from '../Admin/User/invoice-listing-table';
import { useSellerProvider } from '@/components/providers/SellerProvider';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const InvoiceList = () => {
  const [filter, setFilter] = useState('All');
  let filteredInvoice: [] = [];
  const { invoices } = useSellerProvider();
  if (filter === 'Unpaid') {
    filteredInvoice = invoices.filter((invoice: any) => invoice.status === 'unpaid');
  } else if(filter === 'Paid') {
    filteredInvoice = invoices.filter((invoice: any) => invoice.status === 'paid');
  }else {
    filteredInvoice = invoices;
  }

  return (
    <>
      <Select onValueChange={(value) => setFilter(value)}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={filter} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <InvoiceListingTable columns={InvoiceListingCols} data={filteredInvoice} />
    </>
  )
}

export default InvoiceList