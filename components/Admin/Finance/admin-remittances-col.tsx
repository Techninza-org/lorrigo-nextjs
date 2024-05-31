"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, PencilIcon } from "lucide-react";
import { formatDate } from "date-fns";
import { formatCurrencyForIndia, handleCopyText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RemittanceType } from "@/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";

export const AdminRemittancesCols: ColumnDef<RemittanceType>[] = [
    {
        header: 'Remittance Number',
        accessorKey: 'remittanceId',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center uppercase flex">
                    <Link href={`/admin/finance/remittance/${rowData?.sellerId?._id}/${rowData.remittanceId}`} className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center">
                        {rowData.remittanceId}
                    </Link>
                    <Copy className="ml-2 cursor-pointer" size={15} onClick={() => handleCopyText(`${rowData.remittanceId}`)} />
                </div>
            )
        }
    },
    {
        header: 'Client Name',
        accessorKey: 'name',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center uppercase flex">
                    <p>{rowData.sellerId?.name}</p>
                </div>
            )
        }
    },
    {
        header: 'Order Count',
        accessorKey: 'count',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center uppercase flex">
                    <p>{rowData.orders.length}</p>
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
                    <p>{formatDate(`${rowData.remittanceDate}`, 'MMM dd, yyyy')}</p>

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
    {
        header: 'Action',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <UpdateRemittanceButton remittance={rowData} />
                </div>
            )
        }
    },
];

const UpdateRemittanceButton = ({ remittance }: { remittance: RemittanceType }) => {
    const { onOpen } = useModal();
    return (
        <Button variant={'secondary'} size={'icon'} onClick={() => onOpen('adminRemittanceManage', { remittance })}>
            <PencilIcon size={15} />
        </Button>
    )
}