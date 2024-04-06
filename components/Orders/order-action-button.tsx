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
    const { onOpen } = useModal();
    const buttonStyles: ButtonStyles = {
        "0": "bg-green-500",
        "1": "bg-blue-500",
        "default": "bg-gray-300 cursor-not-allowed",
    };

    const buttonText: ButtonStyles = {
        "0": "Ship Now",
        "1": "Schedule Pickup",
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
                        <DownloadInvoiceButton rowData={rowData} />
                        

                        <DropdownMenuSeparator />
                        <CancelOrderDialog order={rowData} clientRefId={rowData?.order_reference_id ?? rowData._id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </>

        );
    }

    if (orderStage === 1) {
        return (
            <Button variant={"themeButton"} size={"sm"} onClick={() => { onOpen("schedulePickup", { order: rowData }) }}>
                {text}
            </Button>
        );
    }

    if (orderStage === -1) {
        return (
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
        );
    }

    return (
        <CancelOrderDialog order={rowData} clientRefId={rowData?.order_reference_id ?? rowData._id} />
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

export const DownloadInvoiceButton: React.FC<{ rowData: B2COrderType }> = ({ rowData }) => {
    const { onOpen } = useModal();
    return (
        <DropdownMenuItem onClick={() => onOpen("downloadInvoice", { order: rowData })}>Download Invoice</DropdownMenuItem>
    );
}