"use client";
import { ColumnDef } from "@tanstack/react-table";

export const AdminAwbCols: ColumnDef<any>[] = [
    {
        header: 'AWB',
        accessorKey: 'awb',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("awb")}</p>
                </div>
            )
        }
    },
    {
        header: 'Order Id',
        accessorKey: 'orderId',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("orderId")}</p>
                </div>
            )
        }
    },
    {
        header: 'Zone',
        accessorKey: 'zone',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("zone")}</p>
                </div>
            )
        }
    },
    {
        header: 'Recipient',
        accessorKey: 'recipientName',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("recipientName")}</p>
                </div>
            )
        }
    },
    {
        header: 'From City',
        accessorKey: 'fromCity',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("fromCity")}</p>
                </div>
            )
        }
    },
    {
        header: 'To City',
        accessorKey: 'toCity',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("toCity")}</p>
                </div>
            )
        }
    },
    {
        header: 'Forward Charges',
        accessorKey: 'forwardCharges',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{Number(row.getValue("forwardCharges")).toFixed(2)}</p>
                </div>
            )
        }
    },
    {
        header: 'RTO Charges',
        accessorKey: 'rtoCharges',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{Number(row.getValue("rtoCharges")).toFixed(2)}</p>
                </div>
            )
        }
    },
    {
        header: 'COD Charges',
        accessorKey: 'codCharges',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{Number(row.getValue("codCharges")).toFixed(2)}</p>
                </div>
            )
        }
    },
    {
        header: 'Total',
        accessorKey: 'total',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{Number(row.getValue("total")).toFixed(2)}</p>
                </div>
            )
        }
    },
]


