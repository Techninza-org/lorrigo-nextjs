"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";
import { formatDate } from "date-fns";
import { formatCurrencyForIndia } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const AdminShipmentListingCol: ColumnDef<B2COrderType>[] = [
    {
        header: 'Client',
        accessorKey: 'client',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p>{rowData.customerDetails?.name}</p>
            )
        }
    },
    {
        header: 'Shipment ID',
        accessorKey: 'order_reference_id',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center">
                    <Link href={`/admin/shipment-listing/track/${rowData._id}`}>{rowData.order_reference_id}</Link>
                </p>
            )
        }
    },
    {
        header: 'Address ID',
        accessorKey: 'pickupAddressType',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p>{rowData.pickupAddress._id}</p>
            )
        }
    },
    {
        header: 'Partner',
        accessorKey: 'carrierName',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p>{rowData.carrierName}</p>
            )
        }
    },
    {
        header: 'AWB',
        accessorKey: 'awb',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p>{rowData.awb}</p>
            )
        }
    },

    {
        header: 'Pickup Address',
        accessorKey: 'pickupAddress',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p>{rowData.pickupAddress.address1}, {rowData.pickupAddress.city}, {rowData.pickupAddress.state}</p>
            )
        }
    },
    {
        header: 'Payment Mode',
        accessorKey: 'payment_mode',
        cell: ({ row }) => {
            const rowData = row.original;

            return (
                <div className="space-y-1 items-center">
                    <p>{formatCurrencyForIndia(Number(rowData.productId?.taxable_value))}</p>
                    <Badge variant={rowData.payment_mode == 0 ? "success" : "failure"}>{rowData.payment_mode == 0 ? "Prepaid" : "COD"}</Badge>
                </div>
            )
        }
    },
    {
        header: 'Weight',
        accessorKey: 'orderWeight',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>Dead wt. 0.5kg</p>
                    <p>{rowData.orderBoxLength} x {rowData.orderBoxWidth} x {rowData.orderBoxHeight} ({rowData.orderSizeUnit})</p>
                    <p>Vol. weight: {((rowData?.orderBoxLength || 1) * (rowData?.orderBoxWidth || 1) * (rowData?.orderBoxHeight || 1)) / 5000} ({rowData?.orderWeightUnit})</p>
                </div>
            )
        }
    },
    {
        header: 'Status',
        accessorKey: 'orderStages',
        cell: ({ row }) => {
            const rowData = row.original;
            const orderStage = rowData?.orderStages?.slice(-1)[0];

            return (
                <div className="space-y-1">
                    <Badge variant={orderStage?.stage == -1 ? "failure" : "success"}>{orderStage?.action}
                    </Badge>
                    <p>{formatDate(`${orderStage?.stageDateTime}`, 'dd MM yyyy | HH:mm a')}</p>
                </div>
            )
        }
    },
    {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <p>{formatDate(`${rowData.createdAt}`, 'dd MM yyyy | HH:mm a')}</p>
            )
        }
    },
];