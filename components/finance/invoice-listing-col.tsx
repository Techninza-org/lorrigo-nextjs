"use client";

import Link from "next/link";
import InvoiceDetails from "../Admin/User/invoiceDetails";
import { cn } from "@/lib/utils";
import { usePaymentGateway } from "../providers/PaymentGatewayProvider";
import { Badge } from "../ui/badge";

export const InvoiceListingCols: any = [
    {
        header: 'Invoice Number',
        accessorKey: 'invoice_id',
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <Link href={`/finance/invoice/${rowData._id}`}>
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
    {
        header: "Pay Now",
        cell: ({ row }: { row: any }) => {
            const rowData = row.original;
            return (
                <PayNow row={rowData} />
            )
        }
    },
];


const PayNow = ({ row }: { row: any }) => {
    const { payInvoiceIntent } = usePaymentGateway();
    return (
        row?.status?.toLowerCase() === "paid" ? (
            <Badge variant={'secondary'} className="bg-green-100 tracking-wide text-green-500">Paid</Badge>
        ) :
        (
            <button
                disabled={row?.isPrepaidInvoice}
                onClick={() => payInvoiceIntent(row?.amount, row?._id)}
                className={cn(
                    "space-y-1 items-center text-blue-500",
                    row?.isPrepaidInvoice && "hidden disabled:cursor-not-allowed"
                )}
            >
                Pay Now
            </button >
        )
    )
}