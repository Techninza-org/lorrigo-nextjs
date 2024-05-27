"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";
import { formatCurrencyForIndia } from "@/lib/utils";

export const AdminClientBillingCols: ColumnDef<B2COrderType>[] = [
    {
        header: 'Order ID',
        accessorKey: 'orderRefId',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("orderRefId")}</p>
                </div>
            )
        }
    },
    {
        header: 'AWB number',
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
        header: 'RTO AWB',
        accessorKey: 'rtoAwb',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("rtoAwb")}</p>
                </div>
            )
        }

    },
    {
        header: 'Shipment Status',
        accessorKey: 'shipmentType',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("shipmentType")  ? "COD" : "Prepaid"}</p>
                </div>
            )
        }

    },
    {
        header: 'Recipient Name',
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
        header: 'Origin City',
        accessorKey: 'toCity',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p className="capitalize">{row.getValue("toCity")?.toString()?.toLowerCase()}</p>
                </div>
            )
        }

    },
    {
        header: 'Destination City',
        accessorKey: 'fromCity',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p className="capitalize">{row.getValue("fromCity")?.toString()?.toLowerCase()}</p>
                </div>
            )
        }

    },
    {
        header: 'Charged Weight',
        accessorKey: 'chargedWeight',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("chargedWeight")} Kg</p>
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
        header: 'Forward Applicable',
        accessorKey: 'isForwardApplicable',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("isForwardApplicable") ? "True" : "False"}</p>
                </div>
            )
        }

    },
    {
        header: 'RTO Applicable',
        accessorKey: 'isRTOApplicable',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("isRTOApplicable") ? "True" : "False"}</p>
                </div>
            )
        }
    },
];