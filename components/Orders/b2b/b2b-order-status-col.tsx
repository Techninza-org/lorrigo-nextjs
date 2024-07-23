"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, ShoppingCartIcon } from "lucide-react";
import { formatDate } from "date-fns";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { formatCurrencyForIndia, handleCopyText } from "@/lib/utils";
import { Badge } from "../../ui/badge";
import Link from "next/link";
import HoverCardToolTip from "../../hover-card-tooltip";
import { Checkbox } from "../../ui/checkbox";
import { OrderButton, getBucketStatus } from "../order-action-button";
import { B2BOrderButton } from "./b2b-order-action-button";
import { B2BOrderType } from "@/types/B2BTypes";

export const B2BOrderStatusCol: ColumnDef<B2BOrderType>[] = [  ///Changed to any 
    {
        id: "order",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: 'Order Details',
        accessorKey: 'order_reference_id',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p className="font-medium underline underline-offset-4 text-base text-blue-800 flex items-center">
                        <Link href={`/track/b2b/${rowData._id}`}>{rowData.order_reference_id}</Link>
                        <Copy className="ml-2 cursor-pointer" size={15} onClick={() => handleCopyText(`${rowData.order_reference_id}`)} /></p>
                    <p className="uppercase flex gap-1"><ShoppingCartIcon size={18} /> {rowData?.channelName?.toLowerCase() === "shopify" ? "Shopify" : "Custom"}</p>
                </div>
            )
        }
    },
    {
        header: 'Customer Details',
        accessorKey: 'customer',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="space-y-1 items-center">
                    <p>{rowData.customer?.name}</p>
                    <p>{formatPhoneNumberIntl(`${rowData.customer?.phone}`)}</p>
                </div>
            )
        }
    },
    {
        header: 'Package Details',
        cell: ({ row }) => {
            const rowData = row.original;
            const totalVolumetricWeight = rowData.packageDetails?.reduce((total: number, item: any) => {
                const volumetricWeight = ((item.orderBoxLength || 1) * (item.orderBoxWidth || 1) * (item.orderBoxHeight || 1)) / 5000;
                return total + volumetricWeight;
            }, 0);
            const vol = totalVolumetricWeight?.toFixed(3);
            return (
                <div className="space-y-1 items-center">
                    <p>Dead wt. {rowData.total_weight} kg</p>
                    <p>Vol. weight {vol} kg</p>
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
                    <p>{formatCurrencyForIndia(Number(rowData.amount))}</p>
                    <Badge variant={"success"}>{"Prepaid"}</Badge>
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
                    <HoverCardToolTip label={rowData.pickupAddress?.name ?? ''}>
                        {`${rowData.pickupAddress?.address1 ?? ''}, ${rowData.pickupAddress?.address2 ?? ''}, ${rowData.pickupAddress?.city ?? ''}, ${rowData.pickupAddress?.state ?? ''}, ${rowData.pickupAddress?.pincode ?? ''}`}
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
    },
    {
        header: 'Action',
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <div className="flex gap-3 items-center">
                    <B2BOrderButton
                        rowData={rowData}
                    />
                </div>
            )
        }
    },
];