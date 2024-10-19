"use client"
import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import { useModal } from "@/hooks/use-model-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react";
import { B2BOrderType } from "@/types/B2BTypes";
import { downloadFileYURL } from "@/lib/utils";

export const getBucketStatus = (bucket: number) => {
    switch (bucket) {
        case 0:
            return "New";
        case 1:
            return "Ready to Ship";
        case 2:
            return "In Transit";
        case 3:
            return "NDR";
        case 4:
            return "Delivered";
        case 5:
            return "RTO";
        case 6:
            return "Cancelled";
        case 7:
            return "Lost/Damaged";
        case 8:
            return "Disposed";
        default:
            return "Awaiting..";
    }
}

export const CANCELED = 6;


export const B2BOrderButton: React.FC<{ rowData: B2BOrderType }> = ({ rowData }) => {
    let orderStage = rowData.orderStages?.[rowData.orderStages.length - 1]?.stage as number;

    const orderStatusTillUs = [0, 1, 4, 6, 17, 24, 52, 67];
    if (!orderStatusTillUs.includes(orderStage)) {
        orderStage = rowData?.bucket || 0;
    }

    const { onOpen } = useModal();

    const disabled = orderStage !== 0 && orderStage !== 1;

    if (orderStage === 0) {
        return (
            <div className="flex gap-2 items-center">
                <Link href={`/orders/b2b/${rowData._id}`}>
                    <Button variant={"themeButton"} size={"sm"} disabled={disabled}>
                        Ship now
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <OrderEditButton rowData={rowData} />
                        <OrderCloneButton rowData={rowData} />

                        <DropdownMenuSeparator />
                        <OrderCancelButton rowData={rowData} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        );
    }

    if (orderStage === 24 || orderStage === 52) {
        return (
            <div className="flex gap-2 items-center">
                <Button variant={"themeButton"} size={"sm"} onClick={() => { onOpen("schedulePickup", { b2bOrder: rowData }) }}>
                    Schedule Pickup
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <OrderCloneButton rowData={rowData} />
                        <DownloadLabelButton rowData={rowData} />

                        <DropdownMenuSeparator />
                        <OrderCancelButton rowData={rowData} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    if (orderStage === 6) {
        return (
            <Button variant={"webPageBtn"} size={"sm"} onClick={() => onOpen("cloneB2BOrder", { b2bOrder: rowData })}>Clone Order</Button>
        );
    }

    if (orderStage === 67 || orderStage === 4) {
        return (
            <div className="flex gap-2 items-center">
                <Button variant={"themeButton"} size={"sm"} onClick={() => onOpen("downloadB2BManifest", { b2bOrder: rowData })}>Download Manifest</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <OrderCloneButton rowData={rowData} />
                        <DownloadLabelButton rowData={rowData} />
                        <DropdownMenuSeparator />
                        <OrderCancelButton rowData={rowData} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    if (orderStage == 3) {
        return (
            <div className="flex gap-2 items-center">
                <Button variant={"themeButton"} size={"sm"} onClick={() => onOpen("ndrOrder", { b2bOrder: rowData })}>Reattempt</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => onOpen("ndrRTOrder", { b2bOrder: rowData })}>RTO</DropdownMenuItem>
                        <OrderCloneButton rowData={rowData} />
                        <DownloadLabelButton rowData={rowData} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    return (
        <div className="flex gap-2 items-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <OrderCloneButton rowData={rowData} />

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export const OrderCancelButton = ({ rowData }: { rowData: B2BOrderType }) => {
    const { onOpen } = useModal();
    return (
        <DropdownMenuItem disabled onClick={() => onOpen("cancelOrder", { b2bOrder: rowData })} className="text-red-500">Cancel Order</DropdownMenuItem>
    );
}

export const OrderCloneButton: React.FC<{ rowData: B2BOrderType }> = ({ rowData }) => {
    const { onOpen } = useModal();
    return (
        <DropdownMenuItem onClick={() => onOpen("cloneB2BOrder", { b2bOrder: rowData })}>Clone Order</DropdownMenuItem>
    );
}

export const OrderEditButton: React.FC<{ rowData: B2BOrderType }> = ({ rowData }) => {
    const { onOpen } = useModal();
    return (
        <DropdownMenuItem onClick={() => onOpen("editB2BOrder", { b2bOrder: rowData })}>Edit Order</DropdownMenuItem>
    );
}

export const DownloadLabelButton: React.FC<{ rowData: B2BOrderType }> = ({ rowData }) => {
    const { onOpen } = useModal();
    const id = rowData.orderShipmentId
    const isGatiCourier = rowData?.carrierName?.toLowerCase().includes("gati");
    return (
        <>
            {(id && isGatiCourier) ? <DropdownMenuItem onClick={() => downloadFileYURL(
                'http://localhost:4000/api/public/shipment_labels/534916.pdf',
                'shipment_label_534916.pdf'
            )}>Download Label</DropdownMenuItem>
                : <DropdownMenuItem onClick={() => onOpen("downloadB2BLabel", { b2bOrder: rowData })}>Download Label</DropdownMenuItem>
            }
        </>
    );
}