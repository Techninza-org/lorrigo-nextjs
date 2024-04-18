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
import { CancelOrderDialog } from "./cancel-order-dialog";

type ButtonStyles = {
    [key: string]: string;
};

export const OrderButton: React.FC<{ rowData: B2COrderType }> = ({ rowData }) => {
    const orderStage = rowData?.orderStages?.slice(-1)[0]?.stage;

    const orderBucktingStatuses = {
        new: [0],
        "ready-for-pickup": [2, 3, 4],
        "in-transit": [10, 27, 30],
        delivered: [11],
        ndr: [12, 13, 14, 15, 16, 17, 214],
        rto: [18, 19, 118, 198, 199, 201, 212],
    };

    const { onOpen } = useModal();
    const buttonStyles: ButtonStyles = {
        "0": "bg-green-500",
        "1": "bg-blue-500",
        "default": "bg-gray-300 cursor-not-allowed",
    };

    const buttonText: ButtonStyles = {
        "0": "Ship Now",
        "1": "Schedule Pickup",
        "12": "Re-attempt",
        "13": "Re-attempt",
        "14": "Re-attempt",
        "15": "Re-attempt",
        "16": "Re-attempt",
        "17": "Re-attempt",
        "214": "Re-attempt",
        "-1": "Comming Soon",
        "default": "Disabled Button",
    };

    const style = buttonStyles[orderStage?.toString() ?? "default"];
    const text = buttonText[orderStage?.toString() ?? "default"];
    const disabled = orderStage !== 0 && orderStage !== 1;

    if (orderStage === 0) {
        return (
            <>
                <Link href={`/orders/${rowData._id}`}>
                    <Button variant={"themeButton"} size={"sm"} disabled={disabled}>
                        {text}
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
                        <CancelOrderDialog order={rowData} clientRefId={rowData?.order_reference_id ?? rowData._id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </>

        );
    }

    if (orderStage === 1) {
        return (
            <>
                <Button variant={"themeButton"} size={"sm"} onClick={() => { onOpen("schedulePickup", { order: rowData }) }}>
                    {text}
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
                        <CancelOrderDialog order={rowData} clientRefId={rowData?.order_reference_id ?? rowData._id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        );
    }

    if (orderStage === -1) {
        return (
            <Button variant={"webPageBtn"} size={"sm"} onClick={() => onOpen("cloneOrder", { order: rowData })}>Clone Order</Button>
        );
    }
    console.log("orderStage", orderStage)

    if (orderBucktingStatuses.ndr.includes(Number(orderStage))) {
        return (
            <>
                <Button variant={"themeButton"} size={"sm"} onClick={() => onOpen("schedulePickup", { order: rowData })}>Re-attempt</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem>Return</DropdownMenuItem>
                        <DropdownMenuItem>Fake attempt</DropdownMenuItem>
                        <DropdownMenuItem>RTO</DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        );
    }

    return (
        <>
            <Button variant={"themeNavActiveBtn"} size={"sm"} onClick={() => onOpen("downloadLabel", { order: rowData })}>Download Label</Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <OrderCloneButton rowData={rowData} />

                    <DropdownMenuSeparator />

                    <CancelOrderDialog order={rowData} clientRefId={rowData?.order_reference_id ?? rowData._id} />

                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};


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