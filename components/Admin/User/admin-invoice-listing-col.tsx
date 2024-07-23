"use client";

import Link from "next/link";
import InvoiceDetails from "./invoiceDetails";

export const AdminInvoiceListingCols: any = [
    {   
        header: 'Invoice Number',
        accessorKey: 'invoice_id',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                     <Link href={`/admin/users/invoice/${rowData._id}`}>
                        <p className="text-blue-500 hover:text-blue-700">{rowData.invoice_id}</p>
                     </Link>
                </div>
            )
        }
    },
    {
        header: 'Invoice Date',
        accessorKey: 'date',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.date}</p>
                </div>
            )
        }
    },
    {
        header: 'Invoice Amount',
        accessorKey: 'amount',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>&#8377; {rowData.amount}</p>
                </div>
            )
        }
    },
    {
        header: "Download",
        accessorKey: 'pdf',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center text-blue-500">
                    <InvoiceDetails pdf={rowData.pdf} />
                </div>
            )
        }
    },
];
