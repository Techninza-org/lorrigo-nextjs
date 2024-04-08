"use client";
import { ColumnDef } from "@tanstack/react-table";
import { B2COrderType } from "@/types/types";
import { Copy, ShoppingCartIcon } from "lucide-react";
import { formatDate } from "date-fns";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { formatCurrencyForIndia, handleCopyText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TrackOrder } from "@/components/Orders/track-order-button";

export const AdminShipmentListingCol: ColumnDef<B2COrderType>[] = [
    {
        header: 'Client',
        accessorKey: 'customerDetails',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center">
                        <TrackOrder
                            order={rowData}
                        />
                        <Copy className="ml-2 cursor-pointer" size={15} onClick={() => handleCopyText(`${rowData.order_reference_id}`)} /></p>
                    <p>{formatDate(`${rowData?.order_invoice_date}`, 'dd MM yyyy | HH:mm a')}</p>
                    <p className="uppercase flex gap-1"><ShoppingCartIcon size={18} /> Custom</p>
                </div>
            )
        }
    },
    {
        header: 'Shipment ID',
        accessorKey: 'order_reference_id',
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
        header: 'Address ID',
        accessorKey: 'pickupAddressType',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>Dead wt. 0.5kg</p>
                    <p>{rowData.orderBoxLength} x {rowData.orderBoxWidth} x {rowData.orderBoxHeight} ({rowData.orderSizeUnit})</p>
                    <p>Vol. weight: {Math.ceil(((rowData?.orderBoxLength || 1) * (rowData?.orderBoxWidth || 1) * (rowData?.orderBoxHeight || 1)) / 5000)} ({rowData?.orderWeightUnit})</p>
                </div>
            )
        }
    },
    {
        header: 'Partner',
        accessorKey: 'pickupAddressType',
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
                <div className="space-y-1 items-center">
                    <p className="capitalize">{rowData.pickupAddress?.address1}</p>
                </div>
            )
        }
    },
    {
        header: 'Payment Mode',
        accessorKey: 'payment_mode',
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
        header: 'Weight',
        accessorKey: 'orderWeight',
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
                <div className="flex gap-3 items-center">
                </div>
            )
        }
    },
];