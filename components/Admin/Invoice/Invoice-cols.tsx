"use client";
import { useAdminProvider } from "@/components/providers/AdminProvider";
import { useSellerProvider } from "@/components/providers/SellerProvider";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const InvoiceCols: ColumnDef<any>[] = [
    {
        header: 'Date',
        accessorKey: 'date',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("date")}</p>
                </div>
            )
        }
    },
    {
        header: 'Invoice No.',
        accessorKey: 'invoice_id',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center text-blue-500">
                    <a href={`/admin/invoice/${row.getValue("invoice_id")}`}><p>{row.getValue("invoice_id")}</p></a>
                </div>
            )
        }
    },
    {
        header: 'Client Name',
        accessorKey: 'sellerName',
        cell: ({ row }) => {
            const rowData = row.original;
            const sellerId = rowData.sellerId.name;
            return (
                <div className="space-y-1 items-center">
                    <p>{sellerId}</p>
                </div>
            )
        }
    },
    {
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("amount")}</p>
                </div>
            )
        }
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("status")}</p>
                </div>
            )
        }
    },
    // {
    //     header: "Action",
    //     cell: ({ row }: { row: any }) => {
    //         const isUnpaid = row.original.status === 'pending';
    //         return (
    //             <div className="space-y-1 items-center text-blue-500">
    //                { isUnpaid ? <ReminderButton row={row} /> : null }
    //             </div>
    //         )
    //     }
    // }
]

// const ReminderButton = ({ row }: { row: any }) => {
//     // const { sendReminder } = useAdminProvider();
//     const isReminderSent = row.original.isReminderSent;
//     const id = row.original.invoice_id;
//     return (
//         <Button variant={'themeButton'} disabled={isReminderSent} onClick={() => console.log(id)}>
//             {isReminderSent ? 'Sent' : 'Send Reminder'}
//         </Button>
//     )
// }
