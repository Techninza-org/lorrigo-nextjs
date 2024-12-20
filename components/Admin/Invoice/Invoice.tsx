'use client'

import { useAdminProvider } from "@/components/providers/AdminProvider";
import { InvoiceTable } from "./Invoice-table";
import { InvoiceCols } from "./Invoice-cols";

const Invoice = () => {
  const { invoices } = useAdminProvider();

  return (
    <InvoiceTable columns={InvoiceCols} data={invoices} />
  )
}

export default Invoice