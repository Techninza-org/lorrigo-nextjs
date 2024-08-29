"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";
import HoverCardToolTip from "@/components/hover-card-tooltip";
import { InfoIcon } from "lucide-react";
import { formatCurrencyForIndia } from "@/lib/utils";

export const AdminClientBillingCols: ColumnDef<B2COrderType>[] = [
    {
        header: 'Client Name',
        accessorKey: 'sellerId',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">

                    <p>
                        {
                            // @ts-ignore
                            rowData?.sellerId?.name || "N/A"
                        }
                    </p>
                </div>
            )
        }
    },
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
                    <p>{row.getValue("shipmentType") ? "COD" : "Prepaid"}</p>
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
        header: 'Vendor Name',
        accessorKey: 'vendorWNickName',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p className="capitalize">{row.getValue("vendorWNickName")?.toString()?.toLowerCase()}</p>
                </div>
            )
        }
    },
    {
        header: 'Charged Weight',
        accessorKey: 'chargedWeight',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p className="flex gap-1 items-center">
                        <span className="flex">{row.getValue("chargedWeight")} Kg</span>
                        <HoverCardToolTip Icon={<InfoIcon size={13} />} side="top" className="flex-col max-w-fit">
                            <div>Increment Price: {rowData.incrementPrice}</div>
                            <div>Base Price: {rowData.basePrice}</div>
                            <div>Increment Weight: {rowData.incrementWeight}</div>
                            <div>Base Weight: {rowData.baseWeight}</div>
                        </HoverCardToolTip>
                    </p>
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

export const AdminB2BClientBillingCols: ColumnDef<B2COrderType>[] = [
    {
        header: 'Client Name',
        accessorKey: 'sellerId',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">

                    <p>
                        {
                            // @ts-ignore
                            rowData?.sellerId?.name || "N/A"
                        }
                    </p>
                </div>
            )
        }
    },
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
        header: 'Weight',
        accessorKey: 'orderWeight',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("orderWeight")}kg</p>
                </div>
            )
        }
    },
    {
        header: 'ODA Applicable',
        accessorKey: 'isODAApplicable',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{row.getValue("isODAApplicable") || "False"}</p>
                </div>
            )
        }
    },
    {
        header: 'Other Charges',
        accessorKey: 'otherCharges',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{formatCurrencyForIndia(row.getValue("otherCharges") || 0)}</p>
                </div>
            )
        }
    },
    {
        header: 'Charged Amount',
        accessorKey: 'billingAmount',
        cell: ({ row }) => {
            return (
                <div className="space-y-1 items-center">
                    <p>{formatCurrencyForIndia(row.getValue("billingAmount") || 0)}</p>
                </div>
            )
        }
    },

];