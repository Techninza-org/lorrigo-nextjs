"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useSellerProvider } from "../providers/SellerProvider"
import { Button } from "../ui/button"
import { CircleAlert, Loader2Icon, TriangleAlertIcon } from "lucide-react"
import { useModal } from "@/hooks/use-model-store"
import { useState } from "react"
import { B2COrderType } from "@/types/types"
import { B2BOrderType } from "@/types/B2BTypes"

// Type guard to check if an object is B2COrderType
function isB2COrder(order: any): order is B2COrderType {
    return order && typeof order._id === 'string';
}

// Type guard to check if an object is B2BOrderType
function isB2BOrder(order: any): order is B2BOrderType {
    return order && (typeof order._id === 'string' || order._id === undefined);
}


export const CancelOrderDialog = () => {
    const { handleCancelOrder } = useSellerProvider()
    const { onClose, type, isOpen, data } = useModal();
    const [isLoading, setIsLoading] = useState(false)
    let { order, b2bOrder } = data;

    let currentOrder: B2COrderType | B2BOrderType | undefined = order;

    // Check if order is undefined and assign b2bOrder if it matches the type
    if (!currentOrder) {
        if (isB2COrder(b2bOrder)) {
            currentOrder = b2bOrder;
        } else if (isB2BOrder(b2bOrder)) {
            currentOrder = b2bOrder;
        }
    }

    const isModalOpen = isOpen && type === "cancelOrder";

    const handleOrder = async (orderId: string, type: "order" | "shipment") => {
        setIsLoading(true)
        const res = await handleCancelOrder([orderId], type);
        if (res) {
            setIsLoading(false)
            handleClose();
        }
    }

    const handleClose = () => {
        onClose();
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="space-y-6">
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center text-xl"><TriangleAlertIcon size={75} className="mx-auto mb-3" color="red" />Do you want to cancel the Order or Shipment?</DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        You can&apos;t undo this action.
                    </DialogDescription>
                    <div className="bg-yellow-100 bg-opacity-60 rounded-md p-4 flex">
                        <CircleAlert size={22} className="text-yellow-600 w-20" />
                        <ul className="text-sm space-y-4">
                            <li>Once the Shipment is cancelled, you can still reassign the Order to a different courier.</li>
                            <li>However, a cancelled Order will not be available in the panel for reassignment. Please choose to cancel the Order only if there is no need to ship it anymore.</li>
                            <li>In-both case, a cancellation request would be went to the courier partner. Once confirmed by the parther, the freight charges will be refunded and credited to your Lorrigo wallet immediately.</li>
                        </ul>
                    </div>
                </DialogHeader>

                {isLoading && <DialogFooter>
                    <Button variant={"destructive"} disabled={isLoading} className="w-full">
                        <Loader2Icon className="animate-spin" />
                    </Button>
                </DialogFooter>}
                {!isLoading && <DialogFooter>

                    <Button variant={"destructive"} disabled={isLoading} className="w-full" onClick={() => handleOrder(currentOrder?._id ?? "", "order")}>
                        Cancel Order
                    </Button>

                    {
                        currentOrder?.awb ? (
                            <Button variant={"secondary"} disabled={isLoading} className="w-full" onClick={() => handleOrder(currentOrder?._id ?? "", "shipment")}>
                                Cancel Shipment
                            </Button>
                        ) : null
                    }

                </DialogFooter>}
            </DialogContent>
        </Dialog>
    )
}