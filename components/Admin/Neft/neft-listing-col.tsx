"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format, formatDate } from "date-fns";

export const NeftListingCols: ColumnDef<any>[] = [
    {
        header: 'Invoice No',
        accessorKey: 'invoiceNumber',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.invoiceNumber}</p>
                </div>
            )
        }
    },
    {
        header: 'Client Name',
        accessorKey: 'client',
        cell: ({ row }) => {
            const rowData = row.original;
            const name = rowData.sellerId?.name;
            return (
                <div className="space-y-1 items-center">
                    <p>{name}</p>
                </div>
            )
        }
    },
    {
        header: 'Ref No',
        accessorKey: 'paymentReferenceNo',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.paymentReferenceNumber}</p>
                </div>
            )
        }
    },
    {
        header: 'Bank',
        accessorKey: 'bankName',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.bankName}</p>
                </div>
            )
        }
    },
    {
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.amount}</p>
                </div>
            )
        }
    },
    {
        header: 'Transaction Date',
        accessorKey: 'transactionDate',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{format(new Date(rowData.transactionDate), 'dd-MM-yyyy')}</p>
                </div>
            )
        }
    },
   
];