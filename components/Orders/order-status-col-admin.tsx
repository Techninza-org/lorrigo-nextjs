"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";
import { Copy, ShoppingCartIcon } from "lucide-react";
import { formatDate } from "date-fns";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { formatCurrencyForIndia, handleCopyText } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { getBucketStatus } from "./order-action-button";
import Link from "next/link";
import HoverCardToolTip from "../hover-card-tooltip";

export const OrderStatusColAdmin: ColumnDef<B2COrderType>[] = [
    {
        header: 'Order Details',
        accessorKey: 'order_reference_id',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center">
                        <Link href={`/track/${rowData._id}`}>{rowData.order_reference_id}</Link>
                        <Copy className="ml-2 cursor-pointer" size={15} onClick={() => handleCopyText(`${rowData.order_reference_id}`)} /></p>
                    <p>{formatDate(`${rowData?.order_invoice_date}`, 'dd MM yyyy | HH:mm a')}</p>
                    <p className="uppercase flex gap-1"><ShoppingCartIcon size={18} /> Custom</p>
                </div>
            )
        }
    },
    {
        header: 'Customer Details',
        accessorKey: 'customerDetails',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.customerDetails?.name}</p>
                    <p>{rowData.customerDetails?.email}</p>
                    <p>{formatPhoneNumberIntl(`${rowData.customerDetails?.phone}`)}</p>
                </div>
            )
        }
    },
    {
        header: 'Package Details',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>Dead wt. {rowData.orderWeight} {rowData?.orderWeightUnit}</p>
                    <p>{rowData.orderBoxLength} x {rowData.orderBoxWidth} x {rowData.orderBoxHeight} ({rowData.orderSizeUnit})</p>
                    <p>Vol. weight: {((rowData?.orderBoxLength || 1) * (rowData?.orderBoxWidth || 1) * (rowData?.orderBoxHeight || 1)) / 5000} ({rowData?.orderWeightUnit})</p>
                </div>
            )
        }
    },
    {
        header: 'Payment',
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
        header: 'Pickup Address',
        accessorKey: 'pickupAddress',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center cursor-pointer">
                    <HoverCardToolTip label={rowData.pickupAddress.name}>
                        {`${rowData.pickupAddress.address1}, ${rowData.pickupAddress.address2}, ${rowData.pickupAddress.city}, ${rowData.pickupAddress.state}, ${rowData.pickupAddress.pincode}`}
                    </HoverCardToolTip>
                </div>
            )
        }
    },
    {
        header: 'Shipping Details',
        accessorKey: 'awb',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p className="capitalize">{rowData?.carrierName}</p>
                    <p>AWB #<span className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center">
                        {rowData?.awb || "Awaited"}
                        <Copy className="ml-2 cursor-pointer" size={15} onClick={() => handleCopyText(`${rowData.awb || ""}`)} />
                    </span>
                    </p>
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
                    <Badge variant={rowData?.bucket == 6 ? "failure" : "success"}>{getBucketStatus(rowData?.bucket ?? 0)}</Badge>
                    <p>{formatDate(`${orderStage?.stageDateTime}`, 'dd MM yyyy | HH:mm a')}</p>
                </div>
            )
        }
    }
];