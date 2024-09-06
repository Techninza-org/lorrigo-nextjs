"use client";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrencyForIndia } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { IconComponent } from "@/components/transaction-history";

export const WalletTxnCol: ColumnDef<any>[] = [
    {
        header: 'Date Time',
        accessorKey: 'stage',
        cell: ({ row }) => {
            const rowData = row.original;
            const stage = rowData?.stage[rowData?.stage?.length - 1];
            const { dateTime } = stage;
            return (
                <p className="capitalize">
                    {format(new Date(dateTime), 'dd-MM-yyyy hh:mm:ss a')}
                </p>

            )
        }
    },
    {
        header: 'Txn ID',
        accessorKey: 'merchantTransactionId',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p className="capitalize">PID-{rowData.merchantTransactionId || ""}</p>
            )
        }
    },
    {
        header: 'Client',
        accessorKey: 'sellerId',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p className="capitalize">{rowData?.sellerId?.name || ""}</p>
            )
        }
    },
    {
        header: 'Status',
        accessorKey: 'code',
        cell: ({ row }) => {
            const rowData = row.original;
            const stage = rowData?.stage[rowData?.stage?.length - 1];
            const { action, dateTime } = stage;
            const status: any = ["Completed", "PAYMENT_SUCCESSFUL"].includes(action) ? "success" : "destructive";

            return (
                <div className="font-medium underline gap-2 underline-offset-4 text-base text-blue-800 flex items-center">
                    <IconComponent item={rowData} />
                    <Badge className="font-normal" variant={status}>{action}</Badge>
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
                <p className=" flex items-center">
                    {formatCurrencyForIndia(rowData.amount?.toString())}
                </p>
            )
        }
    },
    {
        header: 'Desciption',
        accessorKey: 'desc',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p className=" flex items-center">
                    {rowData.desc}
                </p>
            )
        }
    },
];