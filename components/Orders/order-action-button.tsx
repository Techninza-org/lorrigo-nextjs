"use client"
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { B2COrderType } from "@/types/types";
import { useModal } from "@/hooks/use-model-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react";

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


export const OrderButton: React.FC<{ rowData: B2COrderType }> = ({ rowData }) => {
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
                <Link href={`/orders/${rowData._id}`}>
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
                <Button variant={"themeButton"} size={"sm"} onClick={() => { onOpen("schedulePickup", { order: rowData }) }}>
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
            <Button variant={"webPageBtn"} size={"sm"} onClick={() => onOpen("cloneOrder", { order: rowData })}>Clone Order</Button>
        );
    }

    if (orderStage === 67 || orderStage === 4) {
        return (
            <div className="flex gap-2 items-center">
                <Button variant={"themeButton"} size={"sm"} onClick={() => onOpen("downloadManifest", { order: rowData })}>Download Manifest</Button>
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
                <Button variant={"themeButton"} size={"sm"} onClick={() => onOpen("ndrOrder", { order: rowData })}>Reattempt</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => onOpen("ndrRTOrder", { order: rowData })}>RTO</DropdownMenuItem>
                        <OrderCloneButton rowData={rowData} />
                        <DownloadLabelButton rowData={rowData} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    return (
        // <div className="flex gap-2 items-center">
        //     {/* <Button variant={"themeNavActiveBtn"} size={"sm"} onClick={() => onOpen("downloadLabel", { order: rowData })}>Download Label</Button> */}
        //     <DropdownMenu>
        //         <DropdownMenuTrigger asChild>
        //             <Button variant="ghost" className="h-8 w-8 p-0">
        //                 <span className="sr-only">Open menu</span>
        //                 <MoreHorizontalIcon className="h-4 w-4" />
        //             </Button>
        //         </DropdownMenuTrigger>
        //         <DropdownMenuContent align="start">
        //             <OrderCloneButton rowData={rowData} />

        //             <DropdownMenuSeparator />
        //             <OrderCancelButton rowData={rowData} />ndr

        //         </DropdownMenuContent>
        //     </DropdownMenu>
        // </div>
        <div className="flex gap-2 items-center">
            {/* <Button variant={"themeButton"} size={"sm"} onClick={() => onOpen("ndrOrder", { order: rowData })}>Reattempt</Button> */}
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

export const OrderCancelButton = ({ rowData }: { rowData: B2COrderType }) => {
    const { onOpen } = useModal();
    return (
        <DropdownMenuItem onClick={() => onOpen("cancelOrder", { order: rowData })} className="text-red-500">Cancel Order</DropdownMenuItem>
    );
}

export const OrderCloneButton: React.FC<{ rowData: B2COrderType }> = ({ rowData }) => {
    const { onOpen } = useModal();
    return (
        <DropdownMenuItem onClick={() => onOpen("cloneOrder", { order: rowData })}>Clone Order</DropdownMenuItem>
    );
}

export const OrderEditButton: React.FC<{ rowData: B2COrderType }> = ({ rowData }) => {
    const { onOpen } = useModal();
    return (
        <DropdownMenuItem onClick={() => onOpen("editOrder", { order: rowData })}>Edit Order</DropdownMenuItem>
    );
}

export const DownloadLabelButton: React.FC<{ rowData: B2COrderType }> = ({ rowData }) => {
    const { onOpen } = useModal();
    return (
        <DropdownMenuItem onClick={() => onOpen("downloadLabel", { order: rowData })}>Download Label</DropdownMenuItem>
    );
}