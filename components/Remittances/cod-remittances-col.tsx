"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, ShoppingCartIcon } from "lucide-react";
import { formatDate, parse } from "date-fns";
import { formatCurrencyForIndia, handleCopyText } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { RemittanceType } from "@/types/types";
import Link from "next/link";

export const OrderStatusCol: ColumnDef<RemittanceType>[] = [
    {
        header: 'Remittance Number',
        accessorKey: 'remittanceId',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center uppercase flex">
                    <Link href={`/finance/remittances/${rowData._id}`} className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center">
                        {rowData.remittanceId}
                    </Link>
                    <Copy className="ml-2 cursor-pointer" size={15} onClick={() => handleCopyText(`${rowData.remittanceId}`)} />
                </div>
            )
        }
    },
    {
        header: 'Date',
        accessorKey: 'remittanceDate',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{formatDate(parse(rowData.remittanceDate, 'yy-MM-dd', new Date()), 'MMM dd, yyyy')}</p>
                </div>
            )
        }
    },
    {
        header: 'Bank Transaction ID',
        accessorKey: 'BankTransactionId',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.BankTransactionId}</p>
                </div>
            )
        }
    },
    {
        header: 'Status',
        accessorKey: 'remittanceStatus',
        cell: ({ row }) => {
            const rowData = row.original;
            const status = rowData.remittanceStatus;
            const statusText: "success" | "failure" | "warning" = status === 'success' ? 'success' : status === 'pending' ? 'warning' : 'failure';
            return (
                <div className="space-y-1 items-center">
                    <Badge variant={statusText} className="capitalize">{status}</Badge>
                </div>
            )
        }
    },
    {
        header: 'Total Remittance Amount',
        accessorKey: 'remittanceAmount',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{formatCurrencyForIndia(rowData.remittanceAmount)}</p>
                </div>
            )
        }
    },


];