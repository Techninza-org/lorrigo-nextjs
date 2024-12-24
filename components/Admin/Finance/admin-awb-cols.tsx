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


